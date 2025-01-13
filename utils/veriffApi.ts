// utils/veriffApi.ts
export async function getSessionStatus(sessionId: string): Promise<any> {
  const apiKey = process.env.VERIFF_API_KEY;
  const apiUrl = process.env.VERIFF_API_URL;

  if (!apiKey || !apiUrl) {
    throw new Error("API key or URL is not set in the environment variables");
  }

  const response = await fetch(`${apiUrl}/v1/sessions/${sessionId}/decision`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch session status: ${response.statusText}`);
  }

  return response.json();
}
