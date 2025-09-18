This Helm chart deploys the Simple Grocery Store frontend and backend services.

Usage notes:
- Set `backend.env.MONGODB_URI` via `values.yaml` or provide a Kubernetes Secret and set `backend.secret.create: false` to manage it externally.
- The chart creates a ServiceAccount and applies non-root security defaults for pods and containers.
- For production, review resource requests/limits and set `replicaCount` > 1 behind an ingress.

Example helm install:

helm install simple-grocery-store ./simple-grocery-store -f values.yaml
