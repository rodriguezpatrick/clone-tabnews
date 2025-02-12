#!/bin/bash

# Função para parar os serviços ao sair
cleanup() {
  echo "Parando serviços..."
  npm run services:stop 
  exit 0
}

# Captura SIGINT (CTRL + C) e SIGTERM para chamar cleanup()
trap cleanup SIGINT SIGTERM

# Verifica o argumento passado para definir se é dev ou test
if [[ $1 == "dev" ]]; then
  echo "Iniciando ambiente de desenvolvimento..."
  
  npm run services:up
  npm run services:wait:database
  npm run migrations:up
  next dev

elif [[ $1 == "test" ]]; then
  echo "Iniciando testes..."
  
  npm run services:up
  concurrently --names next,jest --hide next --kill-others -s command-jest "next dev" "jest --runInBand --verbose"

else
  echo "Uso: $0 {dev|test}"
  exit 1
fi

cleanup
