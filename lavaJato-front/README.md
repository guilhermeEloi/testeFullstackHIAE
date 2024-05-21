# LavaCar Frontend

## Pré-requisitos

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (versão recomendada: 16.x ou superior)
- [npm](https://www.npmjs.com/) (normalmente instalado junto com o Node.js)

## Configuração do ambiente

1. Clone o repositório:

    ```sh
    git clone <https://github.com/guilhermeEloi/testeFullstackHIAE.git>
    cd lavaJato-frontend
    ```

2. Crie um arquivo `.env` na raiz do projeto e adicione as variáveis de ambiente conforme necessário para o seu projeto. Por exemplo:

    ```sh
    VITE_API_URL="http://localhost:3000"
    ```

## Executando o projeto

1. Construa a imagem Docker do projeto:

    ```sh
    docker build --no-cache -t lavacar-frontend .
    ```

2. Inicie o contêiner Docker:

    ```sh
    docker run -p 3001:3001 lavacar-frontend
    ```

    Isso irá iniciar o contêiner Docker e mapear a porta 3001 do contêiner para a porta 3001 do host local.

3. Acesse o aplicativo no navegador:

    Abra seu navegador e acesse `http://localhost:3001`.

4. Para desenvolvimento local (fora do Docker), instale as dependências do projeto:

    ```sh
    npm install
    ```

5. Inicie o servidor de desenvolvimento:

    ```sh
    npm run dev
    ```

## Notas

- Certifique-se de que o backend está sendo executado e acessível na URL configurada no `.env`.
- Se você estiver usando Docker para ambos frontend e backend, ajuste as URLs conforme necessário para garantir que eles possam se comunicar corretamente.
