import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { getUserInfo } from '@/utils/userInfo';

export async function GET(request: Request) {
    try {
        const supabase = createClient();

        const { data: offerCodeData, error: offerCodeError } = await supabase
            .from('offer_codes')
            .select('value')
            .eq('key', 'offer_code')
            .single()

        if (offerCodeError) {
            return NextResponse.json({ error: offerCodeError.message }, { status: 400 });
        }

        return NextResponse.json(offerCodeData);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const temperOfferCode = await request.json();

    try {
        const supabase = createClient();

        const userData = await getUserInfo({ supabase });

        if (!(userData.role === 'admin'))
            return NextResponse.json({ error: "You have no permission for this action!" });

        const { data: offerCodeData, error: offerCodeError } = await supabase
            .from('offer_codes')
            .update({ value: temperOfferCode })
            .eq('key', 'offer_code')
            .single()

        if (offerCodeError) {
            return NextResponse.json({ error: offerCodeError.message }, { status: 400 });
        }

        return NextResponse.json({ status: "success" });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
