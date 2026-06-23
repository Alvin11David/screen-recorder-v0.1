import { createServerFn } from "@tanstack/react-start";

export function getGitHubAuthUrl(origin: string): string {
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

export const exchangeGitHubCode = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as string)
  .handler(async (ctx): Promise<GitHubUser> => {
    const code = ctx.data;
    const apiBase = process.env.API_URL || "http://localhost:8080";

    const res = await fetch(`${apiBase}/api/auth/github/callback`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    if (!res.ok) {
      const data = await res.json() as Record<string, string>;
      throw new Error(data.error || "GitHub authentication failed");
    }

    const data = await res.json() as Record<string, string>;
    return {
      email: data.email,
      name: data.name,
      avatar: data.avatar || "",
      githubUsername: data.name,
      token: data.token,
    };
  });
