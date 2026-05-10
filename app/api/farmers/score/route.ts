import { NextResponse } from 'next/server';
import { calculateFarmScore } from '@/lib/farmscore';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  try {
    const score = await calculateFarmScore(id);
    return NextResponse.json({ success: true, score });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
