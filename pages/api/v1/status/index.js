import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller.js";

const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorsHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVersionQuery = await database.query("SHOW server_version;");
  const postgresVersionString = postgresVersionQuery.rows[0].server_version;

  const maxConections = await database.query("SHOW max_connections;");

  const databaseName = process.env.POSTGRES_DB;
  const usedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });

  response.status(200).json({
    updated_at: updatedAt,
    depedencies: {
      database: {
        max_connections: maxConections.rows[0].max_connections,
        opened_connections: usedConnections.rows[0].count,
      },
      postgres_version: postgresVersionString,
    },
  });
}
