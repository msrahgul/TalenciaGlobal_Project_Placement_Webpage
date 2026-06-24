import { useState } from "react";

interface CompanyLogoProps {
  name: string;
  logoUrl?: string;
  website?: string;
  size?: number;
  className?: string;
}

// Comprehensive name-to-domain mapping to fetch fallback logos via Clearbit / Google APIs
const COMPANY_DOMAINS: Record<string, string> = {
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
  "Seagate": "seagate.com",
};

export function CompanyLogo({
  name,
  logoUrl,
  website,
  size = 40,
  className,
}: CompanyLogoProps) {
  // Parse and sanitize raw logoUrl(s)
  const cleanUrls = logoUrl
    ? logoUrl
        .split(";")
        .map((u) => {
          const trimmed = u.trim();
          // Filter out NA placeholders
          if (["na", "n/a", "none", "null", "undefined"].includes(trimmed.toLowerCase())) {
            return "";
          }
          // Convert Wikimedia/Wikipedia File view pages to Special:FilePath redirects
          const wikiFileMatch = trimmed.match(/^(https?:\/\/[a-z0-9-.]+)\/wiki\/File:(.+)$/i);
          if (wikiFileMatch) {
            const domainName = wikiFileMatch[1];
            const filename = wikiFileMatch[2];
            return `${domainName}/wiki/Special:FilePath/${filename}`;
          }
          return trimmed;
        })
        .filter((u) => u && u.startsWith("http"))
    : [];

  // Extract domain from website or URLs list, fallback to name dictionary lookup
  let domain: string | null = null;
  if (website) {
    try {
      domain = new URL(website).hostname.replace(/^www\./, "");
    } catch {
      // ignore
    }
  }
  if (!domain) {
    for (const url of cleanUrls) {
      try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        const ignored = [
          "wikimedia.org", "wikipedia.org", "twimg.com", "licdn.com", 
          "linkedin.com", "seeklogo.com", "brandsoftheworld.com", "logo.wine"
        ];
        if (!ignored.some(d => host.endsWith(d))) {
          domain = host;
          break;
        }
      } catch {
        // ignore
      }
    }
  }
  if (!domain) {
    const cleanName = name.toLowerCase();
    for (const [key, dom] of Object.entries(COMPANY_DOMAINS)) {
      if (cleanName.includes(key.toLowerCase())) {
        domain = dom;
        break;
      }
    }
  }

  const [urlIndex, setUrlIndex] = useState(0);
  const [stage, setStage] = useState<"logodev" | "seed" | "clearbit" | "google" | "initial">(() => {
    if (import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY && website) {
      return "logodev";
    }
    if (cleanUrls.length > 0) {
      return "seed";
    }
    if (domain) {
      return "clearbit";
    }
    return "initial";
  });

  const initial = (name?.trim()?.[0] ?? "?").toUpperCase();
  const px = `${size}px`;

  const handleSeedError = () => {
    if (urlIndex + 1 < cleanUrls.length) {
      setUrlIndex((prev) => prev + 1);
    } else if (domain) {
      setStage("clearbit");
    } else {
      setStage("initial");
    }
  };

  const handleClearbitError = () => {
    if (domain) {
      setStage("google");
    } else {
      setStage("initial");
    }
  };

  const handleGoogleError = () => {
    setStage("initial");
  };

  if (stage === "logodev" && website) {
    const devDomain = website.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    const key = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY;
    return (
      <img
        src={`https://img.logo.dev/${devDomain}?token=${key}&size=${size * 2}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className={"rounded-lg bg-white object-contain border border-border " + (className ?? "")}
        style={{ width: px, height: px }}
        onError={() => {
          if (cleanUrls.length > 0) {
            setStage("seed");
          } else if (domain) {
            setStage("clearbit");
          } else {
            setStage("initial");
          }
        }}
      />
    );
  }

  if (stage === "seed" && cleanUrls.length > 0) {
    return (
      <img
        src={cleanUrls[urlIndex]}
        alt={`${name} logo`}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className={"rounded-lg bg-white object-contain border border-border p-1 " + (className ?? "")}
        style={{ width: px, height: px }}
        onError={handleSeedError}
      />
    );
  }

  if (stage === "clearbit" && domain) {
    return (
      <img
        src={`https://logo.clearbit.com/${domain}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className={"rounded-lg bg-white object-contain border border-border p-1 " + (className ?? "")}
        style={{ width: px, height: px }}
        onError={handleClearbitError}
      />
    );
  }

  if (stage === "google" && domain) {
    return (
      <img
        src={`https://www.google.com/s2/favicons?sz=128&domain=${domain}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        referrerPolicy="no-referrer"
        className={"rounded-lg bg-white object-contain border border-border p-1.5 " + (className ?? "")}
        style={{ width: px, height: px }}
        onError={handleGoogleError}
      />
    );
  }

  return (
    <div
      className={
        "rounded-lg bg-[hsl(var(--dream))] text-white flex items-center justify-center font-heading font-semibold border border-border " +
        (className ?? "")
      }
      style={{ width: px, height: px, fontSize: size * 0.45, backgroundColor: "#2563eb" }}
      aria-label={`${name} logo`}
    >
      {initial}
    </div>
  );
}
