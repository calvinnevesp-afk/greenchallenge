import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, Trophy, ShieldCheck, Camera, Send, Clock, CheckCircle2, 
  XCircle, LayoutDashboard, Flame, Sparkles, Plus, Trash2, 
  BarChart3, Bell, Image as ImageIcon, Video, Smartphone,
  ChevronRight, Gift, Star, Target, Info, Settings, LogOut, 
  UserPlus, Upload, ShieldAlert, Edit3, Save, X
} from 'lucide-react';

// --- TYPES ---
interface User { name: string; className: string; points: number; streak: number; isAdmin: boolean; }
interface Challenge { id: number; title: string; desc: string; category: string; points: number; difficulty: string; }
interface Proof { id: string; user: string; className: string; challengeTitle: string; status: 'pending' | 'approved' | 'rejected'; timestamp: string; fileUrl: string; fileType: string; }
interface Reward { id: number; title: string; cost: number; stock: number; }

export default function App() {
  // --- ÉTATS D'AUTHENTIFICATION ---
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authStep, setAuthStep] = useState<'login' | 'register'>('login');
  const [regName, setRegName] = useState('');
  const [regClass, setRegClass] = useState('Bachelor 1');

  // --- ÉTATS DE L'APPLICATION ---
  const [activeTab, setActiveTab] = useState('home');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  
  // --- DONNÉES RÉELLES (Vides au début pour ne rien inventer) ---
  const [challenges, setChallenges] = useState<Challenge[]>([
    { id: 1, title: "Gourde Réutilisable", desc: "Prends une photo de ta gourde aujourd'hui au campus.", category: "ÉCOLOGIE", points: 40, difficulty: "Facile" }
  ]);
  const [proofs, setProofs] = useState<Proof[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([
    { id: 1, title: "Café Offert", cost: 100, stock: 50 }
  ]);
  
  // --- ÉTATS FORMULAIRE PREUVE ---
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- ÉTATS ÉDITION ADMIN ---
  const [editingReward, setEditingReward] = useState<Reward | null>(null);

  // --- LOGIQUE COMPTE À REBOURS ---
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

  // --- ACTIONS AUTH ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName) return alert("Nom requis");
    const newUser: User = { name: regName, className: regClass, points: 0, streak: 1, isAdmin: false };
    setCurrentUser(newUser);
  };

  // --- ACTIONS PREUVES ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const submitProof = () => {
    if (!currentUser || !selectedFile) return alert("Choisis un fichier !");
    
    const newProof: Proof = {
      id: Math.random().toString(36).substr(2, 9),
      user: currentUser.name,
      className: currentUser.className,
      challengeTitle: challenges[0].title,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2h-digit', minute: '2h-digit' }),
      fileUrl: previewUrl || '',
      fileType: selectedFile.type.startsWith('video') ? 'Vidéo' : 'Photo'
    };

    setProofs([newProof, ...proofs]);
    setSelectedFile(null);
    setPreviewUrl(null);
    alert("Preuve envoyée à l'administrateur !");
  };

  // --- ACTIONS ADMIN ---
  const validateProof = (id: string, approve: boolean) => {
    setProofs(prev => prev.map(p => {
      if (p.id === id) {
        if (approve && currentUser && p.user === currentUser.name) {
          setCurrentUser({ ...currentUser, points: currentUser.points + challenges[0].points });
        }
        return { ...p, status: approve ? 'approved' : 'rejected' };
      }
      return p;
    }));
  };

  const addReward = () => {
    const newR = { id: Date.now(), title: "Nouvelle Récompense", cost: 100, stock: 10 };
    setRewards([...rewards, newR]);
  };

  const updateReward = (id: number, fields: Partial<Reward>) => {
    setRewards(rewards.map(r => r.id === id ? { ...r, ...fields } : r));
  };

  // --- CALCULS CLASSEMENT ---
  const leaderboard = proofs
    .filter(p => p.status === 'approved')
    .reduce((acc: any[], curr) => {
      const existing = acc.find(u => u.name === curr.user);
      if (existing) existing.pts += challenges[0].points;
      else acc.push({ name: curr.user, pts: challenges[0].points, class: curr.className });
      return acc.sort((a, b) => b.pts - a.pts);
    }, []);

  // --- ÉCRAN DE CONNEXION / CRÉATION ---
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#042F1A] flex items-center justify-center p-6 font-sans text-white">
        <div className="w-full space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="text-center">
            <div className="bg-emerald-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3">
              <Leaf size={40} fill="currentColor" />
            </div>
            <h1 className="text-3xl font-black tracking-tighter italic">GREEN CAMPUS</h1>
            <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest mt-2">Crée ton compte pour participer</p>
          </div>

          <form onSubmit={handleRegister} className="bg-white rounded-[2.5rem] p-8 space-y-5 text-slate-800 shadow-2xl">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Nom & Prénom</label>
              <input 
                required type="text" value={regName} onChange={(e) => setRegName(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 font-bold outline-none transition-all"
                placeholder="Ex: Calvin Neves"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2 tracking-widest">Ta Classe</label>
              <select 
                value={regClass} onChange={(e) => setRegClass(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-emerald-500 rounded-2xl p-4 font-bold outline-none appearance-none"
              >
                <option>Bachelor 1</option><option>Bachelor 2</option><option>Bachelor 3</option><option>Mastère 1</option><option>Mastère 2</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black shadow-xl shadow-emerald-900/20 active:scale-95 transition-all flex items-center justify-center gap-3">
              <UserPlus size={20} /> COMMENCER L'AVENTURE
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#FDFDFD] pb-28 font-sans text-slate-900 shadow-2xl relative overflow-x-hidden">
      
      {/* HEADER AVEC INFOS RÉELLES DU COMPTE */}
      <header className="bg-[#042F1A] pt-12 pb-20 px-6 rounded-b-[3.5rem] relative">
        <div className="relative z-10 flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2.5 rounded-2xl shadow-lg shadow-emerald-500/30">
              <Leaf className="text-white" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-white text-xl font-black italic tracking-tighter leading-none">{currentUser.name}</h1>
              <p className="text-emerald-400 text-[9px] font-black tracking-widest mt-1 uppercase italic">{currentUser.className}</p>
            </div>
          </div>
          <button onClick={() => window.location.reload()} className="bg-white/10 p-2.5 rounded-xl text-white"><LogOut size={18}/></button>
        </div>

        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex items-center gap-4">
             <div className="bg-orange-500 p-2 rounded-xl text-white"><Flame size={20} fill="currentColor"/></div>
             <div>
               <p className="text-[8px] font-black text-white/50 uppercase">Série</p>
               <p className="text-white font-black">{currentUser.streak} Jours</p>
             </div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/10 p-4 rounded-3xl flex items-center gap-4">
             <div className="bg-yellow-400 p-2 rounded-xl text-white"><Star size={20} fill="currentColor"/></div>
             <div>
               <p className="text-[8px] font-black text-white/50 uppercase">Points</p>
               <p className="text-white font-black">{currentUser.points} pts</p>
             </div>
          </div>
        </div>
      </header>

      {/* CONTENU DES ONGLETS */}
      <main className="px-6 -mt-10 relative z-20">
        
        {/* --- DÉFI ACTUEL (HOME) --- */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-slate-50">
              <div className="flex justify-between items-center mb-6">
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">{challenges[0].category}</span>
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock size={14} />
                  <span className="text-[10px] font-black tabular-nums">{timeLeft}</span>
                </div>
              </div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight mb-2 italic uppercase">{challenges[0].title}</h2>
              <p className="text-slate-500 text-sm mb-8">{challenges[0].desc}</p>
              
              <div className="space-y-4">
                {/* VRAI INPUT FICHIER */}
                <input 
                  type="file" accept="image/*,video/*" 
                  ref={fileInputRef} className="hidden" 
                  onChange={handleFileChange}
                />
                
                {!previewUrl ? (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2rem] p-10 flex flex-col items-center gap-3 group hover:border-emerald-500 transition-all"
                  >
                    <Upload className="text-slate-300 group-hover:text-emerald-500 transition-colors" size={32} />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Déposer photo / vidéo / screen</p>
                  </button>
                ) : (
                  <div className="relative rounded-[2rem] overflow-hidden shadow-xl">
                    <img src={previewUrl} className="w-full h-48 object-cover" alt="Preview" />
                    <button onClick={() => {setSelectedFile(null); setPreviewUrl(null);}} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"><X size={16}/></button>
                  </div>
                )}

                <button 
                  onClick={submitProof}
                  disabled={!selectedFile}
                  className={`w-full py-5 rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 transition-all ${selectedFile ? 'bg-[#042F1A] text-white' : 'bg-slate-100 text-slate-300'}`}
                >
                  <Send size={18} /> ENVOYER LA PREUVE (+{challenges[0].points} pts)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- LE MUR (FIL D'ACTU) --- */}
        {activeTab === 'proofs' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter px-2">FIL D'ACTUALITÉ</h2>
            {proofs.filter(p => p.status === 'approved').length === 0 && (
              <div className="bg-white p-12 rounded-[3rem] text-center border border-dashed border-slate-200">
                <p className="text-slate-400 text-xs font-bold uppercase italic">Aucune preuve publiée pour le moment.</p>
              </div>
            )}
            {proofs.filter(p => p.status === 'approved').map(p => (
              <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-50 animate-in slide-in-from-bottom-4">
                <div className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-900 rounded-2xl flex items-center justify-center text-white font-black text-xs italic">{p.user.charAt(0)}</div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">{p.user}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{p.className} • {p.timestamp}</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl"><CheckCircle2 size={16}/></div>
                </div>
                <img src={p.fileUrl} className="w-full h-56 object-cover" />
                <div className="p-4 bg-slate-50 flex justify-between items-center">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">{p.challengeTitle}</p>
                  <span className="text-emerald-700 font-black text-xs">+{challenges[0].points} PTS</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- CLASSEMENT (VRAI) --- */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter px-2">TOP LEADERS</h2>
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl">
              {leaderboard.length === 0 ? (
                <p className="text-center text-slate-300 text-xs font-black uppercase py-10">Le podium attend ses premiers champions</p>
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((u, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                      <span className="text-xl font-black italic text-emerald-600">0{i+1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-black">{u.name}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase">{u.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-emerald-900">{u.pts} pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- BOUTIQUE --- */}
        {activeTab === 'shop' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic tracking-tighter px-2 text-slate-800">GREEN SHOP</h2>
            <div className="grid grid-cols-2 gap-4 pb-20">
              {rewards.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[2.5rem] shadow-lg border border-slate-50 text-center relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white p-2 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <Gift size={14} />
                  </div>
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4"><Coffee size={24} className="text-slate-800"/></div>
                  <h4 className="font-black text-xs text-slate-800 mb-1">{item.title}</h4>
                  <p className="text-[10px] font-black text-emerald-600 mb-4 uppercase">{item.cost} points</p>
                  <button className="w-full bg-slate-900 text-white py-3 rounded-xl text-[9px] font-black uppercase tracking-widest active:scale-95 transition-all">Échanger</button>
                  <p className="text-[8px] font-bold text-slate-300 mt-3 uppercase tracking-tighter">Stock: {item.stock}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MODE ADMIN (TOTAL) --- */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            {!isAdminMode ? (
              <div className="bg-white rounded-[3rem] p-10 shadow-2xl text-center">
                <ShieldAlert size={48} className="text-emerald-900 mx-auto mb-6" />
                <h3 className="text-xl font-black italic mb-2">ZONE ÉDITEUR</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase mb-8">Réservé à la direction</p>
                <input 
                  type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 p-5 rounded-2xl font-black text-center mb-4 border-2 border-transparent focus:border-emerald-500 outline-none transition-all"
                  placeholder="CODE SECRET"
                />
                <button onClick={() => adminPassword === 'carragrillon' ? setIsAdminMode(true) : alert("Code incorrect")} className="w-full bg-emerald-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Accéder</button>
              </div>
            ) : (
              <div className="space-y-8 pb-32 animate-in slide-in-from-right-10 duration-500">
                <div className="flex justify-between items-center px-2">
                  <h3 className="font-black text-xl italic tracking-tighter">ADMIN PANEL</h3>
                  <button onClick={() => setIsAdminMode(false)} className="text-red-500 font-black text-[10px] uppercase">Quitter</button>
                </div>

                {/* MODIFIER LE DÉFI */}
                <div className="bg-slate-900 text-white p-8 rounded-[3rem] shadow-xl">
                  <div className="flex items-center gap-2 mb-6 text-emerald-400">
                    <Edit3 size={18}/>
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Éditer le Défi Actif</h4>
                  </div>
                  <div className="space-y-4">
                    <input 
                      type="text" value={challenges[0].title} 
                      onChange={(e) => setChallenges([{...challenges[0], title: e.target.value}])}
                      className="w-full bg-white/10 border border-white/10 p-4 rounded-xl font-black text-sm outline-none focus:border-emerald-500"
                    />
                    <textarea 
                      value={challenges[0].desc} 
                      onChange={(e) => setChallenges([{...challenges[0], desc: e.target.value}])}
                      className="w-full bg-white/10 border border-white/10 p-4 rounded-xl text-xs font-medium h-24 outline-none focus:border-emerald-500"
                    />
                    <div className="flex gap-4">
                       <input type="number" value={challenges[0].points} className="w-20 bg-white/10 p-4 rounded-xl font-black text-sm" />
                       <span className="text-[10px] font-bold text-white/40 flex items-center italic">Points pour ce défi</span>
                    </div>
                  </div>
                </div>

                {/* MODIFIER LES RÉCOMPENSES */}
                <div className="bg-white p-8 rounded-[3rem] shadow-lg border border-slate-100">
                   <div className="flex justify-between items-center mb-6">
                     <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest flex items-center gap-2"><Gift size={16} className="text-emerald-500"/> Boutique</h4>
                     <button onClick={addReward} className="bg-emerald-100 text-emerald-700 p-2 rounded-xl"><Plus size={18}/></button>
                   </div>
                   <div className="space-y-4">
                     {rewards.map(r => (
                       <div key={r.id} className="bg-slate-50 p-4 rounded-2xl flex flex-col gap-3">
                         <input 
                          type="text" value={r.title} 
                          onChange={(e) => updateReward(r.id, { title: e.target.value })}
                          className="bg-transparent font-black text-sm outline-none border-b border-transparent focus:border-emerald-500"
                         />
                         <div className="flex gap-4">
                           <div className="flex-1 bg-white p-2 rounded-xl border border-slate-200">
                             <p className="text-[8px] font-black text-slate-300 uppercase">Prix (pts)</p>
                             <input type="number" value={r.cost} onChange={(e) => updateReward(r.id, { cost: parseInt(e.target.value) })} className="w-full font-black text-xs outline-none" />
                           </div>
                           <div className="flex-1 bg-white p-2 rounded-xl border border-slate-200">
                             <p className="text-[8px] font-black text-slate-300 uppercase">Stock</p>
                             <input type="number" value={r.stock} onChange={(e) => updateReward(r.id, { stock: parseInt(e.target.value) })} className="w-full font-black text-xs outline-none" />
                           </div>
                           <button onClick={() => setRewards(rewards.filter(x => x.id !== r.id))} className="bg-red-50 text-red-500 p-3 rounded-xl"><Trash2 size={16}/></button>
                         </div>
                       </div>
                     ))}
                   </div>
                </div>

                {/* MODÉRATION DES PREUVES */}
                <div className="space-y-4">
                  <h4 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2">Preuves en attente ({proofs.filter(p => p.status === 'pending').length})</h4>
                  {proofs.filter(p => p.status === 'pending').map(p => (
                    <div key={p.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-xl">
                       <div className="flex justify-between items-center mb-4">
                         <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-xs italic">{p.user.charAt(0)}</div>
                           <div>
                             <p className="text-xs font-black">{p.user}</p>
                             <p className="text-[8px] font-bold text-slate-400 uppercase">{p.className}</p>
                           </div>
                         </div>
                         <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[8px] font-black">{p.fileType}</span>
                       </div>
                       <img src={p.fileUrl} className="w-full h-40 object-cover rounded-2xl mb-4" />
                       <div className="flex gap-2">
                         <button onClick={() => validateProof(p.id, true)} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase">Accepter</button>
                         <button onClick={() => validateProof(p.id, false)} className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase tracking-tighter">Refuser</button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* NAVIGATION BAS DE PAGE STYLE IOS */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center px-4 pt-4 pb-10 z-[100] rounded-t-[3rem] shadow-[0_-20px_50px_rgba(0,0,0,0.06)]">
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'home' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'home' ? 'bg-emerald-100' : ''} p-2.5 rounded-2xl transition-all`}>
            <Flame size={22} fill={activeTab === 'home' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter tracking-[0.1em]">Défis</span>
        </button>
        <button onClick={() => setActiveTab('proofs')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'proofs' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'proofs' ? 'bg-emerald-100' : ''} p-2.5 rounded-2xl transition-all`}>
            <LayoutDashboard size={22} fill={activeTab === 'proofs' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter tracking-[0.1em]">Mur</span>
        </button>
        <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'shop' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'shop' ? 'bg-emerald-100' : ''} p-2.5 rounded-2xl transition-all`}>
            <Gift size={22} fill={activeTab === 'shop' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter tracking-[0.1em]">Boutique</span>
        </button>
        <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'leaderboard' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'leaderboard' ? 'bg-emerald-100' : ''} p-2.5 rounded-2xl transition-all`}>
            <Trophy size={22} fill={activeTab === 'leaderboard' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter tracking-[0.1em]">Top</span>
        </button>
        <button onClick={() => setActiveTab('admin')} className={`flex flex-col items-center gap-1.5 flex-1 transition-all ${activeTab === 'admin' ? 'text-emerald-700' : 'text-slate-300'}`}>
          <div className={`${activeTab === 'admin' ? 'bg-emerald-100' : ''} p-2.5 rounded-2xl transition-all`}>
            <ShieldCheck size={22} fill={activeTab === 'admin' ? "currentColor" : "none"} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter tracking-[0.1em]">Éditeur</span>
        </button>
      </nav>

    </div>
  );
}
