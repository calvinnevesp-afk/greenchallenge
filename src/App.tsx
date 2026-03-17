import React, { useState, useEffect, useMemo } from 'react';
import { 
  Leaf, Trophy, ShieldCheck, Camera, Send, Clock, CheckCircle2, 
  XCircle, LayoutDashboard, Flame, Sparkles, Plus, Trash2, 
  BarChart3, History, Bell, Image as ImageIcon, Video, Smartphone,
  ChevronRight, Gift, Star, Target, Info, Settings, LogOut, 
  ChevronLeft, Award, Zap, Coffee, ShoppingBag, Search
} from 'lucide-react';

// --- TYPES & INTERFACES ---
interface User { id: string; name: string; className: string; points: number; streak: number; badges: string[]; }
interface Challenge { id: number; title: string; desc: string; category: string; points: number; date: string; impact: string; difficulty: 'Facile' | 'Moyen' | 'Difficile'; }
interface Proof { 
  id: number; user: string; class: string; challengeTitle: string; 
  status: 'pending' | 'approved' | 'rejected'; timestamp: string; 
  image: string; type: 'Photo' | 'Vidéo' | 'Screen'; points: number;
  adminNote?: string;
}
interface Reward { id: number; title: string; cost: number; icon: any; stock: number; }

// --- CONSTANTES DE DÉPART ---
const INITIAL_CHALLENGES: Challenge[] = [
  { id: 1, title: "Zéro Plastique : La Gourde", desc: "Montre que tu utilises une gourde ou un mug réutilisable à la cafétéria aujourd'hui.", category: "ÉCOLOGIE", points: 40, date: "17 Mars", impact: "Économise 200g de plastique/semaine", difficulty: 'Facile' },
  { id: 2, title: "Le Défi des Escaliers", desc: "Monte au 4ème étage par les escaliers. Prends un selfie en haut !", category: "BIEN-ÊTRE", points: 20, date: "18 Mars", impact: "Réduit la conso électrique de l'ascenseur", difficulty: 'Moyen' },
  { id: 3, title: "Aide ton prochain", desc: "Aide un camarade sur un exercice complexe et valide avec lui.", category: "SOCIAL", points: 60, date: "19 Mars", impact: "Améliore la cohésion du campus", difficulty: 'Difficile' }
];

const SHOP_ITEMS: Reward[] = [
  { id: 1, title: "Café offert", cost: 100, icon: Coffee, stock: 50 },
  { id: 2, title: "Gourde Eklore", cost: 500, icon: ShoppingBag, stock: 10 },
  { id: 3, title: "Badge VIP", cost: 1000, icon: Star, stock: 5 },
];

export default function App() {
  // --- ÉTATS GLOBAUX ---
  const [activeTab, setActiveTab] = useState('home');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [notifications, setNotifications] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Simulation Base de Données
  const [user, setUser] = useState<User>({
    id: 'u1', name: 'Calvin Neves', className: 'Bachelor 1 Digital', points: 240, streak: 3, badges: ['Éclaireur', 'Recycleur']
  });
  const [challenges, setChallenges] = useState<Challenge[]>(INITIAL_CHALLENGES);
  const [proofs, setProofs] = useState<Proof[]>([
    { id: 101, user: "Thomas Durand", class: "Mastère 1", challengeTitle: "Zéro Plastique", status: 'approved', timestamp: "13:45", image: "https://images.unsplash.com/photo-1602143307185-8c15059e8cce?w=400", type: 'Photo', points: 40 },
    { id: 102, user: "Julie Castet", class: "Bachelor 2", challengeTitle: "Zéro Plastique", status: 'pending', timestamp: "14:10", image: "https://images.unsplash.com/photo-1523362622602-af2439c714d0?w=400", type: 'Photo', points: 40 }
  ]);

  // Formulaires
  const [userNameInput, setUserNameInput] = useState('');
  const [selectedClass, setSelectedClass] = useState('Bachelor 1');
  const [proofType, setProofType] = useState<'Photo' | 'Vidéo' | 'Screen'>('Photo');

  // --- LOGIQUE TEMPORELLE ---
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

  // --- FONCTIONS ACTIONS ---
  const addNotification = (msg: string) => {
    setNotifications(prev => [msg, ...prev]);
    setTimeout(() => setNotifications(prev => prev.slice(0, -1)), 4000);
  };

  const handleSendProof = () => {
    if (!userNameInput.trim()) return alert("Ton nom est requis.");
    const newProof: Proof = {
      id: Date.now(),
      user: userNameInput,
      class: selectedClass,
      challengeTitle: challenges[0].title,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2h-digit', minute: '2h-digit' }),
      image: "https://images.unsplash.com/photo-1589365278144-c9e705f843ba?w=400",
      type: proofType,
      points: challenges[0].points
    };
    setProofs([newProof, ...proofs]);
    setUserNameInput('');
    addNotification("🚀 Preuve envoyée ! En attente de validation.");
  };

  const approveProof = (id: number) => {
    setProofs(prev => prev.map(p => {
      if (p.id === id) {
        addNotification(`✅ Preuve de ${p.user} validée !`);
        return { ...p, status: 'approved' };
      }
      return p;
    }));
  };

  const buyItem = (item: Reward) => {
    if (user.points < item.cost) return alert("Points insuffisants !");
    setUser({ ...user, points: user.points - item.cost });
    addNotification(`🎁 ${item.title} acheté avec succès !`);
  };

  // --- CALCULS ---
  const leaderboard = useMemo(() => {
    return proofs
      .filter(p => p.status === 'approved')
      .reduce((acc: any[], curr) => {
        const existing = acc.find(a => a.name === curr.user);
        if (existing) existing.pts += curr.points;
        else acc.push({ name: curr.user, pts: curr.points, class: curr.class });
        return acc.sort((a, b) => b.pts - a.pts);
      }, []);
  }, [proofs]);

  // --- COMPOSANTS INTERNES ---
  const TabButton = ({ id, icon: Icon, label }: any) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center gap-1 flex-1 py-2 transition-all ${activeTab === id ? 'text-emerald-700' : 'text-slate-300'}`}>
      <div className={`p-2.5 rounded-2xl transition-all ${activeTab === id ? 'bg-emerald-100 scale-110 shadow-sm' : ''}`}>
        <Icon size={22} fill={activeTab === id ? "currentColor" : "none"} />
      </div>
      <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white pb-28 font-sans text-slate-900 shadow-2xl relative overflow-hidden">
      
      {/* OVERLAY NOTIFICATIONS */}
      <div className="fixed top-4 left-0 right-0 z-[100] px-6 pointer-events-none space-y-2">
        {notifications.map((n, i) => (
          <div key={i} className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-full duration-300 pointer-events-auto">
            <Zap size={16} className="text-yellow-400" />
            <span className="text-[11px] font-bold">{n}</span>
          </div>
        ))}
      </div>

      {/* --- HEADER COMPLEXE --- */}
      <header className="bg-[#042F1A] pt-12 pb-20 px-6 rounded-b-[3.5rem] relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]"></div>
        <div className="relative z-10 flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2.5 rounded-2xl rotate-3 shadow-xl">
              <Leaf className="text-white" size={24} fill="currentColor" />
            </div>
            <div>
              <h1 className="text-white text-xl font-black italic tracking-tighter leading-none">GREEN CAMPUS</h1>
              <p className="text-emerald-400 text-[9px] font-black tracking-widest mt-1 uppercase">Eklore RSE Management</p>
            </div>
          </div>
          <div className="flex gap-2">
             <button className="bg-white/10 p-2.5 rounded-xl text-white backdrop-blur-md border border-white/5"><Bell size={18}/></button>
             <button onClick={() => setActiveTab('profile')} className="bg-white/10 p-2.5 rounded-xl text-white backdrop-blur-md border border-white/5"><Settings size={18}/></button>
          </div>
        </div>

        {/* STATS DU JOUR */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-center">
            <Flame size={20} className="text-orange-500 mx-auto mb-1" fill="currentColor" />
            <p className="text-[8px] font-bold text-white/50 uppercase">Série</p>
            <p className="text-white font-black text-sm">{user.streak} Jours</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-center">
            <Trophy size={20} className="text-yellow-400 mx-auto mb-1" fill="currentColor" />
            <p className="text-[8px] font-bold text-white/50 uppercase">Points</p>
            <p className="text-white font-black text-sm">{user.points}</p>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-3xl text-center">
            <Clock size={20} className="text-emerald-400 mx-auto mb-1" />
            <p className="text-[8px] font-bold text-white/50 uppercase">Prochain</p>
            <p className="text-white font-black text-[10px] uppercase">{timeLeft}</p>
          </div>
        </div>
      </header>

      {/* --- BODY --- */}
      <main className="px-6 -mt-10 relative z-20">
        
        {/* ONGLET 1 : DÉFIS (HOME) */}
        {activeTab === 'home' && (
          <div className="space-y-6">
            {/* CARTE DÉFI ACTIF */}
            <div className="bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 overflow-hidden relative">
              <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-3xl font-black text-[10px] tracking-tighter italic">
                DÉFI DU JOUR
              </div>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                  {challenges[0].category}
                </span>
                <span className="text-slate-300 font-bold text-[10px]">Lvl: {challenges[0].difficulty}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight mb-3 uppercase italic tracking-tighter">
                {challenges[0].title}
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                {challenges[0].desc}
              </p>
              
              <div className="bg-emerald-50 p-4 rounded-2xl mb-8 border border-emerald-100/50">
                <div className="flex items-center gap-3 text-emerald-800">
                  <Info size={16} />
                  <p className="text-[10px] font-bold leading-tight uppercase italic">{challenges[0].impact}</p>
                </div>
              </div>

              {/* FORMULAIRE DÉPÔT */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {(['Photo', 'Vidéo', 'Screen'] as const).map(t => (
                    <button key={t} onClick={() => setProofType(t)} className={`py-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all ${proofType === t ? 'border-emerald-500 bg-emerald-50' : 'border-slate-50 bg-slate-50 text-slate-400'}`}>
                      {t === 'Photo' && <Camera size={18}/>}
                      {t === 'Vidéo' && <Video size={18}/>}
                      {t === 'Screen' && <Smartphone size={18}/>}
                      <span className="text-[8px] font-black uppercase">{t}</span>
                    </button>
                  ))}
                </div>
                <input 
                  type="text" value={userNameInput} onChange={(e) => setUserNameInput(e.target.value)}
                  placeholder="Nom complet"
                  className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold shadow-inner"
                />
                <select className="w-full bg-slate-50 border-none rounded-2xl p-5 text-sm font-bold appearance-none">
                  <option>Bachelor 1 Digital</option><option>Bachelor 2 Marketing</option><option>Bachelor 3 RH</option><option>Mastère 1</option>
                </select>
                <button onClick={handleSendProof} className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black shadow-xl flex items-center justify-center gap-3 group">
                  VALIDER MA PREUVE <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* LISTE DÉFIS À VENIR */}
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 italic">Prochains rendez-vous</h3>
              <div className="space-y-3">
                {challenges.slice(1).map(c => (
                  <div key={c.id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="bg-slate-100 p-3 rounded-2xl text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-500 transition-colors">
                         <Target size={20} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-300 uppercase">{c.date} • {c.category}</p>
                        <p className="text-sm font-black text-slate-700">{c.title}</p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-slate-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : LE MUR (PROOFS) */}
        {activeTab === 'proofs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black italic tracking-tighter">FIL D'ACTU</h2>
              <button className="bg-slate-100 p-2 rounded-xl text-slate-400"><Search size={18}/></button>
            </div>
            <div className="space-y-6">
              {proofs.filter(p => p.status === 'approved').map(p => (
                <div key={p.id} className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-50 animate-in slide-in-from-bottom-8">
                  <div className="p-5 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-900 rounded-2xl flex items-center justify-center text-white font-black text-sm italic shadow-lg">
                      {p.user.charAt(0)}{p.user.split(' ')[1]?.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm text-slate-800">{p.user}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{p.class} • {p.timestamp}</p>
                    </div>
                    <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100">
                      <CheckCircle2 size={16}/>
                    </div>
                  </div>
                  <div className="relative group">
                    <img src={p.image} className="w-full h-64 object-cover" alt="preuve" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-white text-xs font-bold italic">"{p.challengeTitle}"</p>
                    </div>
                  </div>
                  <div className="p-5 flex justify-between items-center bg-slate-50/50">
                     <div className="flex items-center gap-2">
                       <Zap size={14} className="text-orange-500" fill="currentColor" />
                       <span className="text-[10px] font-black uppercase text-slate-500">Validation Express</span>
                     </div>
                     <p className="text-emerald-700 font-black text-sm italic">+{p.points} PTS</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 3 : BOUTIQUE (SHOP) */}
        {activeTab === 'shop' && (
          <div className="space-y-6 animate-in fade-in">
            <div className="bg-emerald-900 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
               <Gift className="absolute top-[-20%] right-[-10%] w-40 h-40 opacity-10" />
               <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-60">Ta Cagnotte</p>
               <h2 className="text-4xl font-black italic tracking-tighter mb-4">{user.points} <span className="text-emerald-400 text-xl font-medium">pts</span></h2>
               <div className="w-full bg-white/10 h-1 rounded-full"><div className="bg-emerald-400 h-1 rounded-full w-[60%] shadow-[0_0_10px_#34d399]"></div></div>
               <p className="text-[9px] mt-3 font-bold opacity-50 uppercase tracking-tighter">Plus que 260 pts pour la Gourde VIP</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-20">
              {SHOP_ITEMS.map(item => (
                <div key={item.id} className="bg-white p-6 rounded-[2rem] shadow-lg border border-slate-50 flex flex-col items-center text-center">
                   <div className="bg-slate-50 w-16 h-16 rounded-3xl flex items-center justify-center text-slate-800 mb-4 shadow-inner">
                      <item.icon size={28} />
                   </div>
                   <h4 className="font-black text-sm text-slate-800 mb-1">{item.title}</h4>
                   <p className="text-[9px] font-black text-emerald-600 mb-4 uppercase">{item.cost} points</p>
                   <button 
                    onClick={() => buyItem(item)}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black hover:bg-emerald-500 transition-colors"
                   >ÉCHANGER</button>
                   <p className="text-[8px] mt-2 font-bold text-slate-300 uppercase">Stock: {item.stock}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 4 : TOP (LEADERBOARD) */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-black italic px-2">LE CLASSEMENT</h2>
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl space-y-2">
              {leaderboard.map((u, i) => (
                <div key={i} className={`flex items-center gap-4 p-5 rounded-3xl transition-all ${i === 0 ? 'bg-yellow-50 border border-yellow-100' : 'bg-slate-50'}`}>
                   <span className={`text-xl font-black italic ${i === 0 ? 'text-yellow-600' : 'text-slate-300'}`}>0{i+1}</span>
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border-2 border-emerald-50 shadow-sm font-black text-xs">{u.name.charAt(0)}</div>
                   <div className="flex-1">
                     <p className="font-black text-sm text-slate-800">{u.name}</p>
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{u.class}</p>
                   </div>
                   <div className="text-right">
                     <p className="text-sm font-black text-emerald-700 italic">{u.pts}</p>
                     <p className="text-[8px] font-bold text-slate-300 uppercase leading-none">PTS</p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ONGLET 5 : ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
             {!isAdmin ? (
               <div className="bg-white rounded-[3rem] p-10 shadow-2xl text-center">
                 <div className="bg-slate-900 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-2xl mb-8 -rotate-6">
                   <ShieldCheck size={40} />
                 </div>
                 <h2 className="text-2xl font-black mb-2 italic">PORTAIL ÉDITEUR</h2>
                 <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-8 px-6">Administration du Campus Green Challenge</p>
                 <input 
                  type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-5 text-center font-black mb-4 focus:border-emerald-500 transition-all outline-none"
                  placeholder="CODE SECRET"
                 />
                 <button onClick={() => password === 'carragrillon' ? setIsAdmin(true) : alert("Accès non autorisé.")} className="w-full bg-emerald-900 text-white py-5 rounded-[1.5rem] font-black shadow-xl tracking-widest uppercase text-xs">DÉVERROUILLER</button>
               </div>
             ) : (
               <div className="space-y-8 pb-32">
                 {/* ADMIN TOOLS */}
                 <div className="flex items-center justify-between px-2">
                   <h3 className="font-black text-lg italic tracking-tighter">TABLEAU DE BORD</h3>
                   <button onClick={() => setIsAdmin(false)} className="bg-red-50 text-red-600 px-4 py-1 rounded-full text-[10px] font-black uppercase">Fermer</button>
                 </div>

                 {/* MODIFICATION DÉFI */}
                 <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl border border-white/5">
                   <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-6">Édition du Défi #01</h4>
                   <div className="space-y-5">
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/30 ml-2">Titre du challenge</label>
                        <input type="text" value={challenges[0].title} onChange={(e) => setChallenges([{...challenges[0], title: e.target.value}, ...challenges.slice(1)])} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black outline-none focus:border-emerald-500 transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-white/30 ml-2">Description / Consignes</label>
                        <textarea value={challenges[0].desc} onChange={(e) => setChallenges([{...challenges[0], desc: e.target.value}, ...challenges.slice(1)])} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-[11px] font-medium h-28 outline-none focus:border-emerald-500 transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-white/30 ml-2">Points</label>
                          <input type="number" value={challenges[0].points} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black outline-none" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-black uppercase text-white/30 ml-2">Catégorie</label>
                          <input type="text" value={challenges[0].category} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm font-black outline-none" />
                        </div>
                      </div>
                   </div>
                 </div>

                 {/* MODÉRATION DES PREUVES */}
                 <div className="space-y-4">
                   <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2 flex items-center gap-2">
                     <Bell size={14} className="text-emerald-500" /> Preuves en attente ({proofs.filter(p => p.status === 'pending').length})
                   </h4>
                   {proofs.filter(p => p.status === 'pending').map(p => (
                     <div key={p.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-lg animate-in fade-in slide-in-from-right-10">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[10px]">{p.user.charAt(0)}</div>
                            <div>
                              <p className="text-xs font-black">{p.user}</p>
                              <p className="text-[8px] font-bold text-slate-300 uppercase">{p.class}</p>
                            </div>
                          </div>
                          <button onClick={() => setProofs(proofs.filter(x => x.id !== p.id))} className="text-slate-200 hover:text-red-500 transition-colors"><Trash2 size={18}/></button>
                        </div>
                        <img src={p.image} className="w-full h-40 object-cover rounded-2xl mb-4" />
                        <div className="flex gap-3">
                          <button onClick={() => approveProof(p.id)} className="flex-1 bg-emerald-500 text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Approuver</button>
                          <button onClick={() => setProofs(proofs.map(x => x.id === p.id ? {...x, status: 'rejected'} : x))} className="flex-1 bg-slate-100 text-slate-400 py-3 rounded-xl text-[10px] font-black uppercase active:scale-95 transition-all">Refuser</button>
                        </div>
                     </div>
                   ))}
                   {proofs.filter(p => p.status === 'pending').length === 0 && (
                     <div className="bg-slate-50 border-2 border-dashed border-slate-100 p-10 rounded-[2.5rem] text-center">
                       <p className="text-xs font-black text-slate-300 italic uppercase">Aucun nouveau dossier</p>
                     </div>
                   )}
                 </div>
               </div>
             )}
          </div>
        )}
      </main>

      {/* --- BARRE DE NAVIGATION (BOTTOM) --- */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-2xl border-t border-slate-100 flex justify-around items-center px-4 pt-3 pb-8 z-[100] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.06)]">
        <TabButton id="home" icon={Flame} label="Défis" />
        <TabButton id="proofs" icon={LayoutDashboard} label="Le Mur" />
        <TabButton id="shop" icon={ShoppingBag} label="Shop" />
        <TabButton id="leaderboard" icon={BarChart3} label="Classement" />
        <TabButton id="admin" icon={ShieldCheck} label="Éditeur" />
      </nav>

    </div>
  );
}
