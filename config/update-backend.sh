#!/bin/bash

cd docker

echo "Stopping backend container..."
docker compose stop nestjs

echo "Removing backend container..."
docker compose rm -f nestjs

echo "Starting backend container..."
docker compose up -d --build nestjs

echo "Container status:"
docker compose ps nestjs
