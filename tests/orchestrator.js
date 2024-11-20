import retry from "async-retry";

// aguarda todos os serviços estarem prontos
async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    return retry(fetchStatusPage, {
      retries: 100,
      maxTimeout: 1000,
    });

    async function fetchStatusPage() {
      const response = await fetch("http://localhost:3000/api/v1/status");
      if (response.status !== 200) {
        throw Error();
      }
      // vai estourar um erro e o retry vai tentar fazer novamente até dar certo. É assim que o retry funciona.
    }
  }
}

export default {
  waitForAllServices,
};