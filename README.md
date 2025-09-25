# hello-fastify

A minimal Fastify API example following best practices for Node.js APIs using modern ES Modules, environment variables, and containerization.

---

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- Fast and minimal API using [Fastify](https://www.fastify.io/)
- Modern ES Modules syntax
- Environment-based configuration

## Requirements

- Node.js v18 or higher
- [pnpm](https://pnpm.io/) package manager

## Getting Started

### Installation

```sh
pnpm install
```

### Running Locally

```sh
pnpm run dev
```

The server will start on the port and host defined in your `.env` file (defaults: `0.0.0.0:3000`).

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```
PORT=3000
HOST=0.0.0.0
```

## API Endpoints

| Method | Path | Description         |
|--------|------|---------------------|
| GET    | /    | Returns Hello World |

Example response:

```json
{
  "message": "Hello World"
}
```

## Project Structure

```
hello-fastify/
├── docker/
│   ├── Dockerfile
│   └── .dockerignore
├── src/
│   └── server.js
├── .env.example
├── .env
├── package.json
└── README.md
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](LICENSE)
