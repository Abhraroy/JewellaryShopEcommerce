import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createClient } from "@/app/utils/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  let totalAmount = 0;
  let amountInPaise = 0;
  let user_id = null;
  let cart_id = null;
  let lastAddedProductTime = null;
  let address_id = null;
  let cartData = null;
  let cachedToken={
    access_token: null,
    expires_at: null,
  }
  // Get address_id from request body
  try {
    const body = await request.json();
    address_id = body.address_id || null;
    console.log("Address ID received:", address_id);
  } catch (error) {
    console.log("No address_id in request body or invalid JSON");
  }
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    const userData = await supabase
      .from("users")
      .select(
        `*,
        cart(*),
        `
      )
      .eq("phone_number", "+" + user.phone)
      .single();
    console.log("userData", userData);
    if (!userData.error && userData.data) {
      const userDataResult = userData.data as any;
      if (userDataResult.cart) {
        user_id = userDataResult.user_id;
        cart_id = userDataResult.cart?.cart_id;
        if (cart_id) {
          cartData = await supabase
            .from("cart_items")
            .select(
              `
                *,
                products(*)
              `
            )
            .eq("cart_id", cart_id)
            .order("added_at", { ascending: false });
          console.log("cartData", cartData);
          console.log("cartdata products", cartData?.data?.[0]?.products);
          lastAddedProductTime = cartData?.data?.[0]?.added_at;
          if (cartData && cartData.error) {
            console.error("Error fetching cart data:", cartData.error);
          }
          if (cartData && cartData.data && cartData.data.length > 0) {
            totalAmount = cartData.data.reduce((sum: number, item: any) => {
              if (item.products && item.products.final_price) {
                return sum + item.products.final_price * item.quantity;
              }
              return sum;
            }, 0);
            console.log("totalAmount", totalAmount);
            amountInPaise = Math.round(totalAmount * 100);
          }
        }
      }
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
  cachedToken.access_token = res.data.access_token;
  cachedToken.expires_at = res.data.expires_at;
  if (res.data.access_token) {
    const order_requestHeaders = {
      "Content-Type": "application/json",
      Authorization: `O-Bearer ${res.data.access_token}`,
    };

    const order_requestBody = {
      amount: amountInPaise,
      expireAfter: 1200,
      metaInfo: {
        udf1: user_id,
        udf2: merchantOrderId,
        udf3: totalAmount,
        udf4: lastAddedProductTime || "additional-information-4",
        udf5: cart_id || "additional-information-5",
        udf6: address_id || "additional-information-6",
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
          redirectUrl: "https://paso-margin-sip-bread.trycloudflare.com/redirect",
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
    const orderData = {
      user_id: user_id,
      merchant_order_id: merchantOrderId,
      order_status: "pending",
      payment_status: "pending",
      total_amount: amountInPaise / 100,
      shipping_address_id: address_id,
    };
    if (!cartData || cartData.error || !cartData.data || cartData.data.length === 0) {
      console.log("Error in cart data, no order created");
      return NextResponse.json(
        { message: "Error in cart data, no order created" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("orders")
      .insert(orderData)
      .select("*")
      .single();
    if (error) {
      console.log("error", error);
      return NextResponse.json(
        { message: "Error creating order" },
        { status: 500 }
      );
    }

    const orderId = data.order_id;
    
    // Create order items for each cart item
    const orderItemsPromises = cartData.data.map(async (item: any) => {
      const orderItemsPayload = {
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price: item.products.final_price,
        total_price: item.products.final_price * item.quantity,
      };
      const { data, error } = await supabase
        .from("order_items")
        .insert(orderItemsPayload)
        .select("*")
        .single();
      if (error) {
        console.log("error creating order item", error);
        throw error;
      }
      console.log("order item created", data);
      return data;
    });

    try {
      await Promise.all(orderItemsPromises);
      console.log("All order items created successfully");
    } catch (error) {
      console.log("Error creating order items", error);
      return NextResponse.json(
        { message: "Error creating order items" },
        { status: 500 }
      );
    }
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
    if (order_res.data && order_res.data.orderId) {
      const order_res_phonepay = await supabase.from("orders")
        .update({
          order_number: order_res.data.orderId,
          payment_status: "pending",
        })
        .eq("order_id", orderId);
      console.log("order_res_phonepay", order_res_phonepay);
    } else {
      console.log("No orderId in response, skipping order update");
    }
    return NextResponse.json({ data: order_res.data,
      merchantOrderId: merchantOrderId,
     }, { status: 200 });
  }
}
