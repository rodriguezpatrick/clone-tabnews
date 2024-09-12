import database from "infra/database.js";

async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const postgresVersionQuery = await database.query("SHOW server_version;");
  const postgresVersionString = postgresVersionQuery.rows[0].server_version;

  const maxConections = await database.query("SHOW max_connections;");
  const usedConections = await database.query(
    "select count(*) FROM pg_stat_activity WHERE datname = 'local_db';",
  );
  console.log(usedConections);

  response.status(200).json({
    updated_at: updatedAt,
    depedencies: {
      database: {
        max_connections: maxConections.rows[0].max_connections,
        opened_connections: usedConections.rows.length,
      },
      postgres_version: postgresVersionString,
    },
  });
}

export default status;
