import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, Trophy, ShieldCheck, Camera, Send, Clock, CheckCircle2, 
  XCircle, LayoutDashboard, Flame, Sparkles, Plus, Trash2, 
  BarChart3, Bell, Image as ImageIcon, Video, Smartphone,
  ChevronRight, Gift, Star, Target, Info, Settings, LogOut, 
  UserPlus, Upload, ShieldAlert, Edit3, Save, X, Eye
} from 'lucide-react';

// --- INTERFACES ---
interface User { name: string; className: string; points: number; streak: number; }
interface Challenge { id: number; title: string; desc: string; category: string; difficulty: string; image: string; }
interface Proof { 
  id: string; 
  user: string; 
  className: string; 
  challengeId: number; 
  status: 'pending' | 'approved' | 'rejected'; 
  timestamp: string; 
  fileData: string; // Stockage de l'image réelle
  earnedPoints: number;
}
interface Reward { id: number; title: string; cost: number; stock: number; icon: string; }

export default function App() {
  // --- ÉTATS PERSISTANTS (LocalStorage) ---
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('green_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [proofs, setProofs] = useState<Proof[]>(() => {
    const saved = localStorage.getItem('green_proofs');
    return saved ? JSON.parse(saved) : [];
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('green_challenges');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        title: "Gourde & Café Durable", 
        desc: "Aujourd'hui, zéro gobelet jetable. Prends ton mug ou ta gourde en photo devant la machine à café !", 
        category: "DÉCHETS", 
        difficulty: "Facile",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=1000"
      }
    ];
  });

  const [rewards, setRewards] = useState<Reward[]>(() => {
    const saved = localStorage.getItem('green_rewards');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: "Café Offert", cost: 100, stock: 50, icon: "☕" },
      { id: 2, title: "Gourde Inox Campus", cost: 500, stock: 12, icon: "💧" }
    ];
  });

  // --- ÉTATS UI ---
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [password, setPassword] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SAUVEGARDE AUTOMATIQUE ---
  useEffect(() => {
    localStorage.setItem('green_user', JSON.stringify(currentUser));
    localStorage.setItem('green_proofs', JSON.stringify(proofs));
    localStorage.setItem('green_challenges', JSON.stringify(challenges));
    localStorage.setItem('green_rewards', JSON.stringify(rewards));
  }, [currentUser, proofs, challenges, rewards]);

  // --- LOGIQUE DE POINTS (DÉGRESSIF) ---
  const calculatePoints = () => {
    // On compte combien de preuves ont déjà été envoyées pour ce défi
    const count = proofs.filter(p => p.challengeId === challenges[0].id).length;
    if (count === 0) return 100;
    if (count === 1) return 90;
    if (count === 2) return 80;
    if (count >= 3 && count < 10) return 60;
    return 40;
  };

  // --- GESTION DES FICHIERS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitProof = () => {
    if (!currentUser || !previewUrl) return;
    
    const newProof: Proof = {
      id: Math.random().toString(36).substr(2, 9),
      user: currentUser.name,
      className: currentUser.className,
      challengeId: challenges[0].id,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2h-digit', minute: '2h-digit' }),
      fileData: previewUrl,
      earnedPoints: calculatePoints()
    };

    setProofs([newProof, ...proofs]);
    setPreviewUrl(null);
    setActiveTab('proofs');
    alert(`Preuve envoyée ! Si validée, tu gagneras ${newProof.earnedPoints} pts !`);
  };

  // --- ACTIONS ADMIN ---
  const handleAdminAction = (proofId: string, action: 'approved' | 'rejected') => {
    const updatedProofs = proofs.map(p => {
      if (p.id === proofId) {
        if (action === 'approved' && p.status === 'pending') {
          // Si c'est l'utilisateur actuel, on met à jour ses points en direct
          if (currentUser && p.user === currentUser.name) {
            setCurrentUser({ ...currentUser, points: currentUser.points + p.earnedPoints });
          }
        }
        return { ...p, status: action };
      }
      return p;
    });
    setProofs(updatedProofs);
  };

  // --- CONNEXION ---
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#042F1A] flex items-center justify-center p-6 text-white font-sans">
        <div className="w-full space-y-8 animate-in fade-in zoom-in duration-700">
          <img src="https://images.unsplash.com/photo-1511497584788-8767fe771d85?auto=format&fit=crop&q=80&w=500" className="w-full h-48 object-cover rounded-[3rem] shadow-2xl rotate-2" alt="RSE" />
          <div className="text-center">
            <h1 className="text-4xl font-black italic tracking-tighter">GREEN PASS</h1>
            <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-2">Enregistre ton profil campus</p>
          </div>
          <div className="bg-white rounded-[2.5rem] p-8 space-y-4">
            <input id="regName" type="text" placeholder="Prénom Nom" className="w-full bg-slate-50 p-5 rounded-2xl text-slate-800 font-bold outline-none border-2 border-transparent focus:border-emerald-500" />
            <select id="regClass" className="w-full bg-slate-50 p-5 rounded-2xl text-slate-800 font-bold outline-none">
              <option>Bachelor 1</option><option>Bachelor 2</option><option>Bachelor 3</option><option>Mastère</option>
            </select>
            <button 
              onClick={() => {
                const n = (document.getElementById('regName') as HTMLInputElement).value;
                const c = (document.getElementById('regClass') as HTMLSelectElement).value;
                if(n) setCurrentUser({ name: n, className: c, points: 0, streak: 1 });
              }}
              className="w-full bg-emerald-600 py-5 rounded-2xl font-black text-white shadow-xl active:scale-95 transition-all"
            >CRÉER MON COMPTE</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900 shadow-2xl relative overflow-x-hidden">
      
      {/* --- TOP HEADER --- */}
      <header className="bg-[#042F1A] pt-12 pb-24 px-6 rounded-b-[4rem] relative shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=500" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10 flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-500 p-2.5 rounded-2xl rotate-3 shadow-lg"><Leaf className="text-white" size={22} fill="currentColor" /></div>
             <div>
               <h1 className="text-white font-black italic text-xl leading-none">{currentUser.name}</h1>
               <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1">{currentUser.className}</p>
             </div>
          </div>
          <button onClick={() => {localStorage.clear(); window.location.reload();}} className="bg-white/10 p-2.5 rounded-xl text-white backdrop-blur-md"><LogOut size={18}/></button>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] flex items-center gap-4 shadow-inner">
            <div className="bg-orange-500 p-2.5 rounded-xl text-white shadow-lg shadow-orange-500/30"><Flame size={20} fill="currentColor" /></div>
            <div>
              <p className="text-[8px] font-black text-white/50 uppercase">Score</p>
              <p className="text-white font-black text-lg leading-none">{currentUser.points} <span className="text-[10px] font-medium opacity-50">pts</span></p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-[2rem] flex items-center gap-4 shadow-inner">
            <div className="bg-emerald-400 p-2.5 rounded-xl text-[#042F1A] shadow-lg shadow-emerald-400/20"><Star size={20} fill="currentColor" /></div>
            <div>
              <p className="text-[8px] font-black text-white/50 uppercase">Rang</p>
              <p className="text-white font-black text-lg leading-none">#1</p>
            </div>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="px-6 -mt-12 relative z-20">
        
        {/* ONGLET 1 : DÉFIS */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6">
            <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-white relative overflow-hidden">
              <img src={challenges[0].image} className="absolute top-0 right-0 w-32 h-32 object-cover opacity-10 rounded-bl-[4rem]" />
              <div className="flex justify-between items-start mb-6">
                <span className="bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic tracking-tighter">Challenge du jour</span>
                <div className="flex items-center gap-2 text-orange-500">
                  <Trophy size={16} />
                  <span className="text-xs font-black">Jusqu'à 100 pts</span>
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase italic leading-tight">{challenges[0].title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-10">{challenges[0].desc}</p>
              
              <div className="space-y-4">
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                
                {!previewUrl ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-14 flex flex-col items-center gap-4 group hover:border-emerald-500 transition-all active:scale-95"
                  >
                    <div className="bg-white p-4 rounded-full shadow-lg text-slate-300 group-hover:text-emerald-500 transition-colors"><Camera size={32} /></div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Prendre en photo</p>
                  </button>
                ) : (
                  <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl ring-8 ring-slate-50">
                    <img src={previewUrl} className="w-full h-60 object-cover" alt="Preuve" />
                    <button onClick={() => setPreviewUrl(null)} className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-full shadow-xl"><X size={20}/></button>
                  </div>
                )}

                <button 
                  onClick={submitProof}
                  disabled={!previewUrl}
                  className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl transition-all ${previewUrl ? 'bg-[#042F1A] text-white' : 'bg-slate-100 text-slate-300'}`}
                >
                  <Send size={18} /> Valider ma preuve
                </button>
              </div>
            </div>

            <div className="bg-[#042F1A] p-8 rounded-[3rem] text-white flex items-center gap-6 shadow-xl">
               <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=200" className="w-20 h-20 rounded-2xl object-cover shadow-2xl" />
               <div>
                 <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Impact Campus</p>
                 <p className="text-xs font-bold leading-relaxed opacity-80 italic">Ton action évite l'utilisation de 150 gobelets plastique par an.</p>
               </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : LE MUR (PHOTOS VALIDÉES) */}
        {activeTab === 'proofs' && (
          <div className="space-y-6 animate-in slide-in-from-right-10">
            <h2 className="text-2xl font-black italic tracking-tighter px-2 flex items-center gap-3">
              MUR DES PREUVES <div className="bg-emerald-500 w-2 h-2 rounded-full animate-pulse"></div>
            </h2>
            <div className="columns-2 gap-4 space-y-4 pb-20">
              {proofs.filter(p => p.status === 'approved').length === 0 && (
                <div className="col-span-2 text-center py-20 opacity-30 italic font-bold">Le mur attend tes exploits...</div>
              )}
              {proofs.filter(p => p.status === 'approved').map(p => (
                <div key={p.id} className="break-inside-avoid bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                  <img src={p.fileData} className="w-full object-cover" />
                  <div className="p-3">
                    <p className="text-[10px] font-black text-slate-800 leading-none">{p.user}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">{p.className}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 3 : BOUTIQUE */}
        {activeTab === 'shop' && (
          <div className="space-y-6 pb-20 animate-in fade-in">
             <div className="bg-emerald-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                <Gift className="absolute -right-5 -bottom-5 w-40 h-40 opacity-10" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Ton solde actuel</p>
                <h2 className="text-5xl font-black italic tracking-tighter mt-2">{currentUser.points} <span className="text-lg font-normal opacity-50">pts</span></h2>
             </div>
             <div className="grid grid-cols-2 gap-4">
               {rewards.map(r => (
                 <div key={r.id} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-50 text-center flex flex-col items-center">
                    <div className="text-4xl mb-4 bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center shadow-inner">{r.icon}</div>
                    <h4 className="text-sm font-black text-slate-800">{r.title}</h4>
                    <p className="text-[10px] font-black text-emerald-600 mt-1 uppercase italic">{r.cost} points</p>
                    <button className="mt-4 w-full bg-slate-900 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Échanger</button>
                    <p className="text-[8px] mt-2 font-bold text-slate-300 uppercase">En stock: {r.stock}</p>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* --- ONGLET 4 : ADMIN --- */}
        {activeTab === 'admin' && (
          <div className="space-y-6 pb-32">
            {!isAdminMode ? (
              <div className="bg-white rounded-[3rem] p-10 shadow-2xl text-center border-2 border-emerald-900/5">
                <ShieldAlert size={48} className="text-emerald-900 mx-auto mb-6" />
                <h3 className="text-2xl font-black italic mb-2 tracking-tighter uppercase">Gestionnaire</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Interface réservée à l'Eklore Campus</p>
                <input type="password" placeholder="CODE SECRET" onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-50 p-5 rounded-2xl text-center font-black mb-4 border-2 border-transparent focus:border-emerald-500 outline-none transition-all" />
                <button onClick={() => password === 'carragrillon' ? setIsAdminMode(true) : alert("Accès refusé")} className="w-full bg-[#042F1A] text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl">Déverrouiller</button>
              </div>
            ) : (
              <div className="space-y-8 animate-in slide-in-from-right-10">
                <div className="flex justify-between items-center px-2">
                   <h3 className="font-black text-xl italic tracking-tighter">VALIDATION ({proofs.filter(p=>p.status==='pending').length})</h3>
                   <button onClick={() => setIsAdminMode(false)} className="bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase">Quitter</button>
                </div>

                <div className="space-y-4">
                  {proofs.filter(p => p.status === 'pending').map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-[2.5rem] shadow-2xl border border-slate-100 animate-in zoom-in-95">
                       <div className="flex items-center gap-4 mb-4">
                         <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center font-black italic">{p.user.charAt(0)}</div>
                         <div>
                           <p className="text-sm font-black">{p.user}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase">{p.className} • {p.timestamp}</p>
                         </div>
                       </div>
                       <img src={p.fileData} className="w-full h-56 object-cover rounded-3xl mb-5 shadow-inner" />
                       <div className="flex gap-3">
                         <button onClick={() => handleAdminAction(p.id, 'approved')} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black text-[11px] uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">APPROUVER (+{p.earnedPoints})</button>
                         <button onClick={() => handleAdminAction(p.id, 'rejected')} className="flex-1 bg-slate-100 text-slate-400 py-4 rounded-2xl font-black text-[11px] uppercase active:scale-95 transition-all">REFUSER</button>
                       </div>
                    </div>
                  ))}
                  {proofs.filter(p => p.status === 'pending').length === 0 && (
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-20 rounded-[3rem] text-center italic text-slate-300 font-bold uppercase text-[10px]">Tout est à jour !</div>
                  )}
                </div>

                {/* MODIFIER BOUTIQUE */}
                <div className="bg-white p-8 rounded-[3rem] shadow-xl">
                   <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2"><Settings size={16}/> ÉDITER LA BOUTIQUE</h4>
                   <div className="space-y-4">
                     {rewards.map(r => (
                       <div key={r.id} className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl">
                          <input type="text" value={r.title} onChange={(e) => {
                            const newR = rewards.map(x => x.id === r.id ? {...x, title: e.target.value} : x);
                            setRewards(newR);
                          }} className="flex-1 bg-transparent font-black text-xs outline-none" />
                          <input type="number" value={r.cost} onChange={(e) => {
                            const newR = rewards.map(x => x.id === r.id ? {...x, cost: parseInt(e.target.value)} : x);
                            setRewards(newR);
                          }} className="w-16 bg-white p-2 rounded-xl text-[10px] font-black outline-none border border-slate-100" />
                       </div>
                     ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* --- BOTTOM NAV STYLE IOS --- */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center px-4 pt-4 pb-10 z-[100] rounded-t-[3.5rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
        {[
          { id: 'home', icon: Flame, label: 'Défi' },
          { id: 'proofs', icon: LayoutDashboard, label: 'Mur' },
          { id: 'shop', icon: Gift, label: 'Shop' },
          { id: 'admin', icon: ShieldCheck, label: 'Admin' }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-2 flex-1 transition-all ${activeTab === item.id ? 'text-emerald-700' : 'text-slate-300'}`}>
            <div className={`p-3 rounded-2xl transition-all duration-500 ${activeTab === item.id ? 'bg-emerald-100 scale-110' : ''}`}>
              <item.icon size={22} fill={activeTab === item.id ? "currentColor" : "none"} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
