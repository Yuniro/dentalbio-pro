import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// This function will check if a user is authenticated
export async function checkSession() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }: { name: string; value: string; options?: any }) => {
            cookieStore.set(name, value, options);
          });
        }
      },
    }
  );

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    return null; // No user session
  }
  
  return data.user; // Return user session
}
