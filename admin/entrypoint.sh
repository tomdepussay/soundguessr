#!/bin/bash

set -e

cd /app || { echo "/app directory not found"; exit 1; }

host="$1"
port="$2"

if [ -z "$host" ]; then
    host="db"
fi

if [ -z "$port" ]; then
    port="5432"
fi

while ! nc -z "$host" "$port"; do
    echo "Waiting for database at $host:$port..."
    sleep 1
done

echo "Database is ready!"

npm install
npm run migrate
npm run seed
npm run dev
