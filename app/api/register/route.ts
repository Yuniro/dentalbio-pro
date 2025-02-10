import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const calculateAge = (birthday: Date) => {
    const today = new Date();
    const birthDate = new Date(birthday); // Convert birthday string to Date if necessary

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // If the current month is before the birth month, or it's the birth month but the current day is before the birthday
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--; // Subtract 1 from age
    }

    return age;
}

const addMonthsToCurrentDate = (months: number) => {
    const today = new Date();
    today.setMonth(today.getMonth() + months);

    if (today.getDate() !== new Date().getDate()) today.setDate(0)
    return today;
  }

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

        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/offer-code`, { method: 'GET' })
        const serverOfferCode = await response.json()

        if (!response.ok) {
            return NextResponse.json({ error: "Can't get offerCode from the admin" }, { status: 400 })
        }

        const trialEndDate = () => {
            return (calculateAge(birthday) <= 27 && position === "Student" && offerCode === serverOfferCode.value) ? addMonthsToCurrentDate(6) : addMonthsToCurrentDate(3)
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
                    subscription_status: "PRO",
                    trial_end: trialEndDate(),
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
