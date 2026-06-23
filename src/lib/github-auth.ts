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
}

export const exchangeGitHubCode = createServerFn({ method: "POST" })
  .validator((d: unknown) => d as string)
  .handler(async (ctx): Promise<GitHubUser> => {
    const code = ctx.data;
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      throw new Error("Missing GitHub OAuth server credentials");
    }

    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });

    const tokenData = await tokenRes.json() as Record<string, string>;

    if (!tokenData.access_token) {
      throw new Error(tokenData.error_description || "Failed to get GitHub access token");
    }

    const userRes = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/json" },
    });

    const userData = (await userRes.json()) as Record<string, any>;

    let email = userData.email as string | undefined;
    if (!email) {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}`, Accept: "application/json" },
      });
      const emails = (await emailRes.json()) as Array<Record<string, any>>;
      const primary = emails.find((e) => e.primary);
      email = primary?.email || `${userData.login}@github.com`;
    }

    return {
      email: email!,
      name: userData.name || (userData.login as string),
      avatar: userData.avatar_url as string,
      githubUsername: userData.login as string,
    };
  });
