import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = createClient();
    const galleriesToUpdate = await request.json(); // Expect an array of objects with `id` and `rank`

    // Perform updates for each gallery
    const updates = galleriesToUpdate.map(({ id, rank }: { id: string, rank: number }) =>
      supabase
        .from('galleries')
        .update({ rank }) // Set the new rank
        .eq('id', id) // Match the gallery by its ID
    );

    // Execute all updates concurrently
    const results = await Promise.all(updates);

    // Check for errors in any of the updates
    const errors = results.filter(({ error }) => error);
    if (errors.length > 0) {
      return NextResponse.json(
        { error: 'Some updates failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ message: 'Ranks updated successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
