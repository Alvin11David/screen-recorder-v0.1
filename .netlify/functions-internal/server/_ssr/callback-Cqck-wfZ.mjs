import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callback-Cqck-wfZ.js
var $$splitComponentImporter = () => import("./callback-DWzlTxyr.mjs");
var Route = createFileRoute("/auth/github/callback")({
	validateSearch: (search) => ({
		code: search.code,
		state: search.state
	}),
	head: () => ({ meta: [{
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
