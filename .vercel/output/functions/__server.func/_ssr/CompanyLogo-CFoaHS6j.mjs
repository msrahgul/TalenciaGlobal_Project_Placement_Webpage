import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CompanyLogo-CFoaHS6j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COMPANY_DOMAINS = {
	"Accenture": "accenture.com",
	"Fractal": "fractal.ai",
	"Oracle Ind": "oracle.com",
	"Google": "google.com",
	"Apple": "apple.com",
	"MUFG": "mufg.jp",
	"CommBen": "commbank.com.au",
	"Kalvium": "kalvium.com",
	"LTI": "ltimindtree.com",
	"TCS": "tcs.com",
	"Infosys": "infosys.com",
	"Cloudera I": "cloudera.com",
	"Guidewire": "guidewire.com",
	"Amazon": "amazon.com",
	"Shipsy": "shipsy.io",
	"Swiggy": "swiggy.in",
	"Leap Finar": "leapfinance.com",
	"Cisco": "cisco.com",
	"Volvo": "volvogroup.com",
	"Amadeus": "amadeus.com",
	"NIQ": "nielseniq.com",
	"Snowflake": "snowflake.com",
	"Palantir": "palantir.com",
	"ORSS": "oracle.com",
	"IBM": "ibm.com",
	"Barclays": "barclays.com",
	"Schneider": "se.com",
	"Blinkit": "blinkit.com",
	"Zerodha": "zerodha.com",
	"Myntra": "myntra.com",
	"Nurix": "nurixtx.com",
	"Citi": "citi.com",
	"ZS": "zs.com",
	"FLAM": "flamapp.com",
	"SAP Labs": "sap.com",
	"Xperi": "xperi.com",
	"Consilio": "consilio.com",
	"BT": "bt.com",
	"Capgemini": "capgemini.com",
	"BNY": "bnymellon.com",
	"Fidelity": "fidelity.com",
	"JPMorgan": "jpmorganchase.com",
	"Airbus": "airbus.com",
	"Wells Farg": "wellsfargo.com",
	"Atlassian": "atlassian.com",
	"Nutanix": "nutanix.com",
	"DeepMind": "deepmind.google",
	"Akamai Te": "akamai.com",
	"Adobe": "adobe.com",
	"Genpact": "genpact.com",
	"Uber": "uber.com",
	"Dell Techn": "dell.com",
	"Even Healt": "even.in",
	"Groww": "groww.in",
	"MintAir": "mintair.com",
	"OpenAI": "openai.com",
	"Skyhigh": "skyhighsecurity.com",
	"SpaceX": "spacex.com",
	"Walmart": "walmart.com",
	"Zepto": "zepto.in",
	"DevRev": "devrev.ai",
	"Increff": "increff.com",
	"MoveInSyn": "moveinsync.com",
	"INDmoney": "indmoney.com",
	"NVIDIA": "nvidia.com",
	"ServiceNo": "servicenow.com",
	"Tredence": "tredence.com",
	"CME Grou": "cmegroup.com",
	"HCL Tech": "hcltech.com",
	"Freshwork": "freshworks.com",
	"HP": "hp.com",
	"Philips": "philips.com",
	"Warner Br": "wbd.com",
	"HyperVerg": "hyperverge.co",
	"Motorq": "motorq.com",
	"Autodesk": "autodesk.com",
	"EA": "ea.com",
	"Morgan St": "morganstanley.com",
	"Microsoft": "microsoft.com",
	"Darwinbox": "darwinbox.com",
	"Epifi": "epi.fi",
	"Juspay": "juspay.in",
	"Flipkart": "flipkart.com",
	"Optum": "optum.com",
	"PayPal": "paypal.com",
	"Bajaj Finse": "bajajfinservhealth.in",
	"Bain CN": "bain.com",
	"Proactive": "proactively.com",
	"Samsung P": "samsungprism.com",
	"Acko": "acko.com",
	"Tech Mahi": "techmahindra.com",
	"Bosch": "bosch.com",
	"Concentrix": "concentrix.com",
	"Dunzo": "dunzo.com",
	"BYJUS": "byjus.com",
	"Cleartrip": "cleartrip.com",
	"Cognizant": "cognizant.com",
	"DXC": "dxc.com",
	"PhysicsWa": "pw.live",
	"Udemy": "udemy.com",
	"NTT DATA": "nttdata.com",
	"Virtusa": "virtusa.com",
	"upGrad": "upgrad.com",
	"Zensar": "zensar.com",
	"Wipro": "wipro.com",
	"Paytm Mo": "paytmmoney.com",
	"HCC": "hexagon.com",
	"Simplilearn": "simplilearn.com",
	"BigBasket": "bigbasket.com",
	"Ecom Expr": "ecomexpress.in",
	"Kyndryl": "kyndryl.com",
	"MobiKwik": "mobikwik.com",
	"Shadowfax": "shadowfax.in",
	"Rupeek": "rupeek.com",
	"3i Infotech": "3i-infotech.com",
	"BharatPe": "bharatpe.com",
	"Ather": "atherenergy.com",
	"Seagate": "seagate.com"
};
function CompanyLogo({ name, logoUrl, website, size = 40, className }) {
	const cleanUrls = logoUrl ? logoUrl.split(";").map((u) => {
		const trimmed = u.trim();
		if ([
			"na",
			"n/a",
			"none",
			"null",
			"undefined"
		].includes(trimmed.toLowerCase())) return "";
		const wikiFileMatch = trimmed.match(/^(https?:\/\/[a-z0-9-.]+)\/wiki\/File:(.+)$/i);
		if (wikiFileMatch) return `${wikiFileMatch[1]}/wiki/Special:FilePath/${wikiFileMatch[2]}`;
		return trimmed;
	}).filter((u) => u && u.startsWith("http")) : [];
	let domain = null;
	if (website) try {
		domain = new URL(website).hostname.replace(/^www\./, "");
	} catch {}
	if (!domain) for (const url of cleanUrls) try {
		const host = new URL(url).hostname.replace(/^www\./, "");
		if (![
			"wikimedia.org",
			"wikipedia.org",
			"twimg.com",
			"licdn.com",
			"linkedin.com",
			"seeklogo.com",
			"brandsoftheworld.com",
			"logo.wine"
		].some((d) => host.endsWith(d))) {
			domain = host;
			break;
		}
	} catch {}
	if (!domain) {
		const cleanName = name.toLowerCase();
		for (const [key, dom] of Object.entries(COMPANY_DOMAINS)) if (cleanName.includes(key.toLowerCase())) {
			domain = dom;
			break;
		}
	}
	const [urlIndex, setUrlIndex] = (0, import_react.useState)(0);
	const [stage, setStage] = (0, import_react.useState)(() => {
		if (cleanUrls.length > 0) return "seed";
		if (domain) return "clearbit";
		return "initial";
	});
	const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
	const px = `${size}px`;
	const handleSeedError = () => {
		if (urlIndex + 1 < cleanUrls.length) setUrlIndex((prev) => prev + 1);
		else if (domain) setStage("clearbit");
		else setStage("initial");
	};
	const handleClearbitError = () => {
		if (domain) setStage("google");
		else setStage("initial");
	};
	const handleGoogleError = () => {
		setStage("initial");
	};
	if (stage === "logodev" && website) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: `https://img.logo.dev/${website.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}?token=undefined&size=${size * 2}`,
		alt: `${name} logo`,
		width: size,
		height: size,
		referrerPolicy: "no-referrer",
		className: "rounded-lg bg-white object-contain border border-border " + (className ?? ""),
		style: {
			width: px,
			height: px
		},
		onError: () => {
			if (cleanUrls.length > 0) setStage("seed");
			else if (domain) setStage("clearbit");
			else setStage("initial");
		}
	});
	if (stage === "seed" && cleanUrls.length > 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: cleanUrls[urlIndex],
		alt: `${name} logo`,
		width: size,
		height: size,
		referrerPolicy: "no-referrer",
		className: "rounded-lg bg-white object-contain border border-border p-1 " + (className ?? ""),
		style: {
			width: px,
			height: px
		},
		onError: handleSeedError
	});
	if (stage === "clearbit" && domain) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: `https://logo.clearbit.com/${domain}`,
		alt: `${name} logo`,
		width: size,
		height: size,
		referrerPolicy: "no-referrer",
		className: "rounded-lg bg-white object-contain border border-border p-1 " + (className ?? ""),
		style: {
			width: px,
			height: px
		},
		onError: handleClearbitError
	});
	if (stage === "google" && domain) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
		alt: `${name} logo`,
		width: size,
		height: size,
		referrerPolicy: "no-referrer",
		className: "rounded-lg bg-white object-contain border border-border p-1.5 " + (className ?? ""),
		style: {
			width: px,
			height: px
		},
		onError: handleGoogleError
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg bg-[hsl(var(--dream))] text-white flex items-center justify-center font-heading font-semibold border border-border " + (className ?? ""),
		style: {
			width: px,
			height: px,
			fontSize: size * .45,
			backgroundColor: "#2563eb"
		},
		"aria-label": `${name} logo`,
		children: initial
	});
}
//#endregion
export { CompanyLogo as t };
