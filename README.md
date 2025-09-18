# SimpleJSMicroservice

A two-tier microservice application for Kubernetes deployment.

- **Front-End:** React (product list, cart, fake checkout)
- **Back-End:** Node.js (Express) API
- **Database:** Azure Cosmos DB (MongoDB API)

## Features
- List grocery products
- Add/remove products to cart
- Fake checkout (no payment integration)
- Product images (to be provided)
- Database seeded with sample data on API startup

## Deployment
- Designed for Kubernetes

## Setup
This repository was split into separate services. Services live under `services/`.

Run product service locally:

```sh
cd services/product-service
npm install
npm run dev
```

Run cart service locally:

```sh
cd services/cart-service
npm install
npm run dev
```

The frontend lives in the `frontend/` folder and can be started with its existing scripts.
