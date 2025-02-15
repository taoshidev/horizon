#!/bin/bash

echo "Updating horizon and easy-miner..."

# Update submodule to latest
git submodule update --init --remote --merge

# Go into submodule and checkout main
cd easy-miner

npm install
cd ..

# Install main repo dependencies
npm install

echo "All repositories updated and dependencies installed!"
