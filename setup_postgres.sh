#!/bin/bash
set -e

echo "=== Setting up PostgreSQL for $(whoami) ==="

# Create PostgreSQL superuser for current OS user
echo "Creating PostgreSQL superuser role..."
sudo -u postgres createuser --superuser "$(whoami)" || echo "Role already exists or failed to create."

# Create PostgreSQL database for current OS user
echo "Creating database..."
sudo -u postgres createdb "$(whoami)" || echo "Database already exists or failed to create."

echo "=== PostgreSQL Setup Completed! ==="
echo "You can now connect to PostgreSQL by simply running: psql"
