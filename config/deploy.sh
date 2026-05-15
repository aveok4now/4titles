#!/bin/bash

cd docker
echo "Starting containters..."
docker compose down
docker compose rm -f
docker compose up -d --build
docker compose ps
