import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(req: Request) {
  const { path } = await req.json();

  if (!path) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  // Revalidate the specific path
  revalidatePath(path);

  return NextResponse.json({ revalidated: true });
}
