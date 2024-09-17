const os = require("os");

/**
 * COLYSEUS CLOUD WARNING:
 * ----------------------
 * PLEASE DO NOT UPDATE THIS FILE MANUALLY AS IT MAY CAUSE DEPLOYMENT ISSUES
 */

module.exports = {
  apps: [
    {
      name: "socket",
      script: "dist/main.js",
      time: true,
      watch: false,
      instances: os.cpus().length,
      exec_mode: "fork",
      wait_ready: true,
      env_dev: {
        NODE_ENV: "dev",
        PORT: 2567,
        MAX_WORLDS_PLAYERS: 100,
        MAX_GAMES_PLAYERS:8,
        SSL_CERT: "/etc/letsencrypt/live/colyseus.algoridev.com/fullchain.pem",
        SSL_KEY: "/etc/letsencrypt/live/colyseus.algoridev.com/privkey.pem",
      },
    },
  ],
};
