import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/app/utils/supabase/server";
import axios from "axios";
import { redis } from "@/app/utils/Redis";
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return NextResponse.json(
      { message: "User is not authenticated found" },
      { status: 404 }
    );
  }
  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("phone_number", "+" + data.user?.phone)
    .single();
  if (!userData) {
    return NextResponse.json({ message: "User is not found" }, { status: 404 });
  }
  const searchParams = request.nextUrl.searchParams;
  const merchantOrderId = searchParams.get("merchantOrderId");
  if (!merchantOrderId) {
    return NextResponse.json(
      { message: "Merchant order id is not found" },
      { status: 404 }
    );
  }
  console.log("merchantOrderId", merchantOrderId);
  const authToken = await redis.get(merchantOrderId);
  if (!authToken || authToken === null) {
    return NextResponse.json(
      { message: "Auth token is not found" },
      { status: 404 }
    );
  }
  console.log("authToken", authToken);

  const sandbox = `https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/order/${merchantOrderId}/status?details=true&errorContext=true`;
  const orderStatusRequestHeaders = {
    "Content-Type": "application/json",
    Authorization: `O-Bearer ${authToken}`,
  };
  const orderStatusResponse = await axios.get(sandbox, {
    headers: orderStatusRequestHeaders,
  });
  console.log("orderStatusResponse", orderStatusResponse.data);
  
  // Get payment state from response
  const paymentState = orderStatusResponse.data?.paymentDetails?.[0]?.state || orderStatusResponse.data?.state;
  
  if (paymentState === "COMPLETED") {
    const { data, error } = await supabase
      .from("orders")
      .update({
        payment_status: "completed",
        transaction_id:
          orderStatusResponse.data.paymentDetails[0].transactionId,
      })
      .select(
        `*,
        order_items(*, products(*))
        `
      )
      .eq("order_number", orderStatusResponse.data.orderId);
    if (error) {
      console.log("error", error);
      return NextResponse.json(
        { message: "Error updating order", orderStatusResponse: { state: "FAILED" } },
        { status: 500 }
      );
    }
    console.log("order updated successfully ", data);
    
    return NextResponse.json({ 
      message: "Order updated successfully",
      orderStatusResponse: { state: "COMPLETED" }
    }, { status: 200 });
  }
  
  if (paymentState === "FAILED") {
    return NextResponse.json({ 
      message: "Payment failed",
      orderStatusResponse: { state: "FAILED" }
    }, { status: 200 });
  }
  
  // Return PENDING state for any other case
  return NextResponse.json({ 
    message: "Order status is pending",
    orderStatusResponse: { state: "PENDING" }
  }, { status: 200 });
}
