# Dependency Injection Consumer Example

This server-only example plugin consumes a server-side service from
`dependencyInjectionProviderExample` through Core DI + Inversify.

## Run Kibana with examples enabled

```bash
yarn start --run-examples --no-base-path
```

## Dependency

`kibana.jsonc` declares:

- `requiredPlugins: ["dependencyInjectionProviderExample"]`

The consumer injects the provider's start contract with:

- `PluginStart('dependencyInjectionProviderExample')`

## Route

- `POST /api/di/consumer/transform`
- Request body: JSON string
- Response body:
  - `original` (the incoming message)
  - `transformed` (provider output)

## Curl examples

Use `KIBANA_URL` that matches your Kibana dev URL. If you do not run with
`--no-base-path`, include the base path segment.

Simple request:

```bash
KIBANA_URL="http://localhost:5601"

curl -s \
  -X POST "${KIBANA_URL}/api/di/consumer/transform" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  -d '"hello kibana"'
```

Another message:

```bash
curl -s \
  -X POST "${KIBANA_URL}/api/di/consumer/transform" \
  -H "kbn-xsrf: true" \
  -H "Content-Type: application/json" \
  -d '"dependency injection rocks"'
```

Example response:

```json
{
  "original": "dependency injection rocks",
  "transformed": "[provider] dependency injection rocks"
}
```

## 404 troubleshooting

- Start Kibana with `--run-examples` so these plugins are loaded.
- Use `--no-base-path`, or include Kibana's base path in `KIBANA_URL`.
