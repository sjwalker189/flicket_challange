
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CustomerDetails {
    name: string;
    email: string;
}

export class EventParams {
    name: string;
    description: string;
    ticketsLimit: number;
}

export class Event {
    id?: Nullable<number>;
    name?: Nullable<string>;
    description?: Nullable<string>;
}

export class Ticket {
    id?: Nullable<number>;
    quantity?: Nullable<number>;
}

export abstract class IQuery {
    abstract events(): Nullable<Nullable<Event>[]> | Promise<Nullable<Nullable<Event>[]>>;

    abstract findEvent(id?: Nullable<number>): Nullable<Event> | Promise<Nullable<Event>>;
}

export abstract class IMutation {
    abstract createEvent(event: EventParams): Event | Promise<Event>;

    abstract reserveTicket(eventId: number, quantity: number): Nullable<Ticket> | Promise<Nullable<Ticket>>;

    abstract confirmTicket(ticketId: number, customerDetails: CustomerDetails): Nullable<Ticket> | Promise<Nullable<Ticket>>;
}

type Nullable<T> = T | null;
