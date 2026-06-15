import { NextResponse } from 'next/server';

const BASE = 'https://api.chunirec.net/2.0';

export async function GET() {
  const token = process.env.CHUNIREC_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'APIトークンが未設定です。' }, { status: 500 });
  }

  try {
    const url = `${BASE}/music/showall.json?region=jp2&token=${token}`;
    const res = await fetch(url, { next: { revalidate: 3600 } }); // 1時間キャッシュ
    const body = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: `chunirec APIエラー: ${res.status} - ${body?.error?.message ?? ''}` },
        { status: res.status },
      );
    }

    return NextResponse.json(body);
  } catch (e) {
    return NextResponse.json({ error: `ネットワークエラー: ${(e as Error).message}` }, { status: 500 });
  }
}
