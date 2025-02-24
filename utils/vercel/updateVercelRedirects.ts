export const updateVercelRedirects = async (username: string, domain: string) => {
  const projectId = process.env.NEXT_PUBLIC_VERCEL_PROJECT_ID;
  const vercelToken = process.env.NEXT_PUBLIC_VERCEL_API_KEY;

  const response = await fetch(`https://api.vercel.com/v9/projects/${projectId}/config`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${vercelToken}`,
      "content-Type": "application/json"
    },
    body: JSON.stringify({
      redirects: [
        {
          source: `/${username}`,
          destination: `https://${domain}`,
          permanent: true
        }
      ]
    })
  });

  const data = await response.json();
  console.log("Updated Vercel Redirects:", data);
}