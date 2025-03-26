#!/bin/bash
cd /app

# Get the first argument
host="$1"
port="$2"

if [ -z "$host" ]; then
    host="db"
fi

if [ -z "$port" ]; then
    port="5432"
fi

while ! nc -z "$host" "$port"; do
  echo "Waiting for database..."
  sleep 1
done
echo "Database is ready!"

npm install
npm run migrate
npm run seed
npm run dev