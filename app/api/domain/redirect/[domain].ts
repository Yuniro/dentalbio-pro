import { NextResponse } from "next/server";
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: { domain: string } }) {
    const supabase = createClient();
    const { domain } = params;

    // Fetch the user associated with the domain
    const { data: user, error } = await supabase
        .from("users")
        .select("username")
        .eq("domain", domain)
        .single();

    if (error || !user) {
        return NextResponse.redirect(new URL("/404", request.url));
    }

    // Redirect to the user's page while keeping the custom domain
    return NextResponse.redirect(new URL(`/dental.bio/${user.username}`, request.url));
} 