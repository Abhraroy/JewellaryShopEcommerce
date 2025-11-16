import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/app/utils/supabase/server";

export async function POST() {
  const supabase = await createClient();
  let totalAmount = 0
  let amountInPaise = 0
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const userData = await supabase
      .from("users")
      .select(`*,
        cart(*)
        `)
      .eq("phone_number", "+"+user.phone)
      .single();
      console.log("userData",userData);
      if(userData.data.cart){
        const cartData = await supabase.from("cart_items").select(`*,products(*)`).eq("cart_id",userData.data.cart.cart_id);
        console.log("cartData",cartData);
        totalAmount = cartData.data?.reduce((sum: number, item: any) => sum + item.products.final_price * item.quantity, 0) ?? 0;
        console.log("totalAmount",totalAmount);
         amountInPaise = Math.round(totalAmount * 100);
      }
  }

  const merchantOrderId = uuidv4();

  const requestHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const requestBodyJson = {
    client_version: process.env.PHONEPE_CLIENT_VERSION,
    grant_type: process.env.PHONEPE_GRANT_TYPE,
    client_id: process.env.PHONEPE_CLIENT_ID,
    client_secret: process.env.PHONEPE_CLIENT_SECRET,
  };

  const requestBody = new URLSearchParams(
    requestBodyJson as Record<string, string>
  ).toString();

  const sandbox = "https://api-preprod.phonepe.com/apis/pg-sandbox";

  console.log("requestBody", requestBody);
  const res = await axios.post(sandbox + "/v1/oauth/token", requestBody, {
    headers: requestHeaders,
  });
  console.log("res", res.data);

  if (res.data.access_token) {
    const order_requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${res.data.access_token}`,
    };

    const order_requestBody = {
      amount:amountInPaise,
      expireAfter: 1200,
      metaInfo: {
        udf1: "additional-information-1",
        udf2: "additional-information-2",
        udf3: "additional-information-3",
        udf4: "additional-information-4",
        udf5: "additional-information-5",
        udf6: "additional-information-6",
        udf7: "additional-information-7",
        udf8: "additional-information-8",
        udf9: "additional-information-9",
        udf10: "additional-information-10",
        udf11: "additional-information-11",
        udf12: "additional-information-12",
        udf13: "additional-information-13",
        udf14: "additional-information-14",
        udf15: "additional-information-15",
      },
      paymentFlow: {
        type: "PG_CHECKOUT",
        message: "Payment message used for collect requests",
        merchantUrls: {
          redirectUrl: "https://a39ef8683b4e.ngrok-free.app/",
        },
      },

      merchantOrderId: merchantOrderId,
      paymentModeConfig: {
        enabledPaymentModes: [
          {
            type: "UPI_INTENT",
          },
          {
            type: "UPI_COLLECT",
          },
          {
            type: "UPI_QR",
          },
          {
            type: "NET_BANKING",
          },
          {
            type: "CARD",
            cardTypes: ["DEBIT_CARD", "CREDIT_CARD"],
          },
        ],
      },
    };
    console.log(
      "Order Payload Sent:",
      JSON.stringify(order_requestBody, null, 2)
    );
    console.log(
      "Order Headers Sent:",
      JSON.stringify(order_requestHeaders, null, 2)
    );
    const order_res = await axios.post(
      sandbox + "/checkout/v2/pay",
      order_requestBody,
      { headers: order_requestHeaders }
    );
    console.log("order_res", order_res.data);
    return NextResponse.json({ data: order_res.data }, { status: 200 });
  }
}
