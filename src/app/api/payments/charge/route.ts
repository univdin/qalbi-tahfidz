import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/core/supabase/server";
import midtransClient from "midtrans-client";

export const runtime = "nodejs";

const SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const CLIENT_KEY = process.env.MIDTRANS_CLIENT_KEY;

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Silakan masuk terlebih dahulu." }, { status: 401 });
  }

  if (!SERVER_KEY || !CLIENT_KEY) {
    return NextResponse.json(
      { error: "Midtrans belum dikonfigurasi." },
      { status: 503 }
    );
  }

  const body = (await request.json().catch(() => ({}))) as { credits?: number };
  const credits = Math.min(Math.max(Number(body.credits) || 10, 5), 500);
  const gross = Math.round(credits * 500); // Rp 500 per kredit

  const orderId = `QT-${Date.now()}-${user.id.slice(0, 8)}`;

  try {
    const snap = new midtransClient.Snap({
      isProduction: process.env.NODE_ENV === "production",
      serverKey: SERVER_KEY,
      clientKey: CLIENT_KEY,
    });

    const token = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: gross,
      },
      item_details: [{ id: "credit", price: gross, quantity: 1, name: `${credits} Kredit AI` }],
      customer_details: {
        first_name: user.user_metadata?.full_name ?? "",
        email: user.email,
      },
    });

    await supabase.from("payment_transactions").insert({
      user_id: user.id,
      order_id: orderId,
      gross_amount: gross,
      credits_added: credits,
      status: "pending",
      snap_token: (token as { token?: string }).token ?? null,
    });

    return NextResponse.json({
      token: (token as { token?: string }).token,
      clientKey: CLIENT_KEY,
      orderId,
    });
  } catch (err) {
    console.error("Midtrans charge error:", err);
    return NextResponse.json({ error: "Gagal membuat transaksi." }, { status: 500 });
  }
}
