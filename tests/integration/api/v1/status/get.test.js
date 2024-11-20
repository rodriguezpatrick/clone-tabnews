import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  // checando o valor do updated_at

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  // console.log(responseBody);

  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parseUpdatedAt);

  // max connections

  const maximumConnections = responseBody.depedencies.database.max_connections;
  const maximumConnectionParsed = parseInt(maximumConnections);
  expect(maximumConnectionParsed).toBe(100);

  // opened conections
  const ConnectionsOpen = responseBody.depedencies.database.opened_connections;
  expect(ConnectionsOpen).toEqual(1);
});
