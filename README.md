# Biblioteca de Histórias Bíblicas

Aplicativo de biblioteca de histórias bíblicas desenvolvido com React Native, Expo e TypeScript.

## Recursos

- Navegação entre diferentes categorias de histórias
- Histórias em destaque
- Conteúdo premium
- Favoritos
- Visualização detalhada de histórias
- Compartilhamento de histórias
- Interface personalizada de acordo com preferências

## Pré-requisitos

- Node.js (versão 12 ou superior)
- NPM ou Yarn
- Expo CLI

## Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd baiano-app
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

## Executando o aplicativo

```bash
# Iniciar o aplicativo com o Expo
npm start
# ou
npm run dev
```

Isso iniciará o Expo Developer Tools, onde você pode escolher executar o aplicativo em um emulador (Android/iOS) ou em seu dispositivo físico através do aplicativo Expo Go.

## Estrutura do Projeto

```
src/
├── assets/          # Imagens e recursos estáticos
├── components/      # Componentes reutilizáveis
├── constants/       # Constantes (cores, temas, etc.)
├── hooks/           # Hooks personalizados
├── navigation/      # Configuração de navegação
├── screens/         # Telas do aplicativo
├── services/        # Serviços (Firebase, API, etc.)
└── types/           # Definições de tipos TypeScript
```

## Tecnologias Utilizadas

- React Native
- Expo
- TypeScript
- Firebase (Firestore)
- React Navigation

## Licença

Este projeto está licenciado sob a licença MIT. 