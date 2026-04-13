import Link from "next/link";
import { formatPrice } from "@/lib/utils/formatters";
import { formatDate } from "@/lib/utils/formatters";
import type { Order } from "@/lib/types";

interface OrderCardProps {
  order: Order;
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export function OrderCard({ order }: OrderCardProps) {
  return (
    <Link
      href={`/account/orders/${order.$id}`}
      className="block rounded-lg border bg-card p-4 hover:shadow-[var(--shadow-card-hover)] transition-shadow"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs text-muted-foreground">
            Order #{order.$id.slice(0, 8).toUpperCase()}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDate(order.$createdAt)}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}
        >
          {order.status}
        </span>
      </div>

      <div className="flex justify-between items-end">
        <p className="text-sm text-muted-foreground">
          {order.paymentMethod.toUpperCase()} • {order.paymentStatus}
        </p>
        <p className="font-semibold">{formatPrice(order.totalAmount)}</p>
      </div>
    </Link>
  );
}
