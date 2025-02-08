import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma";
import { EventService } from "./services/events";
import { TicketService } from "./services/tickets";
import { EventResolver } from "./graphql/resolver";

@Module({
  providers: [EventService, TicketService, EventResolver, PrismaService],
})
export class EventModule {}
