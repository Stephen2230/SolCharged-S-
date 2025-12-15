# SolCharged (S²)

## Overview
SolCharged is a consumer-facing Solana application that rewards users with SUN tokens for solar-powered charging sessions.

## Problem
Renewable energy usage is difficult to track and incentivize at the consumer level.

## Solution
Users connect a Phantom wallet, log solar charging activity, and automatically receive SUN tokens on Solana.

## How Solana Is Used
- Phantom wallet authentication
- SPL token (SUN) mint
- On-chain token transfers per session
- Solana Devnet for demo

## Demo Flow
1. Connect Phantom wallet
2. Log solar charging minutes
3. SUN tokens are sent instantly to the wallet

## Tech Stack
- Solana Web3.js
- Phantom Wallet
- Node.js (Express)
- Vanilla HTML/CSS/JS

## Running Locally
```bash
cd backend
npm install
npm start

cd frontend
python3 -m http.server 5500
