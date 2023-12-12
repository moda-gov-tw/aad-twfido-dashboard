#!/bin/bash
cd /app
envsubst < wrangler.toml.example > wrangler.toml
npm run start
