import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createSsrRpc } from "./createSsrRpc-DFVziub0.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/google-auth-BaQiYv-4.js
function getGoogleAuthUrl(origin) {
	const clientId = "971344239033-kg8sa9ag2ket5adh6jtdhg8fhie623an.apps.googleusercontent.com";
	const redirectUri = `${origin}/auth/google/callback`;
	const state = crypto.randomUUID();
	sessionStorage.setItem("google_oauth_state", state);
	return `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
		client_id: clientId,
		redirect_uri: redirectUri,
		response_type: "code",
		scope: "openid email profile",
		state,
		prompt: "select_account"
	})}`;
}
var exchangeGoogleCode = createServerFn({ method: "POST" }).validator((data) => data).handler(createSsrRpc("c448eff53f1e282f80c361bc162d2d35ad02dba6c829a0ca4f8c96dd6e67fe66"));
//#endregion
export { getGoogleAuthUrl as n, exchangeGoogleCode as t };
