import { o as __toESM } from "../_runtime.mjs";
import { n as supabase, t as hasSupabase } from "./supabaseClient-BlbV5jcN.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/AuthContext-zkUkKsx2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AuthContext = (0, import_react.createContext)(void 0);
var ADMIN_EMAIL = "msrahgul@gmail.com";
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [profile, setProfile] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const fetchProfile = async (userId) => {
		if (!hasSupabase) return;
		try {
			const { data, error } = await supabase.from("student_profiles").select("*").eq("id", userId).single();
			if (error && error.code !== "PGRST116") console.error("Error fetching profile:", error);
			if (data) setProfile(data);
			else setProfile(null);
		} catch (err) {
			console.error("Failed to fetch profile", err);
		}
	};
	(0, import_react.useEffect)(() => {
		if (!hasSupabase) {
			setIsLoading(false);
			return;
		}
		const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
			if (session?.user) {
				const email = session.user.email || "";
				const isAdminEmail = email === ADMIN_EMAIL;
				const isKarunyaDomain = email.endsWith("@karunya.edu.in");
				if (!isAdminEmail && !isKarunyaDomain) {
					toast.error("Unauthorized Account", {
						description: "Please use your @karunya.edu.in account to access this platform.",
						duration: 5e3
					});
					await supabase.auth.signOut();
					setUser(null);
					setProfile(null);
					setIsLoading(false);
					return;
				}
				setUser(session.user);
				await fetchProfile(session.user.id);
			} else {
				setUser(null);
				setProfile(null);
			}
			setIsLoading(false);
		});
		return () => {
			subscription.unsubscribe();
		};
	}, []);
	const signInWithGoogle = async () => {
		if (!hasSupabase) {
			toast.error("Database Connection Missing", { description: "Supabase configuration is not available." });
			return { error: /* @__PURE__ */ new Error("No database") };
		}
		const { error } = await supabase.auth.signInWithOAuth({
			provider: "google",
			options: {
				redirectTo: window.location.origin,
				queryParams: { hd: "karunya.edu.in" }
			}
		});
		if (error) toast.error("Login Failed", { description: error.message });
		return { error };
	};
	const signOut = async () => {
		if (!hasSupabase) return;
		await supabase.auth.signOut();
		toast.info("Signed out successfully.");
	};
	const refreshProfile = async () => {
		if (user) await fetchProfile(user.id);
	};
	const isAdmin = user?.email === ADMIN_EMAIL;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			profile,
			isLoading,
			isAdmin,
			signInWithGoogle,
			signOut,
			refreshProfile
		},
		children
	});
}
function useAuth() {
	const context = (0, import_react.useContext)(AuthContext);
	if (context === void 0) throw new Error("useAuth must be used within an AuthProvider");
	return context;
}
//#endregion
export { useAuth as n, AuthProvider as t };
