import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const url = new URL(request.url);
    const referralId = url.searchParams.get('referral');
    const APP_URL = process.env.APP_URL || "http://localhost:3000";

    if (referralId) {
        // Redirect to the register page with the referral ID
        return NextResponse.redirect(`${APP_URL}/register?referral=${referralId}`);
    }
    
    // If no referral ID is present, you can redirect to a default page or return an error
    return NextResponse.redirect(`${APP_URL}/error?message=missing_referral`);
} 