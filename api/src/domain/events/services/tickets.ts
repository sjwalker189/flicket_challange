import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { EventService } from "./events";
import { PurchaseStatus } from "@prisma/client";

@Injectable()
export class TicketService {
  constructor(
    private prisma: PrismaService,
    private events: EventService
  ) {
    // In a real production app this should be run on schedule worker thread
    // and the concurrency managed via a queue
    setInterval(() => {
      this.releaseAbandonedTickets().catch((e) => console.error(e));
    }, 60_000);
  }

  /**
   * Reserve a ticket for an event with a specified quantity
   *
   * @remarks
   * A reserved ticket is used to complete a ticket purchase
   */
  async reserveTicketsForEvent(eventId: number, quantity: number) {
    if (quantity <= 0) {
      throw new Error("Quantity must be greater than zero");
    }

    // Perform the comparison of available ticket quantity against the resrved quantity inside
    // of database transaction. This provides deterministic results and ensures that the
    // ticket limit has not been exeeded in the intervening time of executing
    // this function
    return await this.prisma.$transaction(async (tx) => {
      const event = await tx.event.findFirst(
        this.events.getEventByIdQuery(eventId)
      );
      if (!event) {
        throw new Error("Event not found");
      }

      // Ensure we will not oversell this event

      // This is really unfortunate: I would not use prisma again. I wanted to do a subquery to
      // sum the quantity on the related tickets and include the count as a field
      // This feels bad :(
      const ticketsTaken = event.tickets.reduce(
        (sum, x) => sum + x.quantity,
        0
      );

      if (ticketsTaken + quantity > event.ticketsLimit) {
        if (quantity === 1) {
          throw new Error("Sorry, this event has sold out.");
        } else {
          throw new Error(
            `Sorry, there are only ${event.ticketsLimit - ticketsTaken} tickets remaining.`
          );
        }
      }

      const ticket = await tx.ticket.create({
        data: {
          eventId: event.id,
          quantity,
          status: PurchaseStatus.Reserved,
        },
      });

      return ticket;
    });
  }

  /**
   * To confirm a purchase of a ticket customer details
   *
   * @remarks
   * Any tickets that have been reserved but not confirmed within a
   * period of time will be released so that other customers may
   * purchase them
   */
  async confirmTicketPurchase(
    ticketId: number,
    customerDetails: { name: string; email: string }
  ) {
    const ticket = await this.prisma.ticket.findFirstOrThrow({
      where: { id: ticketId },
    });

    if (ticket.status === PurchaseStatus.Sold) {
      throw new Error("This ticket has already been sold.");
    }

    if (ticket.status === PurchaseStatus.Refunded) {
      throw new Error(
        "This ticket has been refunded. Please reserve a new ticket."
      );
    }

    const customer = await this.findOrCreateCustomer(customerDetails);

    return await this.prisma.ticket.update({
      where: {
        id: ticketId,
      },
      data: {
        status: PurchaseStatus.Sold,
        customerId: customer.id,
        updatedAt: new Date(),
      },
    });
  }

  private async findOrCreateCustomer(params: { name: string; email: string }) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        email: params.email,
      },
    });

    if (customer) {
      return customer;
    }

    return await this.prisma.customer.create({
      data: params,
    });
  }

  /**
   * Delete all tickets that we're not sold within 5 minutes of being reserved
   */
  private async releaseAbandonedTickets() {
    const reservationWindow = new Date(Date.now() - 1000 * 60 * 5);

    await this.prisma.ticket.deleteMany({
      where: {
        status: PurchaseStatus.Reserved,
        updatedAt: {
          lte: reservationWindow,
        },
      },
    });
  }
}
