export async function generateUniqueSlug(
  supabase: any, // Supabase client instance
  title: string
): Promise<string> {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special characters
    .replace(/\s+/g, '-');       // Replace spaces with hyphens

  let uniqueSlug = baseSlug;
  let counter = 1;

  // Check if the slug already exists in the database
  while (await slugExists(supabase, uniqueSlug)) {
    uniqueSlug = `${baseSlug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

async function slugExists(supabase: any, slug: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('blogs')
    .select('id')
    .eq('slug', slug);

  if (error) {
    console.error('Error checking slug existence:', error.message);
    return false;
  }

  return data.length > 0;
}
