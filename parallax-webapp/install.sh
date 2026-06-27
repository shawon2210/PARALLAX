#!/bin/bash
echo "Installing packages for client..."
if command -v npm >/dev/null 2>&1; then
  cd client
  npm install
  echo "Client packages installed successfully"
else
  echo "Error: npm not found"
  exit 1
fi

echo "Installing packages for server..."
if command -v npm >/dev/null 2>&1; then
  cd ../server
  npm install
  echo "Server packages installed successfully"
else
  echo "Error: npm not found"
  exit 1
fi

echo "All packages installed successfully!"
exit 0