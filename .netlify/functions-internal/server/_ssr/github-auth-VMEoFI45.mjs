import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DFVziub0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/github-auth-VMEoFI45.js
function getGitHubAuthUrl(origin) {
	const clientId = "Ov23livpVRJVafZwbNnF";
	const redirectUri = `${origin}/auth/github/callback`;
	const scope = "read:user user:email";
	const state = crypto.randomUUID();
	sessionStorage.setItem("github_oauth_state", state);
	return `https://github.com/login/oauth/authorize?${new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		scope,
		state
	})}`;
}
var exchangeGitHubCode = createServerFn({ method: "POST" }).validator((code) => code).handler(createSsrRpc("7831c7ee1b181db0f0fc9c14750dc9cad5a686da7afbbd4e4b8e77f894718a0c"));
//#endregion
export { getGitHubAuthUrl as n, exchangeGitHubCode as t };
