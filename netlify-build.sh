#!/usr/bin/env bash
set -e

echo "🔧 Installing Rust..."
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y

echo "🔧 Adding cargo to PATH..."
export PATH="$HOME/.cargo/bin:$PATH"

echo "🔧 Verifying Rust installation..."
rustc --version
cargo --version

echo "🔧 Upgrading pip..."
pip install --upgrade pip

echo "🔧 Installing Python dependencies..."
pip install -r requirements.txt

echo "✅ Build completed successfully!"