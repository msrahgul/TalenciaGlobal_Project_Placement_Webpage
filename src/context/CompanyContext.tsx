import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "selected-company";

export interface SelectedCompany {
  companyId: number;
  companyName: string;
  logoUrl?: string;
}

interface CompanyContextValue {
  selected: SelectedCompany | null;
  selectCompany: (c: SelectedCompany) => void;
  clear: () => void;
}

const CompanyContext = createContext<CompanyContextValue | null>(null);

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedCompany | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setSelected(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  const selectCompany = useCallback((c: SelectedCompany) => {
    setSelected(c);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(c));
    } catch {
      // ignore
    }
  }, []);

  const clear = useCallback(() => {
    setSelected(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ selected, selectCompany, clear }),
    [selected, selectCompany, clear],
  );
  return (
    <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
  );
}

export function useCompany() {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error("useCompany must be used within CompanyProvider");
  return ctx;
}

export function readStoredCompany(): SelectedCompany | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SelectedCompany) : null;
  } catch {
    return null;
  }
}
