# Projeto LavaCar
#### Este é o projeto para gerenciar agendamentos de serviços em um lava-car.

#

## Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (versão recomendada: 16.x ou superior)
- [npm](https://www.npmjs.com/) (normalmente instalado junto com o Node.js)

#

## Configuração do ambiente

1. Clone o repositório:

```sh
   git clone <URL-do-seu-repositório>
   cd <nome-do-seu-repositório> 
 ```

2. Crie um arquivo .env na raiz do projeto e adicione a variável de ambiente:

```sh
    DATABASE_URL="mysql://root:example@localhost:3307/lavacar"
 ```

#

## Executando o projeto

1. Construa e inicie os contêineres Docker:

```sh
    docker-compose up -d
 ```
  Isso irá iniciar um contêiner MySQL com a base de dados necessária.

2. Instale as dependências do projeto:

```sh
    npm install
 ``` 

3. Execute as migrações do banco de dados para criar as tabelas necessárias:

```sh
    npx prisma migrate dev
 ```

4. Inicie o servidor de desenvolvimento:

```sh
    npm run dev
 ```

