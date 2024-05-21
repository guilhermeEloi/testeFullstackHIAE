# Usa a imagem oficial do Node.js como base
FROM node:16

# Define o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copia os arquivos de package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto dos arquivos do projeto para o diretório de trabalho
COPY . .

# Compila o projeto React
RUN npm run build

# Expõe a porta 3000 do contêiner
EXPOSE 3000

# Comando para iniciar o servidor quando o contêiner for executado
CMD ["npm", "start"]
