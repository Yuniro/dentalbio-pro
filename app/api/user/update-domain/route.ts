import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    const supabase = createClient();
    const { targetUserId, domain } = await request.json();

    try {
        const { data, error } = await supabase
            .from("users")
            .update({ domain })
            .eq("id", targetUserId);

        if (error) {
            return NextResponse.json({ error: "Failed to update user record" }, { status: 500 });
        }

        return NextResponse.json({ message: "Domain saved successfully!" });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 400 });
    }
}