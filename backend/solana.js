import { Connection, Keypair, PublicKey, clusterApiUrl } from "@solana/web3.js";
import * as splToken from "@solana/spl-token";

const { getMint, getOrCreateAssociatedTokenAccount, transferChecked, TOKEN_PROGRAM_ID } = splToken;

const RPC_URL = process.env.SOLANA_RPC_URL || clusterApiUrl("devnet");
export const connection = new Connection(RPC_URL, "confirmed");

export const treasury = process.env.SOLCHARGED_TREASURY_SECRET
  ? Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOLCHARGED_TREASURY_SECRET)))
  : null;

export const SUN_MINT = process.env.SUN_MINT_ADDRESS ? new PublicKey(process.env.SUN_MINT_ADDRESS) : null;

export const SUN_TOKEN_PROGRAM_ID = process.env.SUN_TOKEN_PROGRAM_ID
  ? new PublicKey(process.env.SUN_TOKEN_PROGRAM_ID)
  : TOKEN_PROGRAM_ID;

export async function sendSunTokens(toWalletAddress, amountSun) {
  if (!SUN_MINT || !treasury) {
    console.log("[MOCK] sendSunTokens →", amountSun, "SUN to", toWalletAddress);
    return { tx: "MOCK_TX_" + Date.now(), mode: "mock" };
  }

  const toOwner = new PublicKey(toWalletAddress);
  const mintInfo = await getMint(connection, SUN_MINT, "confirmed", SUN_TOKEN_PROGRAM_ID);
  const decimals = mintInfo.decimals;

  const amountBaseUnits = BigInt(Math.floor(amountSun)) * (10n ** BigInt(decimals));
  if (amountBaseUnits <= 0n) return { tx: null, mode: "real" };

  const fromAta = await getOrCreateAssociatedTokenAccount(
    connection, treasury, SUN_MINT, treasury.publicKey, false, "confirmed", undefined, SUN_TOKEN_PROGRAM_ID
  );

  const toAta = await getOrCreateAssociatedTokenAccount(
    connection, treasury, SUN_MINT, toOwner, false, "confirmed", undefined, SUN_TOKEN_PROGRAM_ID
  );

  const sig = await transferChecked(
    connection, treasury, fromAta.address, SUN_MINT, toAta.address, treasury,
    amountBaseUnits, decimals, [], { commitment: "confirmed" }, SUN_TOKEN_PROGRAM_ID
  );

  return { tx: sig, mode: "real" };
}

export async function getSunBalanceUi(ownerWalletAddress) {
  if (!SUN_MINT) return { uiAmount: null, mode: "mock" };
  const owner = new PublicKey(ownerWalletAddress);
  const res = await connection.getParsedTokenAccountsByOwner(owner, { mint: SUN_MINT }, "confirmed");
  let total = 0;
  for (const item of res.value) {
    const info = item.account.data.parsed.info;
    total += info.tokenAmount.uiAmount || 0;
  }
  return { uiAmount: total, mode: "real" };
}
