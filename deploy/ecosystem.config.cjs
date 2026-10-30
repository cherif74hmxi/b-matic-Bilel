// pm2 — lance le serveur B MATIC et le relance à chaque déploiement.
// Démarrage :   pm2 start deploy/ecosystem.config.cjs
// Redéploiement : pm2 reload bmatic
module.exports = {
  apps: [
    {
      name: "bmatic",
      cwd: "/var/www/bmatic",
      script: "node",
      args: "--env-file=.env --import tsx server/index.ts",
      env: { NODE_ENV: "production" },
      time: true,
      max_restarts: 10,
    },
  ],
};
