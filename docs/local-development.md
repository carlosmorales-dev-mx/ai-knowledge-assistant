# Local Development

## Services

### Backend
Runs on:
- `http://localhost:9000`

Health check:
- `GET /health`

### ChromaDB
Runs via Docker on:
- `http://localhost:8000`

Start ChromaDB:
```bash
cd infra/docker
docker compose up -d