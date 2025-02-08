import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { EventService } from "../services/events";
import { TicketService } from "../services/tickets";

@Resolver("Event")
export class EventResolver {
  constructor(
    private $events: EventService,
    private $tickets: TicketService
  ) {}

  @Query()
  async events() {
    return await this.$events.getEventList();
  }

  @Query()
  async findEvent(eventId: number) {
    const event = await this.$events.getEventById(eventId);
    if (event) {
      return event;
    }
    throw new Error("Event not found");
  }

  @Mutation()
  async createEvent(
    @Args("event")
    params: {
      name: string;
      description: string;
      ticketsLimit: number;
    }
  ) {
    return await this.$events.createEvent(params);
  }

  @Mutation()
  async reserveTicket(
    @Args("eventId") eventId: number,
    @Args("quantity") quantity: number
  ) {
    const { id } = await this.$tickets.reserveTicketsForEvent(
      eventId,
      quantity
    );

    return { id, quantity };
  }

  @Mutation()
  async confirmTicket(
    @Args("ticketId") ticketId: number,
    @Args("customerDetails") customerDetails: { name: string; email: string }
  ) {
    const { id, quantity } = await this.$tickets.confirmTicketPurchase(
      ticketId,
      customerDetails
    );

    return { id, quantity };
  }
}
