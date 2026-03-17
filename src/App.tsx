import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, Trophy, ShieldCheck, Camera, Send, LayoutDashboard, 
  Flame, Star, Gift, LogOut, ShieldAlert, X, Globe, TreePine, 
  Recycle, HardHat, CheckCircle, Bell
} from 'lucide-react';

// --- TYPES & INTERFACES ---
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
  // --- ÉTATS PERSISTANTS (MÉMOIRE DU NAVIGATEUR) ---
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('eklore_db_users') || '[]'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('eklore_session') || 'null'));
  const [proofs, setProofs] = useState<Proof[]>(() => JSON.parse(localStorage.getItem('eklore_db_proofs') || '[]'));

  const [activeTab, setActiveTab] = useState('home');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- SAUVEGARDE AUTOMATIQUE ---
  useEffect(() => {
    localStorage.setItem('eklore_db_users', JSON.stringify(users));
    localStorage.setItem('eklore_db_proofs', JSON.stringify(proofs));
    localStorage.setItem('eklore_session', JSON.stringify(currentUser));
  }, [users, proofs, currentUser]);

  // --- CALCUL DES POINTS (DÉGRESSIF) ---
  const calculatePointsValue = () => {
    const validSubmissions = proofs.filter(p => p.status !== 'rejected').length;
    if (validSubmissions === 0) return 100;
    if (validSubmissions === 1) return 90;
    if (validSubmissions === 2) return 80;
    if (validSubmissions >= 3 && validSubmissions < 10) return 60;
    return 40;
  };

  // --- ACTIONS UTILISATEUR ---
  const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = fd.get('name') as string;
    const pass = fd.get('pass') as string;

    if (authMode === 'register') {
      const cls = fd.get('class') as string;
      if (users.find(u => u.name === name)) return alert("Nom déjà utilisé !");
      const newUser = { name, password: pass, className: cls, points: 0 };
      setUsers([...users, newUser]);
      setCurrentUser(newUser);
    } else {
      const user = users.find(u => u.name === name && u.password === pass);
      if (user) setCurrentUser(user); else alert("Identifiants incorrects");
    }
  };

  const handleUploadProof = () => {
    if (!currentUser || !previewUrl) return;
    const newProof: Proof = {
      id: Math.random().toString(36).substr(2, 9),
      userName: currentUser.name,
      className: currentUser.className,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
      fileData: previewUrl,
      earnedPoints: calculatePointsValue()
    };
    setProofs([newProof, ...proofs]);
    setPreviewUrl(null);
    alert("Preuve envoyée à l'administrateur ! Elle apparaîtra sur le mur après validation.");
    setActiveTab('proofs');
  };

  const processValidation = (id: string, isApproved: boolean) => {
    const updatedProofs = proofs.map(p => {
      if (p.id === id) {
        if (isApproved) {
          // Mise à jour des points de l'utilisateur dans la base
          setUsers(prev => prev.map(u => u.name === p.userName ? { ...u, points: u.points + p.earnedPoints } : u));
          // Mise à jour de la session actuelle si c'est nous
          if (currentUser?.name === p.userName) {
            setCurrentUser(prev => prev ? { ...prev, points: prev.points + p.earnedPoints } : null);
          }
        }
        return { ...p, status: isApproved ? 'approved' : 'rejected' } as Proof;
      }
      return p;
    });
    setProofs(updatedProofs);
  };

  // --- INTERFACE DE CONNEXION ---
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto min-h-screen bg-[#02150B] flex items-center justify-center p-6 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-20" />
        <div className="w-full bg-white rounded-[3rem] p-10 shadow-2xl relative z-10 border border-emerald-500/20">
          <div className="text-center mb-10">
            <div className="bg-emerald-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 rotate-3">
              <Globe className="text-white" size={40} />
            </div>
            <h1 className="text-3xl font-black text-emerald-950 uppercase italic tracking-tighter">Green Challenge</h1>
            <p className="text-emerald-600 text-[10px] font-black tracking-[0.3em] uppercase mt-2">Eklore Campus Edition</p>
          </div>
          <form onSubmit={handleAuth} className="space-y-4">
            <input name="name" required placeholder="Nom / Prénom" className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-600 outline-none transition-all" />
            <input name="pass" type="password" required placeholder="Mot de passe" className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-600 outline-none transition-all" />
            {authMode === 'register' && (
              <select name="class" className="w-full bg-slate-50 p-5 rounded-2xl font-bold border-2 border-transparent focus:border-emerald-600 outline-none">
                <option>Bachelor 1</option><option>Bachelor 2</option><option>Mastère</option>
              </select>
            )}
            <button className="w-full bg-emerald-700 text-white py-6 rounded-2xl font-black shadow-xl uppercase text-xs tracking-widest active:scale-95 transition-all">
              {authMode === 'register' ? "S'inscrire" : "Se Connecter"}
            </button>
          </form>
          <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="w-full mt-8 text-emerald-900 text-[10px] font-black uppercase underline">
            {authMode === 'login' ? "Nouveau ? Créer un compte" : "Déjà membre ? Connexion"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto min-h-screen bg-[#F8FAF9] pb-32 font-sans text-slate-900 shadow-2xl relative">
      
      {/* HEADER : DESIGN RSE SOMBRE */}
      <header className="bg-[#02150B] pt-14 pb-24 px-8 rounded-b-[4rem] text-white relative overflow-hidden shadow-2xl">
        <img src="https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1000" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
             <div className="bg-emerald-500 p-3 rounded-2xl shadow-lg shadow-emerald-500/40"><TreePine size={24} /></div>
             <div>
               <h2 className="font-black italic text-xl leading-none">{currentUser.name}</h2>
               <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest mt-1.5">{currentUser.className}</p>
             </div>
          </div>
          <button onClick={() => {setCurrentUser(null); localStorage.removeItem('eklore_session');}} className="bg-white/10 p-3 rounded-2xl backdrop-blur-xl border border-white/10"><LogOut size={20}/></button>
        </div>

        <div className="relative z-10 bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-[3rem] flex justify-around shadow-inner">
           <div className="text-center">
             <p className="text-[10px] font-black opacity-50 uppercase mb-2 tracking-widest">Points cumulés</p>
             <div className="flex items-center gap-3 text-3xl font-black text-emerald-400"><Star fill="currentColor" size={24}/> {currentUser.points}</div>
           </div>
           <div className="w-[1px] bg-white/10 h-12 self-center"></div>
           <div className="text-center">
             <p className="text-[10px] font-black opacity-50 uppercase mb-2 tracking-widest">Classement</p>
             <div className="flex items-center gap-3 text-3xl font-black text-white"><Trophy size={24}/> #1</div>
           </div>
        </div>
      </header>

      {/* CONTENU PRINCIPAL */}
      <main className="px-6 -mt-12 relative z-20">
        
        {/* ONGLET DÉFI : L'EXPÉRIENCE D'UPLOAD */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-10 duration-500">
            <div className="bg-white rounded-[3.5rem] p-10 shadow-2xl border border-white relative overflow-hidden group">
              <div className="bg-orange-500 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase italic mb-8 inline-flex items-center gap-3 shadow-lg animate-pulse">
                <Flame size={16} fill="currentColor" /> Défi du jour
              </div>
              <h3 className="text-3xl font-black italic tracking-tighter text-slate-800 leading-[0.9] mb-4 uppercase">Le Mug Immortel</h3>
              <p className="text-slate-500 text-sm font-medium mb-10 leading-relaxed italic">"Dites adieu aux gobelets en plastique. Prenez votre gourde ou mug en photo devant le bâtiment A."</p>
              
              <input type="file" ref={fileInputRef} onChange={(e) => {
                const f = e.target.files?.[0];
                if(f) { const r = new FileReader(); r.onloadend = () => setPreviewUrl(r.result as string); r.readAsDataURL(f); }
              }} accept="image/*" className="hidden" />
              
              {!previewUrl ? (
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-emerald-50/50 border-4 border-dashed border-emerald-100 rounded-[3rem] py-20 flex flex-col items-center gap-5 group-hover:border-emerald-500 transition-all duration-500">
                   <div className="bg-white p-6 rounded-full shadow-2xl text-emerald-600 group-hover:scale-125 transition-transform"><Camera size={40}/></div>
                   <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest">Télécharger ma preuve</p>
                </button>
              ) : (
                <div className="relative rounded-[3rem] overflow-hidden shadow-2xl ring-8 ring-emerald-50">
                  <img src={previewUrl} className="w-full h-80 object-cover" />
                  <button onClick={() => setPreviewUrl(null)} className="absolute top-6 right-6 bg-red-500 text-white p-3 rounded-full shadow-2xl hover:scale-110 transition-transform"><X size={24}/></button>
                </div>
              )}

              <button onClick={handleUploadProof} disabled={!previewUrl} className={`w-full py-7 rounded-[2.5rem] mt-8 font-black shadow-2xl flex items-center justify-center gap-4 transition-all duration-300 ${previewUrl ? 'bg-emerald-950 text-white hover:bg-black scale-105' : 'bg-slate-100 text-slate-300'}`}>
                <Send size={22}/> VALIDER MA MISSION
              </button>
            </div>
            <div className="relative h-40 rounded-[3rem] overflow-hidden shadow-xl">
               <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] flex items-center px-8">
                  <p className="text-white font-black italic text-lg leading-tight uppercase">Ton action sauve <br/><span className="text-emerald-300 text-2xl">400L d'eau / an</span></p>
               </div>
            </div>
          </div>
        )}

        {/* LE MUR : SEULEMENT LES PREUVES VALIDÉES */}
        {activeTab === 'proofs' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex justify-between items-end px-4">
               <h3 className="text-3xl font-black italic tracking-tighter uppercase">Le Mur RSE</h3>
               <Recycle className="text-emerald-600 mb-1" size={28}/>
            </div>
            <div className="grid grid-cols-2 gap-5 pb-20">
              {proofs.filter(p => p.status === 'approved').length === 0 && (
                <div className="col-span-2 bg-white/50 border-4 border-dotted border-slate-200 p-20 rounded-[4rem] text-center italic text-slate-300 font-bold uppercase text-[11px] tracking-widest">
                  Le mur est vide... <br/>Soyez le premier à agir !
                </div>
              )}
              {proofs.filter(p => p.status === 'approved').map(p => (
                <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-white group animate-in zoom-in-95">
                  <div className="h-48 overflow-hidden">
                    <img src={p.fileData} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-5 bg-emerald-50/30">
                    <p className="font-black text-xs text-emerald-950 leading-none mb-1">{p.userName}</p>
                    <div className="flex justify-between items-center">
                       <p className="text-[9px] font-bold text-slate-400 uppercase">{p.className}</p>
                       <span className="bg-white px-2 py-1 rounded-lg text-emerald-700 font-black text-[10px] shadow-sm">+{p.earnedPoints} PTS</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* INTERFACE ADMIN : VALIDATION MANUELLE */}
        {activeTab === 'admin' && (
          <div className="space-y-8 pb-20 animate-in slide-in-from-right-10">
            <div className="bg-[#02150B] rounded-[3.5rem] p-10 text-white shadow-2xl border border-white/10 relative overflow-hidden">
              <ShieldAlert className="absolute -right-10 -bottom-10 w-48 h-48 opacity-5" />
              <div className="flex items-center gap-5 mb-10 relative z-10">
                <div className="bg-emerald-500 p-4 rounded-3xl shadow-xl"><ShieldCheck size={32} /></div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter leading-none">Validation <br/><span className="text-emerald-400 text-sm">Eklore Admin</span></h3>
              </div>
              
              <div className="space-y-8 relative z-10">
                {proofs.filter(p => p.status === 'pending').map(p => (
                  <div key={p.id} className="bg-white/10 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 animate-in zoom-in-90">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center font-black italic text-[#02150B] text-xl shadow-lg">{p.userName.charAt(0)}</div>
                       <div><p className="text-sm font-black">{p.userName}</p><p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">{p.className}</p></div>
                    </div>
                    <img src={p.fileData} className="w-full h-72 object-cover rounded-[2rem] mb-6 shadow-2xl ring-4 ring-white/5" />
                    <div className="flex gap-4">
                       <button onClick={() => processValidation(p.id, true)} className="flex-1 bg-emerald-500 text-[#02150B] py-5 rounded-2xl font-black text-xs uppercase shadow-xl hover:bg-white transition-all">APPROUVER (+{p.earnedPoints})</button>
                       <button onClick={() => processValidation(p.id, false)} className="flex-1 bg-red-500/20 text-red-400 py-5 rounded-2xl font-black text-xs uppercase border border-red-500/30">REFUSER</button>
                    </div>
                  </div>
                ))}
                {proofs.filter(p => p.status === 'pending').length === 0 && (
                  <div className="py-20 text-center flex flex-col items-center gap-4 opacity-30">
                    <CheckCircle size={48} />
                    <p className="italic font-bold uppercase text-xs tracking-[0.2em]">Aucune preuve en attente</p>
                  </div>
                )}
              </div>
            </div>
            <img src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000" className="w-full h-44 object-cover rounded-[3.5rem] grayscale" />
          </div>
        )}

      </main>

      {/* BARRE DE NAVIGATION STYLE "BASE44" */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-3xl border-t border-slate-100 flex justify-around items-center px-6 pt-5 pb-10 z-[100] rounded-t-[4rem] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
        {[
          { id: 'home', icon: Flame, label: 'Défi' },
          { id: 'proofs', icon: LayoutDashboard, label: 'Le Mur' },
          { id: 'shop', icon: Gift, label: 'Boutique' },
          { id: 'admin', icon: ShieldCheck, label: 'Admin', notify: proofs.filter(p => p.status === 'pending').length > 0 }
        ].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center gap-2 flex-1 transition-all duration-300 relative ${activeTab === item.id ? 'text-emerald-900' : 'text-slate-300 hover:text-slate-400'}`}>
            {item.notify && <div className="absolute top-0 right-1/4 w-3 h-3 bg-red-500 rounded-full border-4 border-white animate-bounce"></div>}
            <div className={`p-4 rounded-[1.5rem] transition-all duration-500 ${activeTab === item.id ? 'bg-emerald-100 scale-110 shadow-inner' : ''}`}>
              <item.icon size={24} fill={activeTab === item.id ? "currentColor" : "none"} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest italic">{item.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}
