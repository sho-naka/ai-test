# ai-test api-node

Express version of the original Spring Boot sample API.

## 起動

1. 必要なパッケージをインストール:

```bash
cd api-node
npm install
```

2. サーバ起動:

```bash
npm run start
```

デフォルトで http://localhost:8080 に立ち上がります。

## エンドポイント

- GET /api/health
  - 200 OK, body: `ok`
- POST /api/search
  - 200 OK, JSON body: 固定のダミー SearchResponse を返却

エラーハンドリング

- 404 Not Found: { status: 404, message: 'Not Found' }
- 500 Internal Server Error: { status: 500, message: 'Internal Server Error' }
