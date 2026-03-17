import React, { useState, useEffect } from 'react';
import { Leaf, Trophy, Users, ShieldCheck, Camera, Send, Clock, CheckCircle2, XCircle, LayoutDashboard, Flame, Sparkles, Plus, Trash2 } from 'lucide-react';

// --- STRUCTURE DES DONNÉES ---
interface Challenge { id: number; title: string; desc: string; category: string; points: number; }
interface Proof { id: number; user: string; class: string; challengeTitle: string; status: 'pending' | 'approved'; timestamp: string; image: string; }

export default function App() {
  // --- ÉTATS (LA MÉMOIRE DE L'APP) ---
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  
  // Base de données locale (Défis)
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, title: "Zéro Plastique", desc: "Utilise une gourde toute la journée.", category: "ÉCO", points: 40 },
    { id: 2, title: "Escaliers Only", desc: "Pas d'ascenseur aujourd'hui !", category: "SPORT", points: 20 }
  ]);

  // Base de données locale (Preuves envoyées)
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [userClass, setUserClass] = useState('Bachelor 1');
  const [userName, setUserName] = useState('');

  // --- LOGIQUE COMPTE À REBOURS 13H ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(13, 0, 0, 0);
      if (now >= target) target.setDate(target.getDate() + 1);
      const diff = target.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- ACTIONS UTILISATEUR ---
  const handleSendProof = () => {
    if (!userName) return alert("Indique ton nom !");
    const newProof: Proof = {
      id: Date.now(),
      user: userName,
      class: userClass,
      challengeTitle: challenges[0].title,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2h-digit', minute: '2h-digit' }),
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=200&auto=format&fit=crop"
    };
    setProofs([newProof, ...proofs]);
    alert("Preuve envoyée à l'administrateur !");
    setUserName('');
  };

  // --- ACTIONS ADMIN ---
  const approveProof = (id: number) => {
    setProofs(proofs.map(p => p.id === id ? { ...p, status: 'approved' } : p));
  };

  const deleteProof = (id: number) => {
    setProofs(proofs.filter(p => p.id !== id));
  };

  const updateChallenge = (id: number, newTitle: string) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, title: newTitle } : c));
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 shadow-2xl relative">
      
      {/* HEADER AVEC SCORE ET TIMEOUT */}
      <div className="bg-emerald-900 pt-10 pb-12 px-6 rounded-b-[3rem] text-white relative shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <Leaf className="text-emerald-400" fill="currentColor" />
            <h1 className="text-xl font-black italic tracking-tighter">GREEN CHALLENGE</h1>
          </div>
          <div className="bg-white/10 px-4 py-1 rounded-full text-xs font-bold border border-white/20">
            Score: {proofs.filter(p => p.status === 'approved').length * 40} pts
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="bg-orange-100 p-2 rounded-xl text-orange-600"><Clock size={20}/></div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Prochain défi</p>
              <p className="text-lg font-black text-slate-800 tabular-nums">{timeLeft}</p>
            </div>
          </div>
          <div className="text-right">
             <div className="inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-tighter">Actif</div>
          </div>
        </div>
      </div>

      <div className="px-6 -mt-4 relative z-20">
        
        {/* --- ONGLET ACCUEIL (DÉFI) --- */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2.5rem] p-7 shadow-xl border border-slate-50">
              <span className="text-emerald-500 font-black text-[10px] tracking-widest uppercase mb-2 block italic underline">Challenge #001</span>
              <h2 className="text-2xl font-black text-slate-800 mb-2">{challenges[0].title}</h2>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">{challenges[0].desc}</p>
              
              <div className="space-y-4 pt-4 border-t border-slate-50">
                <input 
                  type="text" 
                  placeholder="Ton Prénom" 
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 ring-emerald-500" 
                />
                <select 
                  value={userClass} 
                  onChange={(e) => setUserClass(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold"
                >
                  <option>Bachelor 1</option><option>Bachelor 2</option><option>Bachelor 3</option><option>Mastère</option>
                </select>
                <button onClick={handleSendProof} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl font-black shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all">
                  <Camera size={20} /> ENVOYER LA PREUVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- ONGLET MUR (REUVE DES AUTRES) --- */}
        {activeTab === 'proofs' && (
          <div className="space-y-4">
            <h3 className="text-lg font-black text-slate-800 px-2">Fil d'actualité</h3>
            {proofs.filter(p => p.status === 'approved').length === 0 && (
              <p className="text-center text-slate-400 py-10 italic">Aucune preuve validée pour le moment...</p>
            )}
            {proofs.filter(p => p.status === 'approved').map(p => (
              <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-4 flex gap-4 animate-in slide-in-from-right">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex-shrink-0"><img src={p.image} className="w-full h-full object-cover rounded-2xl" /></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-black text-sm">{p.user}</p>
                    <span className="text-[9px] font-bold text-slate-400">{p.timestamp}</span>
                  </div>
                  <p className="text-[10px] text-emerald-600 font-bold uppercase">{p.class}</p>
                  <p className="text-xs text-slate-500 mt-1">A réussi : {p.challengeTitle}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- ONGLET CLASSEMENT --- */}
        {activeTab === 'leaderboard' && (
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl">
             <h3 className="text-lg font-black mb-6 text-center">🏆 Top Green Leaders</h3>
             <div className="space-y-4">
               {proofs.filter(p => p.status === 'approved').slice(0, 5).map((p, i) => (
                 <div key={p.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                   <span className="font-black text-emerald-600">0{i+1}</span>
                   <div className="flex-1 font-bold text-sm">{p.user} ({p.class})</div>
                   <div className="font-black text-emerald-700">40 pts</div>
                 </div>
               ))}
               {proofs.filter(p => p.status === 'approved').length === 0 && <p className="text-center text-slate-400">Le podium est vide !</p>}
             </div>
          </div>
        )}

        {/* --- ONGLET ADMIN (MOT DE PASSE: carragrillon) --- */}
        {activeTab === 'admin' && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl">
            {!isAdmin ? (
              <div className="space-y-4">
                <h3 className="text-center font-black">Accès Éditeur</h3>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-none rounded-xl p-4 text-center font-bold"
                  placeholder="Code secret"
                />
                <button onClick={() => password === 'carragrillon' ? setIsAdmin(true) : alert("Faux !")} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black">ENTRER</button>
              </div>
            ) : (
              <div className="space-y-8">
                <div>
                  <h4 className="font-black text-xs uppercase text-slate-400 mb-4">🔧 Modifier le Défi Actif</h4>
                  <input 
                    type="text" 
                    value={challenges[0].title}
                    onChange={(e) => updateChallenge(challenges[0].id, e.target.value)}
                    className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl p-3 text-sm font-bold"
                  />
                  <p className="text-[10px] mt-2 text-slate-400 italic">La modification est instantanée sur l'accueil.</p>
                </div>

                <div>
                  <h4 className="font-black text-xs uppercase text-slate-400 mb-4 tracking-tighter">🔔 Preuves en attente ({proofs.filter(p => p.status === 'pending').length})</h4>
                  <div className="space-y-3">
                    {proofs.filter(p => p.status === 'pending').map(p => (
                      <div key={p.id} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs font-black">{p.user} <span className="font-normal">({p.class})</span></p>
                        <div className="flex gap-2 mt-3">
                          <button onClick={() => approveProof(p.id)} className="flex-1 bg-emerald-500 text-white py-2 rounded-lg text-[10px] font-black uppercase">Approuver</button>
                          <button onClick={() => deleteProof(p.id)} className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter">Refuser</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsAdmin(false)} className="w-full py-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">Se déconnecter</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRE DE NAVIGATION (TAB BAR) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-100 flex justify-around items-center px-4 pt-3 pb-8 z-50 rounded-t-[2rem] shadow-2xl">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-300'}`}>
          <Flame size={24} fill={activeTab === 'home' ? "currentColor" : "none"} /><span className="text-[9px] font-bold uppercase">Défi</span>
        </button>
        <button onClick={() => setActiveTab('proofs')} className={`flex flex-col items-center gap-1 ${activeTab === 'proofs' ? 'text-emerald-600' : 'text-slate-300'}`}>
          <LayoutDashboard size={24} /><span className="text-[9px] font-bold uppercase">Mur</span>
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1 ${activeTab === 'leaderboard' ? 'text-emerald-600' : 'text-slate-300'}`}>
          <Trophy size={24} /><span className="text-[9px] font-bold uppercase">Top</span>
        </button>
        <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1 ${activeTab === 'admin' ? 'text-emerald-600' : 'text-slate-300'}`}>
          <ShieldCheck size={24} /><span className="text-[9px] font-bold uppercase">Admin</span>
        </button>
      </nav>
    </div>
  );
}
