import React, { useState, useEffect } from 'react';
import { 
  Leaf, Trophy, ShieldCheck, Camera, Send, Clock, CheckCircle2, 
  XCircle, LayoutDashboard, Flame, Sparkles, Plus, Trash2, 
  BarChart3, History, Bell, Image as ImageIcon, Video, Smartphone
} from 'lucide-react';

// --- TYPES ---
interface Challenge { id: number; title: string; desc: string; category: string; points: number; date: string; }
interface Proof { 
  id: number; user: string; class: string; challengeTitle: string; 
  status: 'pending' | 'approved' | 'rejected'; timestamp: string; 
  image: string; type: 'Photo' | 'Vidéo' | 'Screen'; points: number;
}

export default function App() {
  // --- ÉTATS ---
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [showNotif, setShowNotif] = useState(false);
  
  // DONNÉES DYNAMIQUES
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, title: "Zéro Plastique", desc: "Utilise une gourde toute la journée et montre-la à la cafet !", category: "ÉCOLOGIE", points: 40, date: "17 Mars" },
    { id: 2, title: "Escaliers Only", desc: "Interdit de prendre l'ascenseur, même pour le 4ème étage !", category: "BIEN-ÊTRE", points: 20, date: "16 Mars" }
  ]);

  const [proofs, setProofs] = useState<Proof[]>([
    { id: 101, user: "Thomas Durand", class: "Mastère 1", challengeTitle: "Zéro Plastique", status: 'approved', timestamp: "13:45", image: "https://images.unsplash.com/photo-1602143307185-8c15059e8cce?w=200", type: 'Photo', points: 40 },
    { id: 102, user: "Julie Castet", class: "Bachelor 2", challengeTitle: "Zéro Plastique", status: 'pending', timestamp: "14:10", image: "https://images.unsplash.com/photo-1523362622602-af2439c714d0?w=200", type: 'Photo', points: 40 }
  ]);

  const [userName, setUserName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Bachelor 1');
  const [proofType, setProofType] = useState<'Photo' | 'Vidéo' | 'Screen'>('Photo');

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

  // --- ACTIONS ---
  const handleSendProof = () => {
    if (!userName.trim()) return alert("Ajoute ton nom pour gagner les points !");
    const newProof: Proof = {
      id: Date.now(),
      user: userName,
      class: selectedClass,
      challengeTitle: challenges[0].title,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2h-digit', minute: '2h-digit' }),
      image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=400",
      type: proofType,
      points: challenges[0].points
    };
    setProofs([newProof, ...proofs]);
    setUserName('');
    setShowNotif(true);
    setTimeout(() => setShowNotif(false), 3000);
  };

  const calculateClassScore = (className: string) => {
    return proofs
      .filter(p => p.class === className && p.status === 'approved')
      .reduce((sum, p) => sum + p.points, 0);
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFDFD] pb-28 font-sans text-slate-900 shadow-2xl relative overflow-x-hidden">
      
      {/* NOTIFICATION FLOTTANTE */}
      {showNotif && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={20} /> <span className="font-bold text-sm">Preuve envoyée à l'Admin !</span>
        </div>
      )}

      {/* HEADER PREMIUM */}
      <div className="bg-[#052E16] pt-12 pb-16 px-6 rounded-b-[3.5rem] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-2xl shadow-lg shadow-emerald-500/40">
              <Leaf className="text-white" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-black tracking-tighter italic leading-none">GREEN CAMPUS</h1>
              <p className="text-emerald-400 text-[10px] font-bold tracking-widest mt-1 uppercase">Challenge RSE</p>
            </div>
          </div>
          <button className="bg-white/10 p-2 rounded-full text-white"><Bell size={20}/></button>
        </div>

        {/* TIMBRE DU COMPTE À REBOURS */}
        <div className="mt-8 bg-white rounded-[2rem] p-6 shadow-2xl flex items-center justify-between border border-emerald-50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Flame size={32} className="text-orange-500" fill="currentColor" />
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">3</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Prochain Défi</p>
              <p className="text-xl font-black text-slate-800 tabular-nums">{timeLeft}</p>
            </div>
          </div>
          <div className="bg-emerald-50 px-4 py-2 rounded-2xl text-center">
            <p className="text-[9px] font-black text-emerald-600 uppercase">Ton Score</p>
            <p className="text-emerald-900 font-black text-lg leading-none">{calculateClassScore(selectedClass)}</p>
          </div>
        </div>
      </div>

      {/* ZONE DE CONTENU */}
      <div className="px-6 -mt-8 relative z-20">
        
        {/* --- ONGLET ACCUEIL --- */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">
                  {challenges[0].category}
                </span>
                <span className="text-orange-500 font-black text-xs flex items-center gap-1">
                  <Trophy size={14} /> +{challenges[0].points} pts
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight mb-3">{challenges[0].title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8">{challenges[0].desc}</p>
              
              <div className="space-y-5">
                <div className="flex gap-2">
                  <button onClick={() => setProofType('Photo')} className={`flex-1 flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${proofType === 'Photo' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                    <Camera size={20} className={proofType === 'Photo' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="text-[8px] font-bold mt-1 uppercase">Photo</span>
                  </button>
                  <button onClick={() => setProofType('Vidéo')} className={`flex-1 flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${proofType === 'Vidéo' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                    <Video size={20} className={proofType === 'Vidéo' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="text-[8px] font-bold mt-1 uppercase">Vidéo</span>
                  </button>
                  <button onClick={() => setProofType('Screen')} className={`flex-1 flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${proofType === 'Screen' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100'}`}>
                    <Smartphone size={20} className={proofType === 'Screen' ? 'text-emerald-600' : 'text-slate-400'} />
                    <span className="text-[8px] font-bold mt-1 uppercase">Screen</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Prénom & Nom" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold placeholder:text-slate-300"
                  />
                  <select 
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold text-slate-600 appearance-none"
                  >
                    <option>Bachelor 1</option><option>Bachelor 2</option><option>Bachelor 3</option><option>Mastère 1</option><option>Mastère 2</option>
                  </select>
                </div>

                <button 
                  onClick={handleSendProof}
                  className="w-full bg-[#052E16] text-white py-5 rounded-[1.5rem] font-black shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                  VALIDER LE DÉFI <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* SECTION "POURQUOI CE DÉFI ?" */}
            <div className="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100 flex gap-4">
               <div className="bg-white p-3 rounded-2xl h-fit"><Sparkles className="text-emerald-500" size={20}/></div>
               <div>
                 <p className="text-[10px] font-black text-emerald-800 uppercase">Impact RSE</p>
                 <p className="text-xs text-emerald-700 leading-relaxed mt-1">
                   Réduire le plastique au campus permet d'économiser environ 12kg de déchets par étudiant par an.
                 </p>
               </div>
            </div>
          </div>
        )}

        {/* --- ONGLET MUR --- */}
        {activeTab === 'proofs' && (
          <div className="space-y-5 animate-in slide-in-from-right-10 duration-300">
             <div className="flex justify-between items-end">
               <h3 className="text-xl font-black text-slate-800">Fil d'actualité</h3>
               <p className="text-[10px] font-bold text-slate-400 uppercase">{proofs.filter(p => p.status === 'approved').length} Validations</p>
             </div>
             {proofs.filter(p => p.status === 'approved').map(p => (
               <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-50">
                 <div className="p-4 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-emerald-900 rounded-full flex items-center justify-center text-white font-black text-xs">{p.user.charAt(0)}</div>
                     <div>
                       <p className="text-sm font-black">{p.user}</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase">{p.class} • {p.timestamp}</p>
                     </div>
                   </div>
                   <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"><CheckCircle2 size={16}/></div>
                 </div>
                 <img src={p.image} className="w-full h-52 object-cover" alt="preuve" />
                 <div className="p-4 bg-slate-50 flex justify-between items-center">
                    <p className="text-xs font-bold text-slate-600">{p.challengeTitle}</p>
                    <div className="flex items-center gap-1 text-orange-500 font-black text-xs">+{p.points} <Trophy size={12}/></div>
                 </div>
               </div>
             ))}
          </div>
        )}

        {/* --- ONGLET CLASSEMENT --- */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6 animate-in fade-in duration-300">
             <div className="bg-white rounded-[2.5rem] p-6 shadow-xl">
               <div className="flex bg-slate-100 p-1 rounded-2xl mb-8">
                 <button className="flex-1 bg-white py-3 rounded-xl text-xs font-black shadow-sm">INDIVIDUEL</button>
                 <button className="flex-1 py-3 rounded-xl text-xs font-black text-slate-400 flex items-center justify-center gap-2"><BarChart3 size={14}/> CLASSES</button>
               </div>
               
               <div className="space-y-5">
                 {/* Top 3 Stylisé */}
                 {[
                   { rank: 1, name: "Calvin Neves", pts: 450, color: "text-yellow-500" },
                   { rank: 2, name: "Julie Castet", pts: 380, color: "text-slate-400" },
                   { rank: 3, name: "Thomas Durand", pts: 310, color: "text-orange-400" }
                 ].map(u => (
                   <div key={u.rank} className="flex items-center gap-4 p-4 bg-slate-50 rounded-3xl border border-slate-100">
                     <span className={`text-lg font-black ${u.color}`}>0{u.rank}</span>
                     <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-emerald-100 font-black text-xs">{u.name.charAt(0)}</div>
                     <div className="flex-1 font-black text-sm">{u.name}</div>
                     <div className="text-right">
                       <p className="text-xs font-black">{u.pts}</p>
                       <p className="text-[8px] font-bold text-slate-400 uppercase">Points</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        )}

        {/* --- ONGLET ADMIN --- */}
        {activeTab === 'admin' && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            {!isAdmin ? (
              <div className="bg-white rounded-[2.5rem] p-10 shadow-xl text-center border-2 border-emerald-900/5">
                <div className="bg-emerald-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-white shadow-2xl mb-6 -rotate-6">
                  <ShieldCheck size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Accès Éditeur</h3>
                <p className="text-slate-400 text-sm mb-8">Espace réservé à la direction pour la gestion des défis.</p>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Code de sécurité"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-center font-black mb-4 focus:border-emerald-500 outline-none transition-all"
                />
                <button 
                  onClick={() => password === 'carragrillon' ? setIsAdmin(true) : alert("Accès refusé.")}
                  className="w-full bg-emerald-900 text-white py-5 rounded-2xl font-black shadow-xl"
                >DÉVERROUILLER</button>
              </div>
            ) : (
              <div className="space-y-6 pb-20">
                {/* GESTION DÉFI */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-emerald-100">
                  <h4 className="font-black text-emerald-900 mb-4 flex items-center gap-2"><LayoutDashboard size={18}/> DÉFI ACTIF</h4>
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      value={challenges[0].title}
                      onChange={(e) => setChallenges([{ ...challenges[0], title: e.target.value }, challenges[1]])}
                      className="w-full bg-slate-50 p-4 rounded-xl font-bold text-sm border-2 border-transparent focus:border-emerald-500 outline-none"
                    />
                    <textarea 
                      value={challenges[0].desc}
                      onChange={(e) => setChallenges([{ ...challenges[0], desc: e.target.value }, challenges[1]])}
                      className="w-full bg-slate-50 p-4 rounded-xl font-medium text-xs border-2 border-transparent focus:border-emerald-500 outline-none h-24"
                    />
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Points</label>
                        <input type="number" value={challenges[0].points} className="w-full bg-slate-50 p-3 rounded-xl font-black text-sm" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-slate-400 uppercase ml-2">Catégorie</label>
                        <input type="text" value={challenges[0].category} className="w-full bg-slate-50 p-3 rounded-xl font-black text-sm" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* MODÉRATION DES PREUVES */}
                <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100">
                  <h4 className="font-black text-slate-800 mb-4">🔔 MODÉRATION ({proofs.filter(p => p.status === 'pending').length})</h4>
                  <div className="space-y-4">
                    {proofs.filter(p => p.status === 'pending').map(p => (
                      <div key={p.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                         <div className="flex justify-between items-start mb-3">
                           <div>
                             <p className="font-black text-sm">{p.user}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase">{p.class} • {p.type}</p>
                           </div>
                           <button onClick={() => setProofs(proofs.filter(x => x.id !== p.id))} className="text-red-400"><Trash2 size={16}/></button>
                         </div>
                         <img src={p.image} className="w-full h-32 object-cover rounded-xl mb-3" />
                         <div className="flex gap-2">
                           <button 
                            onClick={() => setProofs(proofs.map(x => x.id === p.id ? { ...x, status: 'approved' } : x))}
                            className="flex-1 bg-emerald-500 text-white py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-emerald-500/20"
                           >Approuver</button>
                           <button 
                            onClick={() => setProofs(proofs.map(x => x.id === p.id ? { ...x, status: 'rejected' } : x))}
                            className="flex-1 bg-white text-slate-400 border border-slate-200 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter"
                           >Refuser</button>
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsAdmin(false)} className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest py-10">Déconnexion Admin</button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRE DE NAVIGATION IOS STYLE */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center px-4 pt-4 pb-10 z-[100] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'home' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'home' ? 'bg-emerald-100 scale-110' : ''} p-2.5 rounded-2xl transition-all duration-300`}>
            <Flame size={24} fill={activeTab === 'home' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Défi</span>
        </button>
        <button onClick={() => setActiveTab('proofs')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'proofs' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'proofs' ? 'bg-emerald-100 scale-110' : ''} p-2.5 rounded-2xl transition-all duration-300`}>
            <LayoutDashboard size={24} fill={activeTab === 'proofs' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Le Mur</span>
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'leaderboard' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'leaderboard' ? 'bg-emerald-100 scale-110' : ''} p-2.5 rounded-2xl transition-all duration-300`}>
            <Trophy size={24} fill={activeTab === 'leaderboard' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Top</span>
        </button>
        <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'admin' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'admin' ? 'bg-emerald-100 scale-110' : ''} p-2.5 rounded-2xl transition-all duration-300`}>
            <ShieldCheck size={24} fill={activeTab === 'admin' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter">Éditeur</span>
        </button>
      </nav>

    </div>
  );
}
