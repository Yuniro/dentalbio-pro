import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache'; // If using server actions

export async function POST(req: Request) {
  const body = await req.json();
  const path = body.path; // Expecting { path: '/hubs' }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true });
  }

  return NextResponse.json({ revalidated: false });
}
