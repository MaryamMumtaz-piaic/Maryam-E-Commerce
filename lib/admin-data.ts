import { isDbConfigured, prisma } from "./prisma";

export type AdminOrder = {
  id: string;
  email: string;
  status: string;
  total: number;
  itemCount: number;
  createdAt: string;
};

const DEMO_ORDERS: AdminOrder[] = [
  { id: "demoorder1", email: "customer@maryam.shop", status: "PROCESSING", total: 184.97, itemCount: 3, createdAt: "2026-06-20T09:12:00.000Z" },
  { id: "demoorder2", email: "guest@maryam.shop", status: "PAID", total: 59.99, itemCount: 1, createdAt: "2026-06-21T14:30:00.000Z" },
  { id: "demoorder3", email: "customer@maryam.shop", status: "SHIPPED", total: 312.5, itemCount: 4, createdAt: "2026-06-22T11:05:00.000Z" },
  { id: "demoorder4", email: "buyer@example.com", status: "DELIVERED", total: 89.0, itemCount: 2, createdAt: "2026-06-19T16:45:00.000Z" },
];

export async function getAdminStats() {
  if (!isDbConfigured) {
    return {
      revenue: DEMO_ORDERS.filter((o) => o.status !== "CANCELLED").reduce((s, o) => s + o.total, 0),
      orderCount: DEMO_ORDERS.length,
      productCount: 1040,
      userCount: 2,
      processing: DEMO_ORDERS.filter((o) => o.status === "PROCESSING").length,
    };
  }

  const [revenueAgg, orderCount, productCount, userCount, processing] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.count({ where: { status: "PROCESSING" } }),
  ]);

  return {
    revenue: Number(revenueAgg._sum.total ?? 0),
    orderCount,
    productCount,
    userCount,
    processing,
  };
}

export async function getAdminOrders(limit = 50): Promise<AdminOrder[]> {
  if (!isDbConfigured) return DEMO_ORDERS;
  const orders = await prisma.order.findMany({
    include: { _count: { select: { items: true } } },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return orders.map((o) => ({
    id: o.id,
    email: o.email,
    status: o.status,
    total: Number(o.total),
    itemCount: o._count.items,
    createdAt: o.createdAt.toISOString(),
  }));
}

export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastActive: string;
};

export async function getActiveSessions(): Promise<AdminSession[]> {
  if (!isDbConfigured) {
    return [
      { id: "s1", name: "Maryam Admin", email: "admin@maryam.shop", role: "ADMIN", lastActive: "2026-06-24T08:00:00.000Z" },
      { id: "s2", name: "Demo Customer", email: "customer@maryam.shop", role: "USER", lastActive: "2026-06-24T07:42:00.000Z" },
    ];
  }
  // Recently active users (proxy for active sessions via JWT strategy).
  const users = await prisma.user.findMany({
    orderBy: { updatedAt: "desc" },
    take: 25,
  });
  return users.map((u) => ({
    id: u.id,
    name: u.name ?? "—",
    email: u.email,
    role: u.role,
    lastActive: u.updatedAt.toISOString(),
  }));
}
