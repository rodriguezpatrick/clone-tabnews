import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  // checando o valor do updated_at
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <ul>
        <li>
          <UpdatedAt />
        </li>
        <li>
          <DatabaseInfo propertyName="max_connections" />
        </li>
        <li>
          <DatabaseInfo propertyName="opened_connections" />
        </li>
        <li>
          <DatabaseInfo propertyName="postgres_version" />
        </li>
      </ul>
    </>
  );
}

function UpdatedAt() {
  // const response
  const { isLoading, data } = useSWR(
    "http://localhost:3000/api/v1/status",
    fetchAPI,
    {
      refreshInterval: 2000,
    },
  );

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }
  return <div>Última Atualização: {updatedAtText}</div>;
}

function DatabaseInfo({ propertyName }) {
  const { isLoading, data } = useSWR(
    "http://localhost:3000/api/v1/status",
    fetchAPI,
  );

  let value = "Carregando...";

  if (!isLoading && data) {
    value = data.depedencies.database[propertyName];
  }
  if (!isLoading && data && propertyName === "postgres_version") {
    value = data.depedencies[propertyName];
  }

  console.log(value);

  return (
    <div>
      {propertyName === "max_connections" && `Máximo de Conexões: ${value}`}
      {propertyName === "opened_connections" && `Conexões Abertas: ${value}`}
      {propertyName === "postgres_version" && `Versão do Postgres: ${value}`}
    </div>
  );
}
