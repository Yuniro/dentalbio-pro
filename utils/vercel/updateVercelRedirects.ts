export const updateVercelRedirects = async (username: string, domain: string) => {
  const projectId = process.env.VERCEL_PROJECT_ID;
  const vercelToken = process.env.VERCEL_API_TOKEN;

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