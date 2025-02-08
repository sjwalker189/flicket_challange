
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export interface CustomerDetails {
    name: string;
    email: string;
}

export interface EventParams {
    name: string;
    description: string;
    ticketsLimit: number;
}

export interface Event {
    id?: Nullable<number>;
    name?: Nullable<string>;
    description?: Nullable<string>;
}

export interface Ticket {
    id?: Nullable<number>;
    quantity?: Nullable<number>;
}

export interface IQuery {
    events(): Nullable<Nullable<Event>[]> | Promise<Nullable<Nullable<Event>[]>>;
    findEvent(id?: Nullable<number>): Nullable<Event> | Promise<Nullable<Event>>;
}

export interface IMutation {
    createEvent(event: EventParams): Event | Promise<Event>;
    reserveTicket(eventId: number, quantity: number): Nullable<Ticket> | Promise<Nullable<Ticket>>;
    confirmTicket(ticketId: number, customerDetails: CustomerDetails): Nullable<Ticket> | Promise<Nullable<Ticket>>;
}

type Nullable<T> = T | null;
