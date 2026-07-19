import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request) {
  try {
    const body = await request.json();
    const { religion, slug, tag, path } = body;

    if (tag) {
      revalidateTag(tag);
    }

    if (path) {
      revalidatePath(path);
    }

    if (religion && slug) {
      const namePath = `/names/${religion}/${slug}`;
      revalidatePath(namePath);
    }

    return NextResponse.json({ revalidated: true, path: path || (religion && slug ? `/names/${religion}/${slug}` : null) });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Revalidation webhook endpoint' });
}
