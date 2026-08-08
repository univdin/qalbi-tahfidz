import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createHash } from "crypto";

export const runtime = "nodejs";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY ?? "";
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";

export async function POST(request: NextRequest) {
  if (!SERVICE_ROLE || !SUPABASE_URL) {
    return NextResponse.json({ error: "Service role belum dikonfigurasi." }, { status: 500 });
  }

  const payload = await request.json().catch(() => null);
  if (!payload) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const { order_id, status_code, gross_amount, signature_key, transaction_status } =
    payload as Record<string, string>;

  const expected = createHash("sha512")
    .update(`${order_id}${status_code}${gross_amount}${SERVER_KEY}`)
    .digest("hex");
  if (signature_key !== expected) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const success =
    (["200", "201", "202"].includes(status_code) &&
      ["capture", "settlement"].includes(transaction_status ?? "")) ||
    transaction_status === "settlement";

  if (!success) {
    return NextResponse.json({ ok: true });
  }

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: tx } = await supabase
    .from("payment_transactions")
    .select("user_id, credits_added, status")
    .eq("order_id", order_id)
    .maybeSingle();

  if (!tx || tx.status === "success") {
    return NextResponse.json({ ok: true });
  }

  await supabase
    .from("payment_transactions")
    .update({ status: "success" })
    .eq("order_id", order_id);

  await supabase.rpc("add_user_credits", {
    p_user_id: tx.user_id,
    p_amount: tx.credits_added,
  });

  return NextResponse.json({ ok: true });
}
