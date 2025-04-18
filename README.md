# Express SIMS PPOB

A simple Express.js application for managing SIMS PPOB (Payment Point Online Bank) services.

## Features

- User authentication and authorization
- Payment processing for various services
- Transaction history
- Balance management
- RESTful API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MySQL

## Installation

1. Clone the repository:
```bash
git clone https://github.com/oozaw/express-sims-ppob.git
cd express-sims-ppob
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=sims_ppob
DB_PORT=3306
JWT_SECRET=your_jwt_secret
```

## Running the Application

### Development mode
```bash
npm run dev
# or
yarn dev
```

### Production mode
```bash
npm start
# or
yarn start
```