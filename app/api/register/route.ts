import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
    const supabase = createClient();
    const {
        email,
        password,
        username,
        firstName,
        lastName,
        birthday,
        position,
        offerCode,
        country,
        title,
        redirectUrl,
    } = await request.json();

    // Validate input data
    if (!email || !password || !username) {
        return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    try {
        // Check if email is already in use
        const { data: emailCheckData, error: emailCheckError } = await supabase
            .from("users")
            .select("email")
            .eq("email", email)
            .single();

        if (emailCheckError && emailCheckError.code !== "PGRST116") {
            return NextResponse.json({ error: "Error checking email availability." }, { status: 500 });
        }

        if (emailCheckData) {
            return NextResponse.json({ error: "Email is already in use." }, { status: 400 });
        }

        // Check if username is already taken
        const { data: usernameCheckData, error: usernameCheckError } = await supabase
            .from("users")
            .select("username")
            .ilike("username", username) // Case-insensitive check
            .single();

        if (usernameCheckError && usernameCheckError.code !== "PGRST116") {
            return NextResponse.json({ error: "Error checking username availability." }, { status: 500 });
        }

        if (usernameCheckData) {
            return NextResponse.json({ error: "Username is already taken." }, { status: 400 });
        }

        // Sign up the user with Supabase
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    first_name: firstName,
                    last_name: lastName,
                    birthday,
                    position,
                    offer_code: offerCode,
                    country,
                    title,
                },
                emailRedirectTo: redirectUrl,
            },
        });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }

        return NextResponse.json({ message: "User registered successfully." }, { status: 200 });
    } catch (err) {
        console.error("Error during registration:", err);
        return NextResponse.json({ error: "Unexpected error occurred." }, { status: 500 });
    }
}
