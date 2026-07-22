import clientPromise from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q || !q.trim()) {
      return NextResponse.json({ error: '请输入搜索关键词' }, { status: 400 });
    }


    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB || 'short_drama');

    // 发送 ping 验证连接是否正常
    await db.command({ ping: 1 });

    const collection = db.collection('recommend_list');

    const regex = new RegExp(q.trim(), 'i');

    const results = await collection
      .find({ series_name: { $regex: regex } })
      .project({ _id: 0, series_name: 1,status:1})
      .limit(50)
      .toArray();

    return NextResponse.json({ results, total: results.length });
  } catch (error) {
    console.error('搜索错误:', error);
    return NextResponse.json({ error: '搜索失败' }, { status: 500 });
  }
}