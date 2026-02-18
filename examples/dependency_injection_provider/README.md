# Dependency Injection Provider Example

This server-only example plugin exposes a start contract using Inversify and Core DI.

## Run Kibana with examples enabled

```bash
yarn start --run-examples --no-base-path
```

## What it exposes

The provider binds a `Start` contract named `DependencyInjectionProviderStart` with:

- `transform(message: string): string`

The contract currently prefixes the input with `[provider]`.

## Consumer route using this contract

The companion consumer plugin exposes:

- `POST /api/di/consumer/transform`

That route injects this provider's start contract and returns both the original and transformed values.

## Curl example

Use `KIBANA_URL` that matches your Kibana dev URL. If you do not run with
`--no-base-path`, include the base path segment.

```bash
KIBANA_URL="http://localhost:5601"

curl -s \
  -X POST "${KIBANA_URL}/api/di/consumer/transform" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  -d '"hello from curl"'
```

Expected response shape:

```json
{
  "original": "hello from curl",
  "transformed": "[provider] hello from curl"
}
```

## 404 troubleshooting

- Start Kibana with `--run-examples` so these plugins are loaded.
- Use `--no-base-path`, or include Kibana's base path in `KIBANA_URL`.
