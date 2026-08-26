module.exports = {
  apps: [
    {
      name: 'keepgoing-api',
      script: './src/index.ts',
      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        PGHOST: 'ep-sparkling-lab-ab8hkin6-pooler.eu-west-2.aws.neon.tech',
        PGDATABASE: 'neondb',
        PGUSER: 'neondb_owner',
        PGPASSWORD: 'npg_WRBs4iKHc8DE',
        PGSSLMODE: 'require',
        PGCHANNELBINDING: 'require',
        JWKS_URL: 'https://ep-sparkling-lab-ab8hkin6.neonauth.eu-west-2.aws.neon.tech/neondb/auth/.well-known/jwks.json',

      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
        PGHOST: 'ep-sparkling-lab-ab8hkin6-pooler.eu-west-2.aws.neon.tech',
        PGDATABASE: 'neondb',
        PGUSER: 'neondb_owner',
        PGPASSWORD: 'npg_WRBs4iKHc8DE',
        PGSSLMODE: 'require',
        PGCHANNELBINDING: 'require',
        JWKS_URL: 'https://ep-sparkling-lab-ab8hkin6.neonauth.eu-west-2.aws.neon.tech/neondb/auth/.well-known/jwks.json',
      }
    }
  ]
};

