import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, Trophy, ShieldCheck, Camera, Send, Clock, CheckCircle2, 
  LayoutDashboard, Flame, Star, Gift, LogOut, 
  UserPlus, Upload, ShieldAlert, X, Coffee, TreePine, Globe, Recycle
} from 'lucide-react';

// --- INTERFACES ---
interface User { name: string; password: string; className: string; points: number; }
interface Proof { 
  id: string; 
  userName: string; 
  className: string; 
  status: 'pending' | 'approved' | 'rejected'; 
  timestamp: string; 
  fileData: string; 
  earnedPoints: number;
}

export default function App() {
  // --- ÉTATS PERSISTANTS ---
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('rse_users') || '[]'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('rse_session') || 'null'));
  const [proofs, setProofs] = useState<Proof[]>(() => JSON.parse(localStorage.getItem('rse_proofs') || '[]'));

  const [activeTab, setActiveTab] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SAUVEGARDE AUTO ---
  useEffect(() => {
    localStorage.setItem('rse_users', JSON.stringify(users));
    localStorage.setItem('rse_proofs', JSON.stringify(proofs));
    localStorage.setItem('rse_session', JSON.stringify(currentUser));
  }, [users, proofs, currentUser]);

  // --- LOGIQUE DE POINTS DÉGRESSIFS ---
  const getPotentialPoints = () => {
    const validCount = proofs.filter(p => p.status !== 'rejected').length;
    if (validCount === 0) return 100;
    if (validCount === 1) return 90;
    if (validCount === 2) return 80;
    if (validCount < 10) return 60;
    return 40;
  };

  // --- ACTIONS ---
  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const pass = fd.get('pass') as string;

    if (authMode === 'register') {
      const cls = fd.get('class') as string;
      if (users.find(u => u.name === name)) return alert("Nom déjà pris");
      const newUser = { name, password: pass, className: cls, points: 0 };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    } else {
      const user = users.find(u => u.name === name && u.password === pass);
      if (user) setCurrentUser(user); else alert("Erreur d'identifiants");
    }
  };

  const handleUpload = () => {
    if (!currentUser || !previewUrl) return;
    const newProof: Proof = {
      id: Math.random().toString(36).substr(2, 9),
      userName: currentUser.name,
      className: currentUser.className,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
      fileData: previewUrl,
      earnedPoints: getPotentialPoints()
    };
    setProofs([newProof, ...proofs]);
    setPreviewUrl(null);
    alert("Envoyé ! L'admin doit maintenant valider pour tes points.");
    setActiveTab('proofs');
  };

  const adminValidation = (id: string, ok: boolean) => {
    const updated = proofs.map(p => {
      if (p.id === id) {
        if (ok) {
          setUsers(prev => prev.map(u => u.name === p.userName ? { ...u, points: u.points + p.earnedPoints } : u));
          if (currentUser?.name === p.userName) {
            setCurrentUser(prev => prev ? { ...prev, points: prev.points + p.earnedPoints } : null);
          }
        }
        return { ...p, status: ok ? 'approved' : 'rejected' } as Proof;
      }
      return p;
    });
    setProofs(updated);
  };

  // --- VUE CONNEXION ---
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#042F1A] flex items-center justify-center p-6 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1550147760-44c9966d6bc7?q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="w-full bg-white/95 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl relative z-10">
          <div className="text-center mb-8">
            <div className="bg-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"><Globe className="text-white" size={32} /></div>
            <h1 className="text-2xl font-black text-emerald-950 uppercase italic">Eklore Challenge</h1>
            <p className="text-emerald-700 text-[10px] font-black tracking-widest uppercase">Mission RSE 2026</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input name="name" required placeholder="Identifiant" className="w-full bg-emerald-50/50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-600" />
            <input name="pass" type="password" required placeholder="Mot de passe" className="w-full bg-emerald-50/50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-600" />
            {authMode === 'register' && (
              <select name="class" className="w-full bg-emerald-50/50 p-5 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-emerald-600">
                <option>Bachelor 1</option><option>Bachelor 2</option><option>Mastère</option>
              </select>
            )}
            <button className="w-full bg-emerald-700 text-white py-5 rounded-2xl font-black shadow-xl uppercase text-xs tracking-widest">{authMode === 'register' ? 'Créer mon compte' : 'Se connecter'}</button>
          </form>
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full mt-6 text-emerald-900 text-[10px] font-black uppercase underline tracking-tighter">
            {authMode === 'login' ? "Nouveau ici ? S'inscrire" : "Déjà inscrit ? Connexion"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F0F4F2] pb-32 font-sans text-slate-900 shadow-2xl relative">
      
      {/* HEADER AVEC PHOTO RSE */}
      <header className="bg-emerald-950 pt-12 pb-24 px-6 rounded-b-[4rem] text-white relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1473081556163-2a17de81fc97?q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="relative z-10 flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
             <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/40"><TreePine size={20} /></div>
             <div>
               <h2 className="font-black italic text-lg leading-none">{currentUser.name}</h2>
               <p className="text-emerald-400 text-[9px] font-black uppercase tracking-widest mt-1">{currentUser.className}</p>
             </div>
          </div>
          <button onClick={() => {setCurrentUser(null); localStorage.removeItem('rse_session');}} className="bg-white/10 p-2 rounded-xl backdrop-blur-md"><LogOut size={18}/></button>
        </div>
        <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2.5rem] flex justify-around">
           <div className="text-center">
             <p className="text-[10px] font-black opacity-60 uppercase mb-1">Tes Points</p>
             <div className="flex items-center gap-2 text-2xl font-black text-emerald-400"><Star fill="currentColor" size={20}/> {currentUser.points}</div>
           </div>
           <div className="w-px bg-white/20 h-10 self-center"></div>
           <div className="text-center">
             <p className="text-[10px] font-black opacity-60 uppercase mb-1">Rang</p>
             <div className="flex items-center gap-2 text-2xl font-black text-white"><Trophy size={20}/> #1</div>
           </div>
        </div>
      </header>

      <main className="px-6 -mt-10 relative z-20">
        
        {/* ONGLET DEFI */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-6">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-white relative overflow-hidden">
              <div className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase italic mb-6 inline-flex items-center gap-2 shadow-lg">
                <Flame size={14} fill="currentColor" /> Défi du Jour
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter text-slate-800 leading-none mb-3">OPÉRATION ZÉRO GOBELET</h3>
              <p className="text-slate-500 text-sm font-medium mb-10">Évite le plastique ! Prends ta gourde ou ton mug en photo sur le campus pour valider ce défi.</p>
              
              <input type="file" ref={fileInputRef} onChange={(e) => {
                const f = e.target.files?.[0];
                if(f) { const r = new FileReader(); r.onloadend = () => setPreviewUrl(r.result as string); r.readAsDataURL(f); }
              }} accept="image/*" className="hidden" />
              
              {!previewUrl ? (
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-[2.5rem] py-16 flex flex-col items-center gap-4 group transition-all">
                   <div className="bg-white p-4 rounded-full shadow-lg text-emerald-600 group-hover:scale-110 transition-transform"><Camera size={32}/></div>
                   <p className="text-[10px] font-black text-emerald-800 uppercase tracking-widest">Prendre ma preuve</p>
                </button>
              ) : (
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <img src={previewUrl} className="w-full h-72 object-cover" />
                  <button onClick={() => setPreviewUrl(null)} className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg"><X size={20}/></button>
                </div>
              )}

              <button onClick={handleUpload} disabled={!previewUrl} className={`w-full py-6 rounded-[2rem] mt-6 font-black shadow-2xl flex items-center justify-center gap-3 transition-all ${previewUrl ? 'bg-emerald-950 text-white' : 'bg-slate-100 text-slate-300'}`}>
                <Send size={18}/> ENVOYER À L'ADMIN
              </button>
            </div>
            <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000" className="w-full h-32 object-cover rounded-[2.5rem] shadow-xl grayscale hover:grayscale-0 transition-all cursor-pointer" />
          </div>
        )}

        {/* ONGLET MUR (UNIQUEMENT APPROUVÉES) */}
        {activeTab === 'proofs' && (
          <div className="space-y-6">
            <h3 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
              MUR DES ACTIONS <Recycle className="text-emerald-600" size={24}/>
            </h3>
            <div className="grid grid-cols-2 gap-4 pb-20">
              {proofs.filter(p => p.status === 'approved').length === 0 && (
                <div className="col-span-2 bg-white/50 border-2 border-dashed border-slate-200 p-16 rounded-[3rem] text-center italic text-slate-400 font-bold uppercase text-[10px]">
                  Aucune action validée pour le moment.
                </div>
              )}
              {proofs.filter(p => p.status === 'approved').map(p => (
                <div key={p.id} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-white animate-in zoom-in-90">
                  <img src={p.fileData} className="w-full h-44 object-cover" />
                  <div className="p-4 bg-emerald-50/50">
                    <p className="font-black text-[10px] text-emerald-900">{p.userName}</p>
                    <div className="flex justify-between items-center mt-1">
                       <p className="text-[8px] font-bold text-slate-400 uppercase">{p.className}</p>
                       <span className="text-emerald-700 font-black text-[10px]">+{p.earnedPoints}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-6 pb-20">
            <div className="bg-white rounded-[3rem] p-8 shadow-2xl border border-emerald-900/5">
              <div className="flex items-center gap-4 mb-8">
                <ShieldAlert className="text-emerald-900" size={32} />
                <h3 className="text-xl font-black italic uppercase">Modération Preuves</h3>
              </div>
              
              <div className="space-y-6">
                {proofs.filter(p => p.status === 'pending').map(p => (
                  <div key={p.id} className="bg-slate-50 p-4 rounded-[2rem] border border-slate-100 animate-in fade-in">
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 bg-emerald-900 rounded-xl flex items-center justify-center font-black italic text-white">{p.userName.charAt(0)}</div>
                       <div><p className="text-xs font-black">{p.userName}</p><p className="text-[8px] font-bold text-slate-400 uppercase">{p.className}</p></div>
                    </div>
                    <img src={p.fileData} className="w-full h-64 object-cover rounded-2xl mb-4 shadow-inner" />
                    <div className="flex gap-3">
                       <button onClick={() => adminValidation(p.id, true)} className="flex-1 bg-emerald-600 text-white py-4 rounded-xl font-black text-[10px] uppercase shadow-lg shadow-emerald-200">APPROUVER (+{p.earnedPoints})</button>
                       <button onClick={() => adminValidation(p.id, false)} className="flex-1 bg-white text-red-500 py-4 rounded-xl font-black text-[10px] uppercase border border-red-100">REFUSER</button>
                    </div>
                  </div>
                ))}
                {proofs.filter(p => p.status === 'pending').length === 0 && (
                  <p className="text-center italic font-bold text-slate-300 py-20 uppercase text-[10px]">Toutes les preuves sont traitées</p>
                )}
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000" className="w-full h-40 object-cover rounded-[3rem] opacity-50 shadow-inner" />
          </div>
        )}

      </main>

      {/* BARRE DE NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center px-4 pt-4 pb-10 z-[100] rounded-t-[3.5rem] shadow-[0_-15px_50px_rgba(0,0,0,0.1)]">
        {[
          { id: 'home', icon: Flame, label: 'Défi' },
          { id: 'proofs', icon: LayoutDashboard, label: 'Le Mur' },
          { id: 'shop', icon: Gift, label: 'Boutique' },
          { id: 'admin', icon: ShieldCheck, label: 'Admin' }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-2 flex-1 transition-all ${activeTab === item.id ? 'text-emerald-800' : 'text-slate-300'}`}>
            <div className={`p-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-100 scale-110 shadow-inner' : ''}`}>
              <item.icon size={22} fill={activeTab === item.id ? "currentColor" : "none"} />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
