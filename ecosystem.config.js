const os = require("os");

/**
 * COLYSEUS CLOUD WARNING:
 * ----------------------
 * PLEASE DO NOT UPDATE THIS FILE MANUALLY AS IT MAY CAUSE DEPLOYMENT ISSUES
 */

module.exports = {
  apps: [
    {
      name: "server-platform",
      script: "dist/main.js",
      time: true,
      watch: true,
      restart_delay: 5000,
      max_restarts: 10,
      // instances: os.cpus().length,
      // exec_mode: "fork",
      // wait_ready: true,
      env_dev: {
        NODE_ENV: "dev",
        HTTP_PORT: 443,
        MAX_WORLDS_PLAYERS: 100,
        MAX_GAMES_PLAYERS: 8,
        MAX_GAME_WAITING_TIME: 60000,
        BUCKET_URL: "https://platform-public.s3.eu-west-3.amazonaws.com",
        REDIS_HOST: "localhost",
        REDIS_PORT: 6379,
        REDIS_PASSWORD: "",
        SSL_CERT: "/etc/letsencrypt/live/server.algoridev.com/fullchain.pem",
        SSL_KEY: "/etc/letsencrypt/live/server.algoridev.com/privkey.pem",
      },
      env_prod: {
        NODE_ENV: "production",
        HTTP_PORT: 443,
        MAX_WORLDS_PLAYERS: 50,
        MAX_GAMES_PLAYERS: 8,
        MAX_GAME_WAITING_TIME: 60000,
        BUCKET_URL: "https://public.algoritcom.io/platform",
        REDIS_HOST: "localhost",
        REDIS_PORT: 6379,
        REDIS_PASSWORD: "",
        SSL_CERT: "/etc/letsencrypt/live/server.algoritcom.io/fullchain.pem",
        SSL_KEY: "/etc/letsencrypt/live/server.algoritcom.io/privkey.pem",
      },
    },
  ],
};
