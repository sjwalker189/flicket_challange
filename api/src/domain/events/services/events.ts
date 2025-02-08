import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma";
import { PurchaseStatus } from "@prisma/client";

type EventData = {
  id: number;
  name: string;
  description: string;
  ticketsLimit: number;
  ticketsTaken: number;
};

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {
    //
  }

  async getEventList(): Promise<Array<EventData>> {
    const events = await this.prisma.event.findMany({
      include: {
        tickets: {
          select: { quantity: true },
          where: {
            status: {
              not: PurchaseStatus.Refunded,
            },
          },
        },
      },
    });

    return events.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description,
      ticketsLimit: event.ticketsLimit,
      ticketsTaken: event.tickets.reduce((sum, x) => sum + x.quantity, 0),
    }));
  }

  // I'm not happy about this, but I need this in order to use the same query for
  // use in transactions. I typically would write my functions such that they
  // accept all dependencies. In this case my query functions would look like
  //
  // async getEventById(client, params)
  //
  // where client is a type that can be either PrismaClient or the Narrowed transaction type
  getEventByIdQuery(eventId: number) {
    return {
      where: {
        id: eventId,
      },
      include: {
        tickets: {
          select: { quantity: true },
          where: {
            status: {
              not: PurchaseStatus.Refunded,
            },
          },
        },
      },
    };
  }

  async getEventById(eventId: number): Promise<EventData | undefined> {
    const result = await this.prisma.event.findFirst(
      this.getEventByIdQuery(eventId)
    );

    if (result) {
      return {
        id: result.id,
        name: result.name,
        description: result.description,
        ticketsLimit: result.ticketsLimit,
        ticketsTaken: result.tickets.reduce((sum, x) => sum + x.quantity, 0),
      };
    }

    return undefined;
  }

  async createEvent(data: {
    name: string;
    description: string;
    ticketsLimit: number;
  }): Promise<EventData> {
    const { id, name, description, ticketsLimit } =
      await this.prisma.event.create({
        data,
      });

    return {
      id,
      name,
      description,
      ticketsLimit,
      ticketsTaken: 0,
    };
  }
}
