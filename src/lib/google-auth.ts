const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export type OAuthAction = "signin" | "signup";

export function getGoogleAuthUrl(origin: string, action: OAuthAction = "signin"): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "Missing VITE_GOOGLE_CLIENT_ID environment variable. " +
        "Create a .env file with VITE_GOOGLE_CLIENT_ID=your_google_client_id",
    );
  }

  const redirectUri = `${origin}/auth/google/callback`;
  const state = crypto.randomUUID();

  sessionStorage.setItem("google_oauth_state", state);
  sessionStorage.setItem("google_oauth_action", action);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export interface GoogleUser {
  email: string;
  name: string;
  avatar: string;
  token: string;
}

export async function exchangeGoogleCode(input: {
  code: string;
  redirectUri: string;
  action?: OAuthAction;
}): Promise<GoogleUser> {
  const { code, redirectUri } = input;
  const action = input.action || "signin";

  const res = await fetch(`${API_BASE}/api/auth/google/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, redirectUri, action }),
  });
  console.info(`[google-auth] POST ${API_BASE}/api/auth/google/callback -> ${res.status}`);

  if (!res.ok) {
    const data = (await res.json()) as Record<string, string>;
    console.error(`[google-auth] backend error ${res.status}:`, data);
    throw new Error(data.error || "Google authentication failed");
  }

  const data = (await res.json()) as Record<string, string>;
  return {
    email: data.email,
    name: data.name,
    avatar: data.avatar || "",
    token: data.token,
  };
}
