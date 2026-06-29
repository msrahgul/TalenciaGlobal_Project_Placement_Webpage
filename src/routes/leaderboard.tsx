import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Code2, Medal, Zap, Users, TrendingUp } from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

export const Route = createFileRoute("/leaderboard")({
  component: LeaderboardPage,
});

interface LeaderboardUser {
  id: string;
  name: string;
  avatar_url: string;
  readiness_score: number;
}

interface HackathonTopic {
  skill_set_id: number;
  level_number: number;
  topics: string;
}

function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardUser[]>([]);
  const [topics, setTopics] = useState<HackathonTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch top 10 users
        const { data: userData, error: userError } = await supabase
          .from("student_profiles")
          .select("id, name, avatar_url, readiness_score")
          .order("readiness_score", { ascending: false })
          .limit(10);
        
        if (userData && !userError) {
          setLeaders(userData);
        }

        // Fetch some hackathon topics (just sampling from skill_set_topics for demo)
        const { data: topicData, error: topicError } = await supabase
          .from("skill_set_topics")
          .select("skill_set_id, level_number, topics")
          .limit(3);
        
        if (topicData && !topicError) {
          setTopics(topicData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0c] pt-24 pb-20 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-4 py-1.5 text-xs font-semibold text-yellow-500 mb-6 shadow-[0_0_20px_rgba(234,179,8,0.15)]">
            <Trophy className="w-4 h-4" /> Gamification Tier
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-white mb-4">
            Campus Placement Arena
          </h1>
          <p className="text-slate-400">
            Compete with peers, track your readiness score, and participate in active hackathons.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Leaderboard Section */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Live Leaderboard
            </h2>
            
            <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 backdrop-blur-sm">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-16 rounded-2xl bg-slate-800/50 animate-pulse" />
                  ))}
                </div>
              ) : leaders.length === 0 ? (
                <div className="text-center py-10 text-slate-500">No data available yet.</div>
              ) : (
                <div className="space-y-3">
                  {leaders.map((user, idx) => (
                    <motion.div 
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center justify-between p-4 rounded-2xl bg-slate-900 border border-slate-800/60 hover:bg-slate-800/50 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 font-bold text-center ${
                          idx === 0 ? 'text-yellow-400 text-xl' :
                          idx === 1 ? 'text-slate-300 text-lg' :
                          idx === 2 ? 'text-amber-600 text-lg' :
                          'text-slate-500'
                        }`}>
                          #{idx + 1}
                        </div>
                        <img 
                          src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full border border-slate-700 bg-slate-800"
                        />
                        <div>
                          <div className="font-semibold text-slate-200">{user.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-400" /> Climbing the ranks
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="font-heading font-bold text-lg text-white tabular-nums">
                          {user.readiness_score}
                        </div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">
                          Score
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Competitions Section */}
          <div className="space-y-6">
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-purple-400" />
              Active Hackathons
            </h2>

            <div className="space-y-4">
              {isLoading ? (
                <div className="h-40 rounded-3xl bg-slate-900/40 border border-slate-800 animate-pulse" />
              ) : (
                topics.map((topic, i) => (
                  <div key={i} className="bg-gradient-to-br from-slate-900/80 to-slate-950 border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors cursor-pointer">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
                    
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-4 border border-purple-500/20">
                      <Zap className="w-3 h-3" /> Live Event
                    </div>
                    
                    <h3 className="font-heading font-bold text-lg text-white mb-2">
                      Level {topic.level_number} Assessment Window
                    </h3>
                    
                    <p className="text-sm text-slate-400 mb-5 line-clamp-2">
                      Focus Area: {topic.topics}
                    </p>
                    
                    <button className="w-full py-2.5 rounded-xl bg-slate-800 text-sm font-medium text-white hover:bg-purple-600 transition-colors">
                      Join Arena
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
