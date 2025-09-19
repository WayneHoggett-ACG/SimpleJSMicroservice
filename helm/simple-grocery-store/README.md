# Simple Grocery Store Helm Chart

This Helm chart deploys the Simple Grocery Store application, consisting of:
- **Frontend**: A React-based web application served via Nginx.
- **Product Service**: A Node.js service for managing grocery products, with optional MongoDB integration.
- **Cart Service**: A Node.js service for managing shopping carts (in-memory).

## Prerequisites

- Kubernetes cluster (v1.19+)
- Helm (v3.0+)
- (Optional) MongoDB instance for product persistence (if not provided, product service uses in-memory storage)

## Installation

1. Clone the repository and navigate to the chart directory:
   ```bash
   cd helm/simple-grocery-store
   ```

2. Customize `values.yaml` as needed (see Configuration section).

3. Install the chart:
   ```bash
   helm install simple-grocery-store ./simple-grocery-store -f values.yaml
   ```

## Configuration

The chart is highly configurable via `values.yaml`. Key sections:

### Global Settings
- `global.imageRegistry`: Default image registry (e.g., `""` for Docker Hub)

### Product Service
- `productService.image.repository`: Container image
- `productService.image.tag`: Image tag
- `productService.secret.create`: Whether to create a Secret for MongoDB URI (default: true)
- `productService.secret.name`: Name of the Secret (if not creating, provide externally)
- `productService.env.MONGODB_URI`: MongoDB connection string (base64 encoded in Secret)
- `productService.resources`: CPU/memory limits and requests
- `productService.replicaCount`: Number of replicas

### Cart Service
- `cartService.image.repository`: Container image
- `cartService.image.tag`: Image tag
- `cartService.resources`: CPU/memory limits and requests
- `cartService.replicaCount`: Number of replicas

### Frontend
- `frontend.image.repository`: Container image
- `frontend.image.tag`: Image tag
- `frontend.resources`: CPU/memory limits and requests
- `frontend.replicaCount`: Number of replicas

### Security
- `serviceAccount.name`: Custom ServiceAccount name (optional)
- Pod and container security contexts are applied by default (non-root, no privilege escalation, dropped capabilities)

## Usage Notes

- **MongoDB**: If `productService.secret.create` is `true`, the chart creates a Secret with `mongodb-uri`. For production, set to `false` and manage the Secret externally.
- **Security**: The chart enforces security best practices with non-root containers, resource limits, and ServiceAccount usage.
- **Scaling**: Adjust `replicaCount` for each service. Consider using an Ingress for external access.
- **Development**: For local development, you can override image tags to use local builds.

## Uninstall

```bash
helm uninstall simple-grocery-store
```

## Troubleshooting

- Check pod logs: `kubectl logs -l app=<service-name>`
- Verify Secrets: `kubectl get secrets`
- Ensure MongoDB connectivity if using persistent products.
