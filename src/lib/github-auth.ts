import type { OAuthAction } from "@/lib/google-auth";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export function getGitHubAuthUrl(origin: string, action: OAuthAction = "signin"): string {
  const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
  if (!clientId) {
    throw new Error(
      "Missing VITE_GITHUB_CLIENT_ID environment variable. " +
        "Create a .env file with VITE_GITHUB_CLIENT_ID=your_github_client_id",
    );
  }

  const redirectUri = `${origin}/auth/github/callback`;
  const scope = "read:user user:email";
  const state = crypto.randomUUID();

  sessionStorage.setItem("github_oauth_state", state);
  sessionStorage.setItem("github_oauth_action", action);

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope,
    state,
  });

  return `https://github.com/login/oauth/authorize?${params}`;
}

export interface GitHubUser {
  email: string;
  name: string;
  avatar: string;
  githubUsername: string;
  token: string;
}

export async function exchangeGitHubCode(input: {
  code: string;
  action?: OAuthAction;
}): Promise<GitHubUser> {
  const code = input.code;
  const action = input.action || "signin";

  const res = await fetch(`${API_BASE}/api/auth/github/callback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, action }),
  });
  console.info(`[github-auth] POST ${API_BASE}/api/auth/github/callback -> ${res.status}`);

  if (!res.ok) {
    const data = (await res.json()) as Record<string, string>;
    console.error(`[github-auth] backend error ${res.status}:`, data);
    throw new Error(data.error || "GitHub authentication failed");
  }

  const data = (await res.json()) as Record<string, string>;
  return {
    email: data.email,
    name: data.name,
    avatar: data.avatar || "",
    githubUsername: data.name,
    token: data.token,
  };
}
