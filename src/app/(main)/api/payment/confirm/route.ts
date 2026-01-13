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
  const paymentState =
    orderStatusResponse.data?.paymentDetails?.[0]?.state ||
    orderStatusResponse.data?.state;

  if (paymentState === "COMPLETED") {
    const { data: orderData, error } = await supabase
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
        {
          message: "Error updating order",
          orderStatusResponse: { state: "FAILED" },
        },
        { status: 500 }
      );
    }
    console.log(
      "order updated successfully ",
      JSON.stringify(orderData?.[0], null, 2)
    );
    console.log(
      "order_items:",
      JSON.stringify(orderData?.[0]?.order_items, null, 2)
    );
    const updatedOrderData = orderData?.[0];

    // Parse address_text into separate variables
    // Format: "street_address, address_line1, address_line2, city, state - postal_code"
    const addressText = updatedOrderData?.address_text || "";
    const addressParts = addressText
      .split(", ")
      .map((part: string) => part.trim());

    // Last part contains "state - postal_code"
    const lastPart = addressParts[addressParts.length - 1] || "";
    const statePostalMatch = lastPart.match(/^(.+?)\s*-\s*(\d+)$/);

    const parsedAddress = {
      streetAddress:
        addressParts[0] && addressParts[0] !== "null" ? addressParts[0] : "",
      addressLine1:
        addressParts[1] && addressParts[1] !== "null" ? addressParts[1] : "",
      addressLine2:
        addressParts[2] && addressParts[2] !== "null" ? addressParts[2] : "",
      city:
        addressParts[3] && addressParts[3] !== "null" ? addressParts[3] : "",
      state: statePostalMatch ? statePostalMatch[1].trim() : "",
      postalCode: statePostalMatch ? statePostalMatch[2].trim() : "",
    };

    // Create order items payload
    const orderItemsPayload =
      updatedOrderData?.order_items?.map((item: any) => ({
        itemName: item.products?.product_name || "",
        sku: item.products?.sku || item.product_id,
        units: item.quantity || 1,
        unitPrice: item.unit_price || item.products?.final_price || 0,
        productWeight: item.products?.weight_grams || 0,
        imageURL: item.products?.thumbnail_image || "",
        tax: 0,
      })) || [];

    console.log(
      "orderItemsPayload:",
      JSON.stringify(orderItemsPayload, null, 2)
    );

    const rapidShypPayload = {
      orderId: updatedOrderData?.order_number,
      orderDate: updatedOrderData?.order_date?.split("T")[0],
      storeName: "DEFAULT",
      billingIsShipping: true,
      shippingAddress: {
        firstName: userData?.first_name || "",
        lastName: userData?.last_name || "",
        streetAddress: parsedAddress.streetAddress,
        addressLine1: parsedAddress.addressLine1,
        addressLine2: parsedAddress.addressLine2,
        city: parsedAddress.city,
        state: parsedAddress.state,
        postalCode: parsedAddress.postalCode,
        country: "India",
        email: userData?.email || "",
        phone: userData?.phone_number || "",
      },
      orderItems: orderItemsPayload,
      paymentMethod: "PREPAID",
      totalOrderValue: updatedOrderData?.total_amount,
    };
    console.log("rapidShypPayload", JSON.stringify(rapidShypPayload, null, 2));

    try {
      const rapidShypResponse = await axios.post(
        "https://api.rapidshyp.com/rapidshyp/apis/v1/create_order",
        rapidShypPayload,
        {
          headers: {
            "Content-Type": "application/json",
            "rapidshyp-token": `${process.env.RAPIDSHYP_API_KEY}`,
          },
        }
      );
      console.log("rapidShypResponse", rapidShypResponse.data);
    } catch (rapidShypError: any) {
      // Log the full error response from RapidShyp
      console.error("RapidShyp API Error:", {
        status: rapidShypError.response?.status,
        statusText: rapidShypError.response?.statusText,
        data: JSON.stringify(rapidShypError.response?.data, null, 2),
        message: rapidShypError.message,
      });
      // Don't fail the whole request, just log the error
      // The payment was successful, shipping order creation failed
    }

    return NextResponse.json(
      {
        message: "Order updated successfully",
        orderStatusResponse: { state: "COMPLETED" },
      },
      { status: 200 }
    );
  }

  if (paymentState === "FAILED") {
    return NextResponse.json(
      {
        message: "Payment failed",
        orderStatusResponse: { state: "FAILED" },
      },
      { status: 200 }
    );
  }

  // Return PENDING state for any other case
  return NextResponse.json(
    {
      message: "Order status is pending",
      orderStatusResponse: { state: "PENDING" },
    },
    { status: 200 }
  );
}
