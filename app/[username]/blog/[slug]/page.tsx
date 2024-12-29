import { createClient } from '@supabase/supabase-js';
import Head from 'next/head'; // For SEO Meta Tags
import { notFound } from 'next/navigation'; // Used to show 404 if blog not found
import Header from '../../components/Header';
import WorkLocation from '../../components/WorkLocation';
import Footer from '../../components/Footer';
import { unstable_noStore } from 'next/cache';
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../../link-page-responsive.css";
import "../../bootstrap.min.css";
import "../../link-page.css";
import Link from 'next/link';
import { formatDate } from '@/utils/formatDate';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
}

const fetchProfilePicture = async (dentistryId: string) => {
  try {
    // Check if the profile picture exists in the storage
    const { data, error } = await supabase.storage
      .from("profile-pics")
      .list(dentistryId);

    if (error) throw error;

    if (data.length > 0) {
      const fileName = data[0].name;
      const { data: urlData } = await supabase.storage
        .from("profile-pics")
        .getPublicUrl(`${dentistryId}/${fileName}`);

      return (urlData?.publicUrl || "/placeholder.png"); // Set the image URL or placeholder
    } else {
      return ("/placeholder.png"); // Use placeholder if no profile pic
    }
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return ("/placeholder.png"); // Set placeholder on error
  }
};

export default async function BlogPage({ params }: { params: { slug: string } }) {
  // Fetch the blog data using the slug parameter
  const { slug } = params;
  const { data: blog, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !blog) {
    notFound(); // Shows 404 page if the blog is not found
  }

  const user_id = blog.writer_id;
  
  unstable_noStore();
  
  // Fetch the user from Supabase based on the username slug
  const { data: user, error: userError } = await supabase
  .from("users")
  .select("id, position, first_name, last_name, username, title, gdc_no, qualification")
  .eq("id", user_id)
  .single();
  
  // Fetch the dentistry data using the user's ID
  const { data: dentistry, error: dentistryError } = await supabase
  .from("dentistries")
  .select("dentistry_id, about_title, about_text, phone, booking_link, contact_email")
  .eq("user_id", user?.id)
  .single();
  
  const profilePicUrl = await fetchProfilePicture(dentistry?.dentistry_id);

  return (
    <>
      <Head>
        <title>{blog?.meta_title}</title>
        <meta name="description" content={blog.meta_description} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={blog?.meta_title} />
        <meta property="og:description" content={blog?.meta_description} />
        <meta property="og:url" content={`https://yourdomain.com/blog/${blog?.slug}`} />
        <meta property="og:type" content="article" />
        {/* <meta property="og:image" content="https://yourdomain.com/og-image.jpg" /> */}

        {/* Twitter Meta Tags */}
        {/* <meta name="twitter:card" content="summary_large_image" /> */}
        <meta name="twitter:title" content={blog?.meta_title} />
        <meta name="twitter:description" content={blog?.meta_description} />
        {/* <meta name="twitter:image" content="https://yourdomain.com/twitter-image.jpg" /> */}
      </Head>

      <div className="wrapper">
        <div className="profile-wrapper">
          <Header
            username={user?.username}
            dentistry_id={dentistry?.dentistry_id}
            contact_email={dentistry?.contact_email}
          />

          <div className='text-center'>
            <img
              src={blog.image_url}
              alt="preview"
              className="w-full mt-20 mb-4 rounded-[6px]"
            />

            <h1 className='text-[23px] font-semibold'>{blog.title}</h1>

            <div className='w-full flex justify-center my-4'>
              <div className='flex items-center gap-2 text-left'>
                <div>
                  <img
                    src={profilePicUrl || "/placeholder.png"}
                    alt="user"
                    className="w-[50px] h-[50px] rounded-full"
                  />
                </div>
                <div>
                  <div className='text-xs'>{`${user?.title === 'N/A' ? '' : user?.title} ${user?.first_name} ${user?.last_name}`}</div>
                  <div className='text-[10px] text-[#9D9D9D]'>{formatDate(blog.created_at)}</div>
                </div>
              </div>
            </div>

            <p className='text-[#9d9d9d] text-[14px]'>{blog.content}</p>
          </div>

          <div className='w-full flex justify-center mt-4 mb-6'>
            <Link
              href={`/${user?.username}`}
              className='w-[93px] h-[41px] rounded-[10px] border text-[14px] text-center no-underline text-black px-6 py-2'
            >
              <span>Back</span>
            </Link>
          </div>

          <WorkLocation dentistry={dentistry} />
          {dentistry &&
            <Footer
              dentistryId={dentistry.dentistry_id}
              bookingLink={dentistry?.booking_link}
              contact_email={dentistry?.contact_email}
              userTitle={user?.title}
              username={user?.username}
              userFirstName={user?.first_name}
              userLastName={user?.last_name}
            />}
        </div>
      </div>
    </>
  );
}

export async function generateStaticParams() {
  // Fetch slugs for all blogs to generate static paths
  const { data: blogs, error } = await supabase.from('blogs').select('slug');

  if (error) {
    console.error(error);
    return [];
  }

  // Generate paths for all blogs
  return blogs.map((blog: { slug: string }) => ({
    slug: blog.slug,
  }));
}
