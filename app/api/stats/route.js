import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'short_drama');
    const collection = db.collection('recommend_list');

    const completedCount = await collection.countDocuments({ status: 'completed' });
    const pendingCount = await collection.countDocuments({ status: { $ne: 'completed' } });
    const totalCount = await collection.countDocuments();

    console.log({
      completed: completedCount,
      pending: pendingCount,
      total: totalCount,
    })
    return NextResponse.json({
      completed: completedCount,
      pending: pendingCount,
      total: totalCount,
    });
  } catch (error) {
    console.error('MongoDB 查询错误:', error);
    return NextResponse.json(
      { error: '数据库查询失败' },
      { status: 500 }
    );
  }
}
