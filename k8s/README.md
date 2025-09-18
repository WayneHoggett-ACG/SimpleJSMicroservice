# Simple Grocery Store - Kubernetes Deployment

This directory contains Kubernetes manifests and Helm charts for deploying the Simple Grocery Store microservice application.

## Architecture

- **Frontend**: React application served by nginx (Port 80)
- **Backend**: Node.js/Express API (Port 4000)
- **Database**: External CosmosDB (accessed via connection string)

## Deployment Options

### Option 1: Using Helm (Recommended)

1. **Install the Helm chart:**
   ```bash
   helm install simple-grocery-store ./helm/simple-grocery-store
   ```

2. **Upgrade the deployment:**
   ```bash
   helm upgrade simple-grocery-store ./helm/simple-grocery-store
   ```

3. **Uninstall:**
   ```bash
   helm uninstall simple-grocery-store
   ```

4. **Custom values:**
   ```bash
   helm install simple-grocery-store ./helm/simple-grocery-store -f custom-values.yaml
   ```

### Option 2: Using Kubectl with manifests

1. **Create the backend secret with your CosmosDB connection string:**
   ```bash
   # Encode your connection string
   echo -n "your-cosmosdb-connection-string" | base64
   
   # Edit the secret file and add the base64 encoded string
   # Then apply it
   kubectl apply -f k8s/backend-secret.yaml
   ```

2. **Deploy all components:**
   ```bash
   kubectl apply -f k8s/
   ```

2. **Deploy individual components:**
   ```bash
   kubectl apply -f k8s/backend-secret.yaml
   kubectl apply -f k8s/backend.yaml
   kubectl apply -f k8s/frontend.yaml
   ```

3. **Delete deployment:**
   ```bash
   kubectl delete -f k8s/
   ```

## Building and Pushing Docker Images

1. **Build images:**
   ```bash
   # Backend
   docker build -t simple-grocery-store/backend:latest ./backend
   
   # Frontend
   docker build -t simple-grocery-store/frontend:latest ./frontend
   ```

2. **Push to your registry:**
   ```bash
   # Tag for your registry
   docker tag simple-grocery-store/backend:latest your-registry/simple-grocery-store/backend:latest
   docker tag simple-grocery-store/frontend:latest your-registry/simple-grocery-store/frontend:latest
   
   # Push
   docker push your-registry/simple-grocery-store/backend:latest
   docker push your-registry/simple-grocery-store/frontend:latest
   ```

3. **Update values.yaml or manifests with your registry:**
   ```yaml
   global:
     imageRegistry: "your-registry/"
   ```

## Services

After deployment, the following ClusterIP services will be available:

- `frontend-service`: Frontend application (Port 80)
- `backend-service`: Backend API (Port 4000)

The backend connects to your external CosmosDB using the connection string stored in the `backend-secrets` Kubernetes secret.

## Accessing the Application

The application runs with ClusterIP services by default. To access it, you can:

1. **Port forward (for testing):**
   ```bash
   kubectl port-forward svc/frontend-service 8080:80
   kubectl port-forward svc/backend-service 4000:4000
   ```

2. **Add an Ingress or Gateway** (recommended for production)

## Configuration

### Helm Values

Key configuration options in `values.yaml`:

```yaml
# Image configuration
backend:
  image:
    repository: simple-grocery-store/backend
    tag: "latest"
  env:
    MONGODB_URI: "your-cosmosdb-connection-string"

frontend:
  image:
    repository: simple-grocery-store/frontend
    tag: "latest"

# Resource limits
backend:
  resources:
    limits:
      cpu: 500m
      memory: 512Mi
```

### Setting up CosmosDB Connection

1. **For Helm deployment:**
   ```bash
   helm install simple-grocery-store ./helm/simple-grocery-store \
     --set backend.env.MONGODB_URI="your-cosmosdb-connection-string"
   ```

2. **For kubectl deployment:**
   ```bash
   # Create secret manually
   kubectl create secret generic backend-secrets \
     --from-literal=mongodb-uri="your-cosmosdb-connection-string"
   ```

### Environment Variables

The backend uses these environment variables:

- `NODE_ENV`: Set to "production"
- `MONGODB_URI`: CosmosDB connection string (stored in Kubernetes secret)
- `PORT`: Backend port (default: 4000)

## Health Checks

Both frontend and backend include:

- **Liveness probes**: Restart containers if unhealthy
- **Readiness probes**: Route traffic only to ready containers

## Monitoring

The deployment includes proper labels for monitoring and service discovery:

- `app.kubernetes.io/name: simple-grocery-store`
- `app.kubernetes.io/component: frontend|backend|database`
- `app.kubernetes.io/version: 1.0.0`

## Troubleshooting

1. **Check pod status:**
   ```bash
   kubectl get pods -l app.kubernetes.io/name=simple-grocery-store
   ```

2. **View logs:**
   ```bash
   kubectl logs -l app=backend
   kubectl logs -l app=frontend
   ```

3. **Describe resources:**
   ```bash
   kubectl describe deployment backend-deployment
   kubectl describe service backend-service
   ```

4. **Test connectivity to CosmosDB:**
   ```bash
   kubectl exec -it deployment/backend-deployment -- printenv MONGODB_URI
   ```
