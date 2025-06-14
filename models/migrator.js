import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database.js";

async function listPendingMigrations() {
  const dbClient = await database.getNewClient();
  const options = await migrationOptions(dbClient);
  try {
    console.log("Entrou no GET");
    const pendingMigrations = await migrationRunner(options);
    await dbClient.end();
    return pendingMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  const dbClient = await database.getNewClient();
  const options = await migrationOptions(dbClient);
  try {
    console.log("Entrou no POST");
    const migratedMigrations = await migrationRunner({
      ...options,
      dryRun: false,
    });

    return migratedMigrations;
  } finally {
    await dbClient?.end();
  }
}

async function migrationOptions(dbClient) {
  return {
    dbClient,
    databaseUrl: process.env.DATABASE_URL,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    log: () => {},
    migrationsTable: "pgmigrations",
  };
}

const migrator = {
  listPendingMigrations,
  runPendingMigrations,
};

export default migrator;
