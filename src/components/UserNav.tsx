import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { LogOut, Settings, User } from "lucide-react";
import { PreferencesModal } from "./PreferencesModal";
import { motion, AnimatePresence } from "framer-motion";

export function UserNav() {
  const { user, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);

  if (!user || !profile) return null;

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/50 p-1.5 pr-4 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600/20 text-blue-500">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={profile.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              <User className="h-4 w-4" />
            )}
          </div>
          {profile.name.split(" ")[0]}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsMenuOpen(false)} 
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-slate-800 bg-slate-950 p-2 shadow-2xl"
              >
                <div className="px-3 py-2 border-b border-slate-800/60 mb-2">
                  <p className="text-sm font-medium text-white">{profile.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsPreferencesOpen(true);
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-800/60 hover:text-white"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  Manage Preferences
                </button>
                
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut();
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 mt-1"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      <PreferencesModal 
        isOpen={isPreferencesOpen} 
        onClose={() => setIsPreferencesOpen(false)} 
      />
    </>
  );
}
