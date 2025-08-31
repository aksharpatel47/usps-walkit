import { consumerKey, consumerSecret } from "./config.js";

let accessToken: string | null = null;
let tokenExpiry: number | null = null;
export async function generateOAuthToken(
  consumerKey: string,
  consumerSecret: string
) {
  // Implementation for generating OAuth token
  const response = await fetch("https://apis.usps.com/oauth2/v3/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: consumerKey,
      client_secret: consumerSecret,
      grant_type: "client_credentials",
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to generate OAuth token");
  }

  const data = await response.json();
  const { access_token, expires_in } = data;

  accessToken = access_token;
  // Set token expiry with 1 minute (60 seconds) buffer
  tokenExpiry = Date.now() + (expires_in - 60) * 1000;

  return accessToken;
}

export async function getOAuthToken() {
  if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
    return accessToken;
  }

  // If no valid token is available, generate a new one
  return generateOAuthToken(consumerKey, consumerSecret);
}

export async function getAddress(queryParams: Record<string, string>) {
  const token = await getOAuthToken();
  const url = new URL("https://apis.usps.com/addresses/v3/address");
  url.search = new URLSearchParams(queryParams).toString();

  const urlString = url.toString();
  console.log(`Fetching address from: ${urlString}`);

  const response = await fetch(urlString, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to fetch address: ${errorData}`);
  }

  return response.json();
}
