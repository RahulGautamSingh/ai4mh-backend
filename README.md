# Local Development

This document gives instructions on how to run this project locally.

## Installation

### Prerequisites

You need to the following dependencies for local development:

- Node.js
- npm
- Install prisma `npm install -g prisma`

## Fork and Clone

1. Fork this repository using the GitHub web interface
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/ai4mh-backend.git
cd ai4mh-backend
```

## Environment Variables

Create a `.env` file in the root directory and add the following env variables:

```ini
DATABASE_URL=postgresql://your-db-url
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
PORT=5000
FRONTEND_URL=http://localhost:5173

```

!!!note Replace the values with your actual config.

## Install Dependencies

```bash
npm install
```

## Prisma Setup

1. Generate the Prisma client:

```bash
npx prisma generate
```

## Run the App

```bash
npm run start
```
