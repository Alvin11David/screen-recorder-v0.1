import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/github-auth-Be_-i7jb.js
var exchangeGitHubCode_createServerFn_handler = createServerRpc({
	id: "7831c7ee1b181db0f0fc9c14750dc9cad5a686da7afbbd4e4b8e77f894718a0c",
	name: "exchangeGitHubCode",
	filename: "src/lib/github-auth.ts"
}, (opts) => exchangeGitHubCode.__executeServer(opts));
var exchangeGitHubCode = createServerFn({ method: "POST" }).validator((code) => code).handler(exchangeGitHubCode_createServerFn_handler, async (ctx) => {
	const code = ctx.data;
	const apiBase = process.env.API_URL || "http://localhost:8080";
	const res = await fetch(`${apiBase}/api/auth/github/callback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ code })
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || "GitHub authentication failed");
	}
	const data = await res.json();
	return {
		email: data.email,
		name: data.name,
		avatar: data.avatar || "",
		githubUsername: data.name,
		token: data.token
	};
});
//#endregion
export { exchangeGitHubCode_createServerFn_handler };
