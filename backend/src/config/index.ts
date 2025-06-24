export const config = {
  server: {
    port: parseInt(process.env.PORT ?? '3000'),
    host: process.env.HOST ?? '0.0.0.0'
  },
  database: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306'),
    username: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'thales_db'
  },
  cors: {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:5173'
  },
  jwt: {
    secret: process.env.JWT_SECRET ?? 'your-secret-key'
  }
}
