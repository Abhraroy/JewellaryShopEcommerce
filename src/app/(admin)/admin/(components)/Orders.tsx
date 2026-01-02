"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/app/utils/supabase/client";

type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

interface Order {
  order_id: string;
  user_id: string | null;
  order_date: string;
  total_amount: number;
  order_status: OrderStatus;
  shipping_address_id?: string | null;
  shipping?: {
    full_name?: string;
    street_address?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    phone_number?: string;
  } | null;
  users?: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
  } | null;
  order_items?: Array<{
    order_item_id: string;
    quantity: number;
    price: number;
    products?: {
      product_name?: string;
    } | null;
  }> | null;
}

const statusColors: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  returned: "bg-purple-100 text-purple-700",
};

const allowedStatuses: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const currency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(
    value || 0
  );

export default function Orders() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            users(*),
            shipping:addresses!orders_shipping_address_id_fkey(*),
            order_items(*, products(*))
          `
          )
          .order("order_date", { ascending: false })
          .limit(100);

        if (error) {
          console.error("Error fetching orders:", error);
          setError("Failed to load orders");
          setOrders([]);
        } else {
          setOrders((data as Order[]) || []);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesStatus =
        statusFilter === "all" ? true : order.order_status === statusFilter;
      const matchesSearch =
        search.trim().length === 0
          ? true
          : order.order_id.toLowerCase().includes(search.toLowerCase()) ||
            (order.users?.phone_number || "").includes(search) ||
            (order.users?.email || "")
              .toLowerCase()
              .includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const totalRevenue = useMemo(
    () => filteredOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    [filteredOrders]
  );

  const averageOrderValue = useMemo(() => {
    if (!filteredOrders.length) return 0;
    return totalRevenue / filteredOrders.length;
  }, [filteredOrders.length, totalRevenue]);

  const totalItems = useMemo(
    () =>
      filteredOrders.reduce((sum, o) => {
        const itemsCount =
          o.order_items?.reduce((acc, item) => acc + (item.quantity || 0), 0) ??
          0;
        return sum + itemsCount;
      }, 0),
    [filteredOrders]
  );

  const toggleExpanded = (orderId: string) => {
    setExpandedOrders((prev) => {
      const next = new Set(prev);
      if (next.has(orderId)) {
        next.delete(orderId);
      } else {
        next.add(orderId);
      }
      return next;
    });
  };

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    try {
      setUpdatingId(orderId);
      const { error } = await supabase
        .from("orders")
        .update({ order_status: newStatus })
        .eq("order_id", orderId);
      if (error) {
        console.error("Error updating order status:", error);
        setError("Failed to update order status");
        return;
      }
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId ? { ...order, order_status: newStatus } : order
        )
      );
      setError(null);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="w-full space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Orders Management
          </h1>
          <p className="text-sm text-gray-600">
            Track, filter, and review customer orders.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, phone, email"
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
            <option value="returned">Returned</option>
          </select>
        </div>
      </header>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <SummaryCard label="Total Orders" value={filteredOrders.length} />
        <SummaryCard label="Total Revenue" value={currency(totalRevenue)} />
        <SummaryCard
          label="Avg Order Value"
          value={currency(averageOrderValue)}
          sub={`${totalItems} items`}
        />
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr className="text-xs uppercase tracking-wide text-gray-500">
                <Th>Order ID</Th>
                <Th>Customer</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Total</Th>
                <Th>Items</Th>
                <Th>Shipping</Th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-red-600">
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                filteredOrders.map((order) => {
                  const isExpanded = expandedOrders.has(order.order_id);
                  const itemCount =
                    order.order_items?.reduce(
                      (sum, item) => sum + (item.quantity || 0),
                      0
                    ) ?? 0;
                  const address = order.shipping;
                  const customerName =
                    (order.users?.first_name || "") +
                    (order.users?.last_name ? ` ${order.users.last_name}` : "");
                  return (
                    <>
                      <tr
                        key={order.order_id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm cursor-pointer"
                        onClick={() => toggleExpanded(order.order_id)}
                      >
                        <Td className="font-semibold text-gray-900">
                          <div className="flex items-center gap-2">
                            <span>{order.order_id}</span>
                            <span
                              className={`text-xs px-2 py-0.5 rounded-full border ${
                                isExpanded
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                  : "bg-gray-50 border-gray-200 text-gray-600"
                              }`}
                            >
                              {isExpanded ? "Hide items" : "View items"}
                            </span>
                          </div>
                        </Td>
                        <Td>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {customerName || "Guest"}
                            </span>
                            {order.users?.email && (
                              <span className="text-xs text-gray-500">
                                {order.users.email}
                              </span>
                            )}
                            {order.users?.phone_number && (
                              <span className="text-xs text-gray-500">
                                {order.users.phone_number}
                              </span>
                            )}
                          </div>
                        </Td>
                        <Td>
                          <div className="flex flex-col">
                            <span className="text-gray-900">
                              {new Date(order.order_date).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(order.order_date).toLocaleTimeString()}
                            </span>
                          </div>
                        </Td>
                        <Td>
                          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={order.order_status}
                              onChange={(e) =>
                                handleStatusChange(order.order_id, e.target.value as OrderStatus)
                              }
                              disabled={updatingId === order.order_id}
                              className="text-xs font-semibold rounded-lg border border-gray-200 px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                              {allowedStatuses.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                statusColors[order.order_status] ||
                                "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {order.order_status}
                            </span>
                            {updatingId === order.order_id && (
                              <span className="text-[11px] text-gray-500">Updating...</span>
                            )}
                          </div>
                        </Td>
                        <Td className="font-semibold text-gray-900">
                          {currency(order.total_amount || 0)}
                        </Td>
                        <Td className="text-gray-700">{itemCount}</Td>
                        <Td>
                          {address ? (
                            <div className="text-xs text-gray-700 leading-snug max-w-[200px]">
                              {address.full_name && <div>{address.full_name}</div>}
                              {address.street_address && <div>{address.street_address}</div>}
                              {(address.city || address.state || address.postal_code) && (
                                <div>
                                  {[address.city, address.state, address.postal_code]
                                    .filter(Boolean)
                                    .join(", ")}
                                </div>
                              )}
                              {address.phone_number && <div>{address.phone_number}</div>}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-500">—</span>
                          )}
                        </Td>
                      </tr>
                      {isExpanded && (
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <td colSpan={7} className="px-4 py-4">
                            <div className="space-y-3">
                              <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                                Order Items
                              </div>
                              <div className="space-y-2">
                                {order.order_items?.map((item) => (
                                  <div
                                    key={item.order_item_id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2"
                                  >
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-gray-900">
                                        {item.products?.product_name || "Product"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-700">
                                      <span>Qty: <strong>{item.quantity}</strong></span>
                                      <span>Price: <strong>{currency(item.price || 0)}</strong></span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="py-3 px-4 font-semibold text-left whitespace-nowrap">{children}</th>
  );
}

function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`py-3 px-4 align-top ${className}`}>{children}</td>;
}

function SummaryCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm p-4 flex flex-col gap-1">
      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-semibold">
        {label}
      </span>
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      {sub && <span className="text-xs text-gray-500">{sub}</span>}
    </div>
  );
}

