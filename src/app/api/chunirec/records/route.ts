import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://api.chunirec.net/2.0';

export async function GET(req: NextRequest) {
  const token = process.env.CHUNIREC_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'APIトークンが未設定です。.env.local を確認してください。' }, { status: 500 });
  }

  const userName = req.nextUrl.searchParams.get('user_name');
  if (!userName) {
    return NextResponse.json({ error: 'user_name が必要です。' }, { status: 400 });
  }

  try {
    const url =
      `${BASE}/records/showall.json` +
      `?user_name=${encodeURIComponent(userName)}&region=jp2&token=${token}`;

    const res = await fetch(url, { cache: 'no-store' });
    const body = await res.json();

    if (res.status === 403 || body?.error?.code === 403) {
      return NextResponse.json(
        { error: 'このユーザーは非公開設定です。chunirec でスコアを公開してください。' },
        { status: 403 },
      );
    }
    if (res.status === 404 || body?.error?.code === 404) {
      return NextResponse.json(
        { error: 'ユーザーが見つかりません。chunirec ユーザー名を確認してください。' },
        { status: 404 },
      );
    }
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
