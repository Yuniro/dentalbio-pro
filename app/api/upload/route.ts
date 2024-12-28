import { createClient } from "@/utils/supabase/server";
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import type { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient();

    const formData = await req.formData();

    const file = formData.get('image') as File;
    const bucket_name = formData.get('bucket_name') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const fileName = `${uuidv4()}-${file.name}`;
    const { data, error } = await supabase.storage.from(bucket_name).upload(fileName, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Generate a public URL if needed
    const { publicUrl } = supabase.storage.from(bucket_name).getPublicUrl(fileName).data;

    return NextResponse.json({ publicUrl });
  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
