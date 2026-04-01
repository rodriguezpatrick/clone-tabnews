import orchestrator from "tests/orchestrator.js";
import webserver from "infra/webserver.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
});

describe("PUT /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response1 = await fetch(`${webserver.origin}/api/v1/migrations`, {
          method: "PUT",
        });
        expect(response1.status).toBe(405);
        const responseBody1 = await response1.json();

        expect(responseBody1).toEqual({
          name: "MethodNotAllowedError",
          message: "Método não permitido para este endpoint.",
          action:
            "Verifique se o método HTTP enviado é válido para este endpoint",
          status_code: 405,
        });
      });
    });
  });
});
