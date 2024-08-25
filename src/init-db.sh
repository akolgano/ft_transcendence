#!/bin/bash
set -e

echo "Waiting for PostgreSQL to be available..."

# Wait until PostgreSQL is up
until psql -h "db" -U "postgres" -c '\l'; do
  >&2 echo "Postgres is unavailable - sleeping"
  sleep 5
done

echo "PostgreSQL is available. Running initialization commands..."

# Run initialization commands
psql -v ON_ERROR_STOP=1 --username "postgres" -h "db" <<-EOSQL
    CREATE DATABASE mydatabase;
    CREATE USER myuser WITH PASSWORD 'mypassword';
    GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
EOSQL

echo "Initialization complete."
