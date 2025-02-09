# Flicket Challange

## A few notes:

Outside of a brief exploration of Next, I have no previous experience with any of the technologies used in this stack.
 
I've prioritied completing the API (which I have done) rather than focusing too deeply on the Next.js side of the fence. I wanted to make a best effort to use the recommended technology choices. As such this took time away from end-to-end completion. Though, I felt it was important to atleast have graphql integrated on the client side and fetching _some_ data.

I chose Prisma for database access with sqlite for expediency. I don't have a running postgres install and did not want to waste time configuring docker. I chose prisma because of it's dead simple schema definitions and abiliy to sync this with the database. Unfortunately, their API's are limited and I could not write the queries in the way I would do if I were writing plain SQL or using a query builder.

Regarding GraphQL, I opted for the schema first approach with Nest. It did not provide the type safety I exepectd. I would chose the code first approach next time.

## Running the API server

The API server is implemented with Nest.js, TypeScript and Graphql. It will run at http://localhost:3001/ and you can access the `/graphql` path to interact with the graphql API.

```bash
cd api

bin/setup

npm run start
```

_Note: Files in `bin/` are assumed to be executable and assumes a unix platform. (Not supporting Windows)_

## API

The following graphql resolvers have been implemented:

`events` - List all events in the system 

```graphql
query Events {
  events {
     id
     name
     description  
  }
}
```

`findEvent` - Find an event by id

```graphql
query Event($id: Int) {
  findEvent(eventId: $id) {
     id
     name
     description  
  }
}
```

`createEvent` - Create a new event

```graphql
input EventParams {
   name: String!
   description: String!
   ticketsLimit: Int!
}

mutation Action($params: EventParams!) {
  createEvent(event: EventParams) {
     id
     name
     description  
  }
}
```

`reserveTicket` - Reserve a number of tickets for an event 

Returns the ID of the reserved ticket only
A ticket can be reserved only when the quantity requested is less than the remaining quantity which is determined by the sum of `Sold` and `Reserved` tickets. 

```graphql
mutation Action($eventId: Int!, $quantity: Int!) {
  reserveTicket(eventId: $eventId, quantity: $quantity) {
     id
  }
}
```

`confirmTicket` - Confirm a ticket sale by attaching a customer

Marks the ticket as sold
If not completed within 5 minutes the ticket will be released (deleted)

```graphql
input CustomerDetails {
  name: String!
  email: String!
}

mutation Action($ticketId: Int!, $customer: CustomerDetails!) {
  reserveTicket(ticketId: $ticketId, customerDetails: $customer) {
     id
  }
}
```

## Running the App server

The app server is a next js application using the pages router and TypeScript. It will be available at http://localhost:3000/.

I did not have time to complete the UI portion of this challange. The current state will list all events on the home page (if any exist).

```bash
cd app
npm ci
npm run dev
```
