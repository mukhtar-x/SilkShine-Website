import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongoose';
import Order from '@/lib/models/Order';
import Product from '@/lib/models/Product';

export async function GET() {
    try {
        await connectDB();

        // Total sales (sum of completed orders)
        const salesAgg = await Order.aggregate([
            { $match: { status: 'Completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } },
        ]);
        const totalSales = salesAgg[0]?.total ?? 0;

        // Active orders (not Completed or Cancelled)
        const activeOrders = await Order.countDocuments({
            status: { $in: ['Pending', 'Processing', 'Out for Delivery'] },
        });

        // Pending deliveries
        const pendingDeliveries = await Order.countDocuments({ status: 'Out for Delivery' });

        // Low stock items
        const lowStockItems = await Product.countDocuments({ status: 'Low Stock' });

        // Recent 4 orders for dashboard table
        const recentOrders = await Order.find({})
            .sort({ createdAt: -1 })
            .limit(4)
            .select('orderId customer amount status')
            .lean();

        return NextResponse.json({
            totalSales: `Rs. ${totalSales.toLocaleString()}`,
            activeOrders,
            pendingDeliveries,
            lowStockItems,
            recentOrders: recentOrders.map(o => ({
                id: o.orderId,
                customer: o.customer,
                amount: o.amount,
                status: o.status,
            })),
        });
    } catch (error) {
        console.error('[API] GET /api/admin/stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
