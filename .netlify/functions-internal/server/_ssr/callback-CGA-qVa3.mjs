import { f as lazyRouteComponent, p as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/callback-CGA-qVa3.js
var $$splitComponentImporter = () => import("./callback-DstVJkpy.mjs");
var Route = createFileRoute("/auth/google/callback")({
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
