"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getOrdersByBuyer } from "@/lib/services/order.service";
import { OrderCard } from "@/components/order/OrderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/button";
import { Package, Search } from "lucide-react";
import Link from "next/link";
import type { Order } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        const data = await getOrdersByBuyer(user.$id);
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (!authLoading) {
      if (user) {
        fetchOrders();
      } else {
        setIsLoading(false);
      }
    }
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight mb-2">Order History</h1>
          <p className="text-muted-foreground">
            Track and manage your recent purchases
          </p>
        </div>
        <div className="bg-muted px-4 py-2 rounded-full text-sm font-medium">
          {orders.length} {orders.length === 1 ? "Order" : "Orders"}
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <OrderCard key={order.$id} order={order} />
          ))}
        </div>
      ) : (
        <div className="min-h-[50vh] flex items-center justify-center rounded-3xl border border-dashed border-muted-foreground/20 bg-muted/30 p-12 text-center">
          <EmptyState
            title="No orders yet"
            description="When you buy something, your order history will appear here."
            icon={<Package className="h-12 w-12 text-muted-foreground/50" />}
            action={
              <Button asChild size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                <Link href="/explore">Start Shopping</Link>
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}

