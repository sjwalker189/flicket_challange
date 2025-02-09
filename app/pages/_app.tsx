import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import type { AppProps } from "next/app";
import { ApolloProvider } from "@apollo/client";
import apollo from "../lib/apollo";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Theme>
      <ApolloProvider client={apollo}>
        <Component {...pageProps} />
      </ApolloProvider>
    </Theme>
  );
}
