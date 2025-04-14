#!/bin/bash

set -e

cd /app || { echo "/app directory not found"; exit 1; }

npm install
npm run dev