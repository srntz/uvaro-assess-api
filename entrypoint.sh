#!/bin/bash

cp -r ./dist/secrets/.sentryclirc ./dist
cp -r ./dist/secrets/jwt_private_key.pem ./dist
cp -r ./dist/secrets/jwt_public_key.pem ./dist

cd ./dist

exec node ./src/index.js --mode:production
