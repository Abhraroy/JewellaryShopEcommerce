import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  console.log("Webhook hit successfully");
  console.log("Headers:", request.headers);
  const authHeader = request.headers.get("Authorization");
  const hash = crypto
    .createHash("sha256")
    .update(`${process.env.WEBHOOK_USERNAME}:${process.env.WEBHOOK_PASSWORD}`)
    .digest("hex");
  if (authHeader !== hash) {
    console.log("Invalid authorization header");
    return NextResponse.json(
      { message: "Invalid authorization header" },
      { status: 401 }
    );
  } else {
    console.log("Valid authorization header");
    console.log("authHeader", authHeader);
    console.log("hash", hash);
    const supabase = await createClient();

    const body = await request.json();
    console.log("body", body);
    const orderData = {
        user_id:body.payload.metaInfo.udf1,
        order_number:body.payload.orderId,
        order_status:body.payload.state,
        payment_status:body.payload.state,
        subtotal:body.payload.amount/100,
        total_amount:body.payload.amount/100,
    }
    const { data, error } = await supabase.from("orders")
    .insert(orderData)
    .select("*")
    .single();
    if(error){
        console.log("error",error);
        return NextResponse.json({ message: "Error creating order" }, { status: 500 });
    }
    console.log("data",data);
    return NextResponse.json({ message: "Webhook received" }, { status: 200 });
  }
}
