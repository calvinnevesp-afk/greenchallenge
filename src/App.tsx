import React, { useState, useEffect } from 'react';
import { Leaf, Trophy, Users, ShieldCheck, Camera, Send, Clock, CheckCircle2, Trash2, LayoutDashboard, Flame } from 'lucide-react';

// --- TYPES ---
type Proof = { id: string; user: string; class: string; type: string; status: 'pending' | 'approved'; timestamp: string; challenge: string };
type Challenge = { id: string; title: string; desc: string; points: number; category: string };

// --- DONNÉES INITIALES ---
const CHALLENGES_POOL: Challenge[] = [
  { id: '1', title: "Ramasse 5 déchets", desc: "Trouve et ramasse 5 déchets sur le campus. Prends une photo de ta collecte !", points: 40, category: "Environnement" },
  { id: '2', title: "Zéro Plastique", desc: "Montre ta gourde ou ta tasse réutilisable à la cafétéria.", points: 30, category: "Environnement" },
  { id: '3', title: "Escaliers Challenge", desc: "Prends une photo de toi dans les escaliers (pas d'ascenseur aujourd'hui !)", points: 20, category: "Sport" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('defi');
  const [isAdmin, setIsAdmin] = useState(false);
  const [password, setPassword] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [isLive, setIsLive] = useState(false);
  
  // États de l'application (Simulés pour la démo, normalement sur une base de données)
  const [proofs, setProofs] = useState<Proof[]>([
    { id: 'p1', user: "Calvin Neves", class: "Bachelor 1", type: "Photo", status: 'approved', timestamp: "12h31", challenge: "Ramasse 5 déchets" }
  ]);

  // --- LOGIQUE DU COMPTE À REBOURS (13H) ---
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date();
      target.setHours(13, 0, 0, 0);
      
      if (now >= target) {
        setIsLive(true);
        setTimeLeft("DÉFI EN COURS !");
      } else {
        const diff = target.getTime() - now.getTime();
        const h = Math.floor(diff / 3600000);
        const m = Math.floor((diff % 3600000) / 60000);
        const s = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${h}h ${m}m ${s}s`);
        setIsLive(false);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- COMPOSANTS DE NAVIGATION ---
  const NavItem = ({ id, icon: Icon, label }: any) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center justify-center w-full py-2 ${activeTab === id ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
      <Icon size={20} />
      <span className="text-[10px] mt-1 uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 pb-24 font-sans text-slate-900 shadow-2xl">
      
      {/* HEADER DYNAMIQUE */}
      <div className="relative h-64 w-full overflow-hidden bg-emerald-900">
        <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&q=80" className="absolute w-full h-full object-cover opacity-50" alt="nature" />
        <div className="relative z-10 p-6 pt-12 text-white">
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/20 backdrop-blur-md p-2 rounded-xl"><Leaf size={24} /></div>
            <h1 className="text-2xl font-black italic tracking-tighter">DÉFI VERT</h1>
          </div>
          <p className="text-sm font-medium opacity-80">par eklore • Mardi 17 Mars</p>
          
          <div className="mt-8 grid grid-cols-3 gap-3">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <Clock size={16} className="mx-auto mb-1 text-amber-400" />
              <p className="text-[10px] font-bold uppercase opacity-60 text-white">Prochain</p>
              <p className="text-xs font-black">{timeLeft}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <Trophy size={16} className="mx-auto mb-1 text-yellow-400" />
              <p className="text-[10px] font-bold uppercase opacity-60 text-white">Points</p>
              <p className="text-xs font-black">100 pts</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
              <Flame size={16} className="mx-auto mb-1 text-orange-400" />
              <p className="text-[10px] font-bold uppercase opacity-60 text-white">Série</p>
              <p className="text-xs font-black">3 Jours</p>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENU VARIABLE */}
      <div className="px-5 -mt-6 relative z-20">
        
        {/* ONGLET 1 : DÉFI */}
        {activeTab === 'defi' && (
          <div className="space-y-4">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-xl border border-slate-100">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-bold mb-4">
                <Sparkles size={12} /> ENVIRONNEMENT
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">{CHALLENGES_POOL[0].title}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">{CHALLENGES_POOL[0].desc}</p>
              
              <div className="space-y-3">
                <div className="bg-slate-50 p-4 rounded-2xl border-2 border-dashed border-slate-200 text-center">
                  <Camera className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs font-bold text-slate-400">Clique pour ajouter Photo/Vidéo</p>
                </div>
                <input type="text" placeholder="Ta classe (ex: Bachelor 1)" className="w-full bg-slate-50 border-none rounded-xl p-4 text-sm focus:ring-2 ring-emerald-500" />
                <button className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Send size={18} /> ENVOYER MA PREUVE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET 2 : MUR DES RÉALISATIONS */}
        {activeTab === 'mur' && (
          <div className="space-y-4">
            <h3 className="font-black text-xl text-emerald-900 flex items-center gap-2">
               Mur des réalisations
            </h3>
            {proofs.map(p => (
              <div key={p.id} className="bg-white p-4 rounded-3xl shadow-md border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">CN</div>
                  <div>
                    <p className="text-sm font-black">{p.user}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{p.class} • {p.timestamp}</p>
                  </div>
                  <div className="ml-auto bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[10px] font-black italic">VALIDÉ</div>
                </div>
                <div className="bg-slate-100 aspect-video rounded-2xl flex items-center justify-center text-slate-400 text-xs italic">
                  Image de la preuve : {p.challenge}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ONGLET 3 : CLASSEMENT */}
        {activeTab === 'classement' && (
          <div className="bg-white rounded-[2.5rem] p-6 shadow-xl">
             <div className="flex bg-slate-100 p-1 rounded-2xl mb-6">
               <button className="flex-1 bg-white py-2 rounded-xl text-xs font-black shadow-sm">INDIVIDUEL</button>
               <button className="flex-1 py-2 rounded-xl text-xs font-black text-slate-400">PAR CLASSE</button>
             </div>
             <div className="space-y-4">
                <div className="flex items-center gap-4 bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <span className="font-black text-emerald-600">01</span>
                  <div className="w-10 h-10 bg-yellow-400 rounded-full border-2 border-white" />
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-800">Calvin Neves (toi)</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">1 défi validé</p>
                  </div>
                  <p className="font-black text-emerald-600">100 pts</p>
                </div>
             </div>
          </div>
        )}

        {/* ONGLET 4 : ADMIN */}
        {activeTab === 'admin' && (
          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl text-center">
            {!isAdmin ? (
              <div className="space-y-4">
                <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <ShieldCheck size={32} />
                </div>
                <h3 className="font-black text-xl text-slate-800">Espace Éditeur</h3>
                <p className="text-slate-400 text-sm">Accès réservé aux éditeurs de Green Challenge</p>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe" 
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-4 text-center font-bold" 
                />
                <button 
                  onClick={() => password === 'carragrillon' ? setIsAdmin(true) : alert('Code incorrect')}
                  className="w-full bg-slate-900 text-white py-4 rounded-xl font-black"
                >ACCÉDER</button>
              </div>
            ) : (
              <div className="text-left space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h3 className="font-black text-xl">Tableau de bord</h3>
                  <button onClick={() => setIsAdmin(false)} className="text-[10px] font-bold text-red-500 uppercase">Quitter</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-2xl font-black text-emerald-600">0</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Preuves à valider</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-2xl font-black text-emerald-600">5</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Défis actifs</p>
                  </div>
                </div>
                <button className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                  <LayoutDashboard size={18} /> NOUVEAU DÉFI
                </button>
                <div className="space-y-3">
                  <p className="font-black text-xs uppercase text-slate-400 tracking-widest">Dernières preuves</p>
                  <div className="border rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-200 rounded-full" />
                    <div className="flex-1 text-xs"><b>Calvin Neves</b> a envoyé une photo</div>
                    <div className="flex gap-2">
                      <button className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CheckCircle2 size={14} /></button>
                      <button className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* BARRE DE NAVIGATION FIXE */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/80 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center px-4 py-2 z-[100] h-20">
        <NavItem id="defi" icon={Flame} label="Défi" />
        <NavItem id="mur" icon={LayoutDashboard} label="Mur" />
        <NavItem id="classement" icon={Trophy} label="Classement" />
        <NavItem id="admin" icon={ShieldCheck} label="Éditeur" />
      </nav>
    </div>
  );
}

const Sparkles = ({ size }: { size: number }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>;
