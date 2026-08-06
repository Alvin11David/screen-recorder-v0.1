//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-Ybe7gSCf.js
var manifest = {
	"7831c7ee1b181db0f0fc9c14750dc9cad5a686da7afbbd4e4b8e77f894718a0c": {
		functionName: "exchangeGitHubCode_createServerFn_handler",
		importer: () => import("./_ssr/github-auth-Be_-i7jb.mjs")
	},
	"c448eff53f1e282f80c361bc162d2d35ad02dba6c829a0ca4f8c96dd6e67fe66": {
		functionName: "exchangeGoogleCode_createServerFn_handler",
		importer: () => import("./_ssr/google-auth-BlzIHQ91.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ?? await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
