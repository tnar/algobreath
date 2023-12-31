declare interface Env {
  WORKER_HOST: string;
  CLOUDFLARE_ENV: string;
  DB: D1Database;
  APP_HOST: string;
}
