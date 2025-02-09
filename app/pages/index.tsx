import Head from "next/head";
import { Card, Flex, Heading, Text } from "@radix-ui/themes";
import { gql, useQuery } from "@apollo/client";

export default function Home() {
  return (
    <>
      <Head>
        <title>Flicket Challange</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Heading>Events</Heading>
        <EventList />
      </main>
    </>
  );
}

type Event = {
  id: number;
  name: string;
  description: string;
};

function EventList() {
  const { data, loading, error } = useQuery<{ events: Event[] }>(gql`
    {
      events {
        id
        name
        description
      }
    }
  `);

  if (error) {
    return <Text color="red">{error.message}</Text>;
  }

  if (loading) {
    return <Text color="gray">Loading events...</Text>;
  }

  if (!data?.events.length) {
    return <Text>No events found</Text>;
  }

  return (
    <Flex gap="1" direction={"column"}>
      {data?.events.map((event) => (
        <Card key={event.id}>
          <Text weight={"bold"}>{event.name}</Text>
        </Card>
      ))}
    </Flex>
  );
}
