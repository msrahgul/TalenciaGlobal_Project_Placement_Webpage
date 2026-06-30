//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-PZwSt8gG.js
var manifest = { "57dd3b36b2cdcfcbbaf3ea3ef81c88448fb18c571c86ac5b208919ce183ef769": {
	functionName: "chatWithGemini_createServerFn_handler",
	importer: () => import("./_ssr/chat-BnVElfcb.mjs")
} };
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
