"use client";
import { createClient } from "@/app/utils/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddressSection from "@/components/AddressSection";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/zustandStore/zustandStore";

// Icon Components
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
    />
  </svg>
);

const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
    />
  </svg>
);

const OrderIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.4 2.924-6.375a48.567 48.567 0 0 0-8.563-4.137M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
    />
  </svg>
);

const AddressIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
    />
  </svg>
);

export default function AccountPage() {
  const [userData, setUserData] = useState<any>(null);
  const [emailUpdateState, setEmailUpdateState] = useState(false);
  const [formattedPhone, setFormattedPhone] = useState<string>("");
  const [formattedEmail, setFormattedEmail] = useState<string>("");
  const [createdAt, setCreatedAt] = useState<string>("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [orderItemsDetails, setOrderItemsDetails] = useState<Record<string, any[]>>({});
  const [loadingOrderItems, setLoadingOrderItems] = useState<string | null>(null);
  

  const supabase = createClient();
  const { refresh, setRefresh, setAuthenticatedState, setAuthUserId, setCartId, setCartItems, setCartCount, setWishListItems, setInitiatingCheckout, setPaymentConcluded, setShowPaymentConcluded } = useStore();
  const fetchUserData = async () => {
    const { data, error } = await supabase.auth.getUser();
    console.log("data", data);
    if (error || !data?.user) {
      redirect("/");
    }
    console.log("data.user", data.user);

    if (!data?.user?.phone) {
      console.error("User phone number is missing");
      return;
    }

    const res = await supabase
      .from("users")
      .select(`*,
        addresses(*)
        `)
      .eq("phone_number", "+" + data.user.phone)
      .single();
    
    if (!res.data) {
      console.error("User data not found");
      return;
    }

    setUserData(res.data?.user_id ?? null);
    setAddresses(res.data?.addresses ?? []);

    // Fetch latest 3 orders separately with order items and shipping address
    if (res.data?.user_id) {
      console.log("Fetching orders for user_id:", res.data.user_id);
      console.log("User ID type:", typeof res.data.user_id);
      
      // Try fetching orders with the user_id
      const ordersRes = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*)
        `)
        .eq("user_id", res.data.user_id)
        .order("order_date", { ascending: false })
        .limit(3);
      
      console.log("Orders query result:", ordersRes);
      console.log("Orders data:", ordersRes.data);
      console.log("Orders error:", ordersRes.error);
      console.log("Orders count:", ordersRes.data?.length ?? 0);
      
      // Debug: Check if any orders exist at all (for debugging)
      const allOrdersCheck = await supabase
        .from("orders")
        .select("order_id, user_id, order_number")
        .limit(5);
      console.log("Sample orders in DB (first 5):", allOrdersCheck.data);
      console.log("Sample orders error:", allOrdersCheck.error);
      
      if (ordersRes.error) {
        console.error("Error fetching orders:", ordersRes.error);
        console.error("Error details:", JSON.stringify(ordersRes.error, null, 2));
        setOrders([]);
      } else if (ordersRes.data && ordersRes.data.length > 0) {
        console.log("Found orders:", ordersRes.data.length);
        // Fetch shipping addresses for orders
        const ordersWithAddresses = await Promise.all(
          ordersRes.data.map(async (order: any) => {
            if (order?.shipping_address_id) {
              const { data: addressData, error: addressError } = await supabase
                .from("addresses")
                .select("*")
                .eq("address_id", order.shipping_address_id)
                .single();
              if (addressError) {
                console.error("Error fetching address:", addressError);
              }
              return { ...order, shipping_address: addressData || null };
            }
            return { ...order, shipping_address: null };
          })
        );
        console.log("Orders with addresses:", ordersWithAddresses);
        setOrders(ordersWithAddresses ?? []);
      } else {
        console.log("No orders found for user_id:", res.data.user_id);
        console.log("This might be due to:");
        console.log("1. No orders exist for this user");
        console.log("2. user_id mismatch between users and orders table");
        console.log("3. RLS policies blocking the query");
        setOrders([]);
      }
    } else {
      console.log("No user_id found, cannot fetch orders");
      setOrders([]);
    }
    console.log("userData", res);
    const user = res.data;
    
    if (!user) {
      console.error("User data is null");
      return;
    }

    const formattedPhone = user?.phone_number || "Not provided";
    setFormattedPhone(formattedPhone);
    const formattedEmail = user?.email || "Not provided";
    setFormattedEmail(formattedEmail);
    const createdAt = user?.created_at
      ? new Date(user.created_at).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
    setCreatedAt(createdAt);
  };

  useEffect(() => {
    fetchUserData();

  }, [refresh]);



  const handleEmailUpdateState = () => {
    setEmailUpdateState(!emailUpdateState);
  };
  const handleEmailUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as HTMLFormElement).email.value;
    console.log("email", email);
    console.log("userId", userData);
    
    if (!userData) {
      console.error("User ID is missing");
      alert("Unable to update email. Please try again.");
      return;
    }

    const { data, error } = await supabase
      .from("users")
      .update({ email: email })
      .eq("user_id", userData)
      .select("*");
    console.log("data", data);
    console.log("error", error);
    if (error) {
      console.log("error", error);
      alert("Failed to update email. Please try again.");
    }
    if (data && data.length > 0) {
      console.log("data", data);
      setEmailUpdateState(false);
      setFormattedEmail(email);
      alert("Email updated successfully");
    }
  };

  const handleViewOrderDetails = async (orderId: string) => {
    if (expandedOrderId === orderId) {
      // If already expanded, collapse it
      setExpandedOrderId(null);
      return;
    }

    // If details already fetched, just expand
    if (orderItemsDetails[orderId]) {
      setExpandedOrderId(orderId);
      return;
    }

    // Fetch order items with product details
    setLoadingOrderItems(orderId);
    setExpandedOrderId(orderId);

    try {
      const { data, error } = await supabase
        .from("order_items")
        .select(`
          *,
          products(*)
        `)
        .eq("order_id", orderId);

      if (error) {
        console.error("Error fetching order items:", error);
        setLoadingOrderItems(null);
        return;
      }

      if (data) {
        setOrderItemsDetails((prev) => ({
          ...prev,
          [orderId]: data,
        }));
      }
    } catch (err) {
      console.error("Error fetching order items:", err);
    } finally {
      setLoadingOrderItems(null);
    }
  };


  return (
    <div className="min-h-screen bg-theme-cream">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            My Account
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content - Left Side (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Account Information Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <UserIcon />
                Account Information
              </h2>

              <div className="space-y-4">
                <div className="flex flex-col gap-2 sm:gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-theme-sage/20 rounded-lg text-theme-olive flex-shrink-0">
                      <PhoneIcon />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                        Phone Number
                      </span>
                      <span className="text-sm sm:text-base text-gray-900 font-medium">
                        {formattedPhone || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0">
                      <EmailIcon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                        Email
                      </span>
                      <span className="text-sm sm:text-base text-gray-900 font-medium break-words">
                        {formattedEmail || "Not provided"}
                      </span>
                    </div>
                  </div>
                  <div className="ml-11 sm:ml-0">
                    {!emailUpdateState ? (
                      <button
                        className="text-theme-olive hover:text-theme-sage font-medium text-xs sm:text-sm"
                        onClick={handleEmailUpdateState}
                      >
                        Update Email
                      </button>
                    ) : (
                      <form
                        onSubmit={handleEmailUpdate}
                        className="flex flex-col sm:flex-row gap-2"
                      >
                        <input
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          className="flex-1 border border-theme-sage/30 rounded-md px-3 py-2 text-sm outline-0 focus:ring-2 focus:ring-theme-sage focus:border-transparent text-gray-900 placeholder-gray-400"
                          required
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            disabled={!emailUpdateState}
                            className="bg-theme-sage hover:bg-theme-olive text-white font-medium rounded-md px-3 py-2 text-sm whitespace-nowrap"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={handleEmailUpdateState}
                            className="bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md px-3 py-2 text-sm whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-100 rounded-lg text-amber-600 flex-shrink-0">
                      <CalendarIcon />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs sm:text-sm font-medium text-gray-500 block mb-1">
                        Customer Since
                      </span>
                      <span className="text-sm sm:text-base text-gray-900 font-medium">{createdAt || "N/A"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Orders Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                <OrderIcon />
                Recent Orders
              </h2>

              {orders && orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const orderDate = order?.order_date
                      ? new Date(order.order_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A";
                    const shippingAddress = order?.shipping_address;
                    const isExpanded = expandedOrderId === order?.order_id;
                    const orderItems = order?.order_items && Array.isArray(order.order_items)
                      ? order.order_items
                      : order?.order_items
                      ? [order.order_items]
                      : [];

                    return (
                      <div
                        key={order?.order_id ?? `order-${Math.random()}`}
                        className="border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition-shadow duration-200"
                      >
                        {/* Order Header */}
                        <div className="flex flex-col gap-3 sm:gap-4">
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                                Order #{order?.order_number?.slice(-8) ?? order?.order_id?.slice(0, 8) ?? "N/A"}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-full text-xs font-medium w-fit ${
                                  order?.order_status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order?.order_status === "shipped"
                                    ? "bg-blue-100 text-blue-700"
                                    : order?.order_status === "processing"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : order?.order_status === "cancelled"
                                    ? "bg-red-100 text-red-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {order?.order_status?.toUpperCase() ?? "PENDING"}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <span className="w-4 h-4 flex items-center justify-center">
                                  <CalendarIcon />
                                </span>
                                <span>{orderDate}</span>
                              </p>
                              <p className="flex items-center gap-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                  />
                                </svg>
                                <span className="font-semibold text-gray-900">
                                  ₹{order?.total_amount?.toFixed(2) ?? order?.order_total?.toFixed(2) ?? "0.00"}
                                </span>
                              </p>
                              {shippingAddress && (
                                <p className="flex items-start gap-2 mt-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                                    />
                                  </svg>
                                  <span className="text-xs">
                                    {shippingAddress.street_address}, {shippingAddress.city}, {shippingAddress.state} - {shippingAddress.postal_code}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewOrderDetails(order?.order_id)}
                            disabled={loadingOrderItems === order?.order_id}
                            className="w-full sm:w-auto px-4 py-2 bg-theme-sage hover:bg-theme-olive text-white font-medium rounded-lg transition-colors duration-200 text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingOrderItems === order?.order_id ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Loading...
                              </>
                            ) : isExpanded ? (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 15.75l7.5-7.5 7.5 7.5"
                                  />
                                </svg>
                                Hide Details
                              </>
                            ) : (
                              <>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={2}
                                  stroke="currentColor"
                                  className="w-4 h-4"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                                  />
                                </svg>
                                View Details
                              </>
                            )}
                          </button>
                        </div>

                        {/* Order Items - Expandable */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            {loadingOrderItems === order?.order_id ? (
                              <div className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme-sage"></div>
                              </div>
                            ) : orderItemsDetails[order?.order_id] ? (
                              <>
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                  Order Items ({orderItemsDetails[order?.order_id]?.length ?? 0})
                                </h4>
                                <div className="space-y-3">
                                  {orderItemsDetails[order?.order_id]?.map((item: any, index: number) => (
                                    <div
                                      key={item?.order_item_id ?? index}
                                      className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                      {/* Product Image */}
                                      {item?.products?.thumbnail_image && (
                                        <div className="flex-shrink-0 w-full sm:w-auto">
                                          <img
                                            src={item.products.thumbnail_image}
                                            alt={item?.product_name ?? "Product"}
                                            className="w-full sm:w-16 h-auto sm:h-16 object-cover rounded-md"
                                          />
                                        </div>
                                      )}
                                      {/* Product Details */}
                                      <div className="flex-1 min-w-0 w-full">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-900">
                                          {item?.product_name ?? item?.products?.product_name ?? "N/A"}
                                        </p>
                                        {item?.products?.description && (
                                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                            {item.products.description}
                                          </p>
                                        )}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs text-gray-600">
                                          <span>
                                            Quantity: <span className="font-medium">{item?.quantity ?? "N/A"}</span>
                                          </span>
                                          <span>
                                            Unit Price: <span className="font-medium">₹{item?.unit_price?.toFixed(2) ?? "0.00"}</span>
                                          </span>
                                        </div>
                                        {item?.products?.metal_type && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            Metal: {item.products.metal_type}
                                          </p>
                                        )}
                                      </div>
                                      {/* Price */}
                                      <div className="flex-shrink-0 w-full sm:w-auto text-left sm:text-right">
                                        <p className="text-sm sm:text-base font-bold text-gray-900">
                                          ₹{item?.total_price?.toFixed(2) ?? "0.00"}
                                        </p>
                                        {item?.unit_price && item?.quantity && (
                                          <p className="text-xs text-gray-500 mt-1">
                                            ₹{item.unit_price.toFixed(2)} × {item.quantity}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              <div className="text-center py-6">
                                <p className="text-sm text-gray-600">No items found for this order</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 text-gray-400 mx-auto mb-4 flex items-center justify-center">
                    <OrderIcon />
                  </div>
                  <p className="mt-4 text-gray-600">No orders yet</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Your order history will appear here
                  </p>
                  <a
                    href="/"
                    className="inline-block mt-4 px-6 py-2 bg-theme-sage hover:bg-theme-olive text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Start Shopping
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar - Right Side (1 column) */}
          <div className="space-y-4 sm:space-y-6">
            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                Quick Actions
              </h2>

              <div className="space-y-3">
                <a
                  href="/collections"
                  className="block w-full px-4 py-3 bg-theme-sage/20 hover:bg-theme-sage/30 text-theme-olive font-medium rounded-lg transition-colors duration-200 text-center"
                >
                  Browse Collections
                </a>
                <a
                  href="/"
                  className="block w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg transition-colors duration-200 text-center"
                >
                  Continue Shopping
                </a>
                <button
                  onClick={async () => {
                    // Logout functionality can be added here
                    console.log("Logout clicked");
                    const { error } = await supabase.auth.signOut();
                    if (error) {
                      console.log("error", error);
                    }
                    else{
                      console.log("Logout successful");
                      setAuthenticatedState(false);
                      setAuthUserId("");
                      setCartId("");
                      setCartItems([]);
                      setCartCount(0);
                      setWishListItems([]);
                      setInitiatingCheckout(false);
                      setPaymentConcluded(false);
                      setShowPaymentConcluded(false);
                      setRefresh();
                      redirect("/");
                    }
                  }}
                  className="w-full px-4 py-3 bg-red-50 hover:bg-red-100 text-red-700 font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <LogoutIcon />
                  Logout
                </button>
              </div>
            </div>

            {/* Addresses Card */}
             <AddressSection addresses={addresses ?? []} userId={userData ?? null} />
          </div>
        </div>
      </main>

      
    </div>
  );
}
