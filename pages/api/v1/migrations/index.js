import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";
import { createRouter } from "next-connect";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler).post(postHandler);

export default router.handler(controller.errorsHandlers);

async function getHandler(request, response) {
  const dbClient = await database.getNewClient();
  const options = await migrationOptions(dbClient);
  try {
    console.log("Entrou no GET");
    const pendingMigrations = await migrationRunner(options);
    await dbClient.end();
    return response.status(200).json(pendingMigrations);
  } finally {
    await dbClient.end();
  }
}
async function postHandler(request, response) {
  const dbClient = await database.getNewClient();
  const options = await migrationOptions(dbClient);
  try {
    console.log("Entrou no POST");
    const migratedMigrations = await migrationRunner({
      ...options,
      dryRun: false,
    });

    await dbClient.end();

    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }

    return response.status(200).json(migratedMigrations);
  } finally {
    await dbClient.end();
  }
}

async function migrationOptions(dbClient) {
  return {
    dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };
}
