import { GraphQLDefinitionsFactory } from "@nestjs/graphql";
import { join } from "node:path";

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory
  .generate({
    typePaths: ["./src/**/*.graphql"],
    path: join(process.cwd(), "src/graphql.schema.ts"),
    outputAs: "class",
  })
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
