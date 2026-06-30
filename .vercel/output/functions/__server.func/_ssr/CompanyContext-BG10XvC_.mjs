import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CompanyContext-BG10XvC_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STORAGE_KEY = "selected-company";
var CompanyContext = (0, import_react.createContext)(null);
function CompanyProvider({ children }) {
	const [selected, setSelected] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		try {
			const raw = window.localStorage.getItem(STORAGE_KEY);
			if (raw) setSelected(JSON.parse(raw));
		} catch {}
	}, []);
	const selectCompany = (0, import_react.useCallback)((c) => {
		setSelected(c);
		try {
			window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
		} catch {}
	}, []);
	const clear = (0, import_react.useCallback)(() => {
		setSelected(null);
		try {
			window.localStorage.removeItem(STORAGE_KEY);
		} catch {}
	}, []);
	const value = (0, import_react.useMemo)(() => ({
		selected,
		selectCompany,
		clear
	}), [
		selected,
		selectCompany,
		clear
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CompanyContext.Provider, {
		value,
		children
	});
}
function useCompany() {
	const ctx = (0, import_react.useContext)(CompanyContext);
	if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
	return ctx;
}
function readStoredCompany() {
	if (typeof window === "undefined") return null;
	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : null;
	} catch {
		return null;
	}
}
//#endregion
export { readStoredCompany as n, useCompany as r, CompanyProvider as t };
