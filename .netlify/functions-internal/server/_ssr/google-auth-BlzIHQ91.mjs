import { l as createServerFn } from "./esm-Dova13aH.mjs";
import { t as createServerRpc } from "./createServerRpc-WJgk8O8C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/google-auth-BlzIHQ91.js
var exchangeGoogleCode_createServerFn_handler = createServerRpc({
	id: "c448eff53f1e282f80c361bc162d2d35ad02dba6c829a0ca4f8c96dd6e67fe66",
	name: "exchangeGoogleCode",
	filename: "src/lib/google-auth.ts"
}, (opts) => exchangeGoogleCode.__executeServer(opts));
var exchangeGoogleCode = createServerFn({ method: "POST" }).validator((data) => data).handler(exchangeGoogleCode_createServerFn_handler, async (ctx) => {
	const { code, redirectUri } = ctx.data;
	const apiBase = process.env.API_URL || "http://localhost:8080";
	const res = await fetch(`${apiBase}/api/auth/google/callback`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			code,
			redirectUri
		})
	});
	if (!res.ok) {
		const data = await res.json();
		throw new Error(data.error || "Google authentication failed");
	}
	const data = await res.json();
	return {
		email: data.email,
		name: data.name,
		avatar: data.avatar || "",
		token: data.token
	};
});
//#endregion
export { exchangeGoogleCode_createServerFn_handler };
