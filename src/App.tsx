import React, { useState, useEffect, useRef } from 'react';
import { 
  Leaf, Trophy, ShieldCheck, Camera, Send, LayoutDashboard, 
  Flame, Star, Gift, LogOut, ShieldAlert, X, Globe, TreePine, 
  Recycle, CheckCircle
} from 'lucide-react';
import "./index.css"; // Garde ton CSS de base

// --- TYPES ---
interface User { name: string; password: string; className: string; points: number; }
interface Proof { 
  id: string; userName: string; className: string; 
  status: 'pending' | 'approved' | 'rejected'; 
  timestamp: string; fileData: string; earnedPoints: number;
}

const App: React.FC = () => {
  // --- ÉTATS (LocalStorage pour garder les comptes/points) ---
  const [users, setUsers] = useState<User[]>(() => JSON.parse(localStorage.getItem('ek_users') || '[]'));
  const [currentUser, setCurrentUser] = useState<User | null>(() => JSON.parse(localStorage.getItem('ek_sess') || 'null'));
  const [proofs, setProofs] = useState<Proof[]>(() => JSON.parse(localStorage.getItem('ek_proofs') || '[]'));
  
  const [activeTab, setActiveTab] = useState('home');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('ek_users', JSON.stringify(users));
    localStorage.setItem('ek_proofs', JSON.stringify(proofs));
    localStorage.setItem('ek_sess', JSON.stringify(currentUser));
  }, [users, proofs, currentUser]);

  // --- LOGIQUE POINTS DÉGRESSIFS ---
  const getPoints = () => {
    const count = proofs.filter(p => p.status !== 'rejected').length;
    if (count === 0) return 100;
    if (count === 1) return 90;
    if (count === 2) return 80;
    if (count < 10) return 60;
    return 40;
  };

  // --- ACTIONS ---
  const handleRegister = (e: any) => {
    e.preventDefault();
    const newUser = { name: e.target.name.value, password: e.target.pass.value, className: e.target.cls.value, points: 0 };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const submitProof = () => {
    if (!previewUrl || !currentUser) return;
    const p: Proof = {
      id: Date.now().toString(),
      userName: currentUser.name,
      className: currentUser.className,
      status: 'pending',
      timestamp: new Date().toLocaleTimeString(),
      fileData: previewUrl,
      earnedPoints: getPoints()
    };
    setProofs([p, ...proofs]);
    setPreviewUrl(null);
    alert("Envoyé à l'admin ! Tes points arriveront après validation.");
    setActiveTab('mur');
  };

  const validate = (id: string, ok: boolean) => {
    const updated = proofs.map(p => {
      if (p.id === id) {
        if (ok) {
          setUsers(users.map(u => u.name === p.userName ? {...u, points: u.points + p.earnedPoints} : u));
          if (currentUser?.name === p.userName) setCurrentUser({...currentUser, points: currentUser.points + p.earnedPoints});
        }
        return {...p, status: ok ? 'approved' : 'rejected'} as Proof;
      }
      return p;
    });
    setProofs(updated);
  };

  // --- INTERFACE CONNEXION ---
  if (!currentUser) {
    return (
      <div className="login-screen" style={{background: '#02150B', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'}}>
        <div style={{background: 'white', padding: '40px', borderRadius: '30px', width: '100%', maxWidth: '400px', textAlign: 'center'}}>
          <Globe size={50} color="#10b981" />
          <h2 style={{margin: '20px 0'}}>Rejoins le Challenge</h2>
          <form onSubmit={handleRegister} style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
            <input name="name" placeholder="Nom complet" required style={{padding: '15px', borderRadius: '10px', border: '1px solid #ddd'}} />
            <input name="pass" type="password" placeholder="Mot de passe" required style={{padding: '15px', borderRadius: '10px', border: '1px solid #ddd'}} />
            <select name="cls" style={{padding: '15px', borderRadius: '10px', border: '1px solid #ddd'}}>
              <option>Bachelor 1</option><option>Bachelor 2</option><option>Mastère</option>
            </select>
            <button type="submit" style={{padding: '15px', borderRadius: '10px', border: 'none', background: '#02150B', color: 'white', fontWeight: 'bold'}}>CRÉER MON COMPTE</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth: '500px', margin: '0 auto', background: '#F8FAF9', minHeight: '100vh', paddingBottom: '100px'}}>
      {/* Header RSE */}
      <header style={{background: '#02150B', color: 'white', padding: '30px 20px', borderRadius: '0 0 40px 40px', textAlign: 'center'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '20px'}}>
          <span style={{fontSize: '12px', fontWeight: 'bold', color: '#10b981'}}>EKLORE CAMPUS</span>
          <LogOut size={20} onClick={() => setCurrentUser(null)} />
        </div>
        <h2 style={{fontSize: '24px', margin: '0'}}>{currentUser.name}</h2>
        <div style={{display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '20px'}}>
          <div style={{background: 'rgba(255,255,255,0.1)', padding: '10px 20px', borderRadius: '20px'}}>
            <Star size={16} fill="#10b981" color="#10b981" /> {currentUser.points} pts
          </div>
        </div>
      </header>

      {/* Contenu Interactif */}
      <main style={{padding: '20px'}}>
        {activeTab === 'home' && (
          <div style={{background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)'}}>
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=500" style={{width: '100%', borderRadius: '20px', marginBottom: '20px'}} />
            <h3 style={{textTransform: 'uppercase', fontSize: '18px'}}>Défi : Zéro Gobelet</h3>
            <p style={{color: '#666', fontSize: '14px'}}>Prends ton mug en photo sur le campus !</p>
            
            <input type="file" ref={fileInputRef} hidden onChange={(e) => {
              const file = e.target.files?.[0];
              if(file) { const r = new FileReader(); r.onloadend = () => setPreviewUrl(r.result as string); r.readAsDataURL(file); }
            }} />

            {!previewUrl ? (
              <div onClick={() => fileInputRef.current?.click()} style={{border: '2px dashed #ddd', padding: '40px', textAlign: 'center', borderRadius: '20px', marginTop: '20px'}}>
                <Camera size={40} color="#ccc" />
                <p style={{fontSize: '12px', color: '#aaa', marginTop: '10px'}}>CLIQUE ICI POUR LA PHOTO</p>
              </div>
            ) : (
              <div style={{marginTop: '20px'}}>
                <img src={previewUrl} style={{width: '100%', borderRadius: '20px'}} />
                <button onClick={submitProof} style={{width: '100%', padding: '15px', background: '#02150B', color: 'white', border: 'none', borderRadius: '15px', marginTop: '10px', fontWeight: 'bold'}}>ENVOYER À L'ADMIN</button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'mur' && (
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px'}}>
            {proofs.filter(p => p.status === 'approved').map(p => (
              <div key={p.id} style={{background: 'white', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 5px 15px rgba(0,0,0,0.05)'}}>
                <img src={p.fileData} style={{width: '100%', height: '120px', objectCover: 'cover'}} />
                <div style={{padding: '10px'}}>
                  <p style={{fontSize: '10px', fontWeight: 'bold', margin: '0'}}>{p.userName}</p>
                  <p style={{fontSize: '10px', color: '#10b981', margin: '0'}}>+{p.earnedPoints} pts</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'admin' && (
          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            <h3 style={{fontSize: '14px', color: '#999'}}>ATTENTE DE VALIDATION</h3>
            {proofs.filter(p => p.status === 'pending').map(p => (
              <div key={p.id} style={{background: 'white', padding: '15px', borderRadius: '20px'}}>
                <p style={{fontWeight: 'bold'}}>{p.userName} ({p.className})</p>
                <img src={p.fileData} style={{width: '100%', borderRadius: '10px', margin: '10px 0'}} />
                <div style={{display: 'flex', gap: '10px'}}>
                  <button onClick={() => validate(p.id, true)} style={{flex: 1, padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '10px'}}>VALIDER</button>
                  <button onClick={() => validate(p.id, false)} style={{flex: 1, padding: '10px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '10px'}}>REFUSER</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Nav Bar */}
      <nav style={{position: 'fixed', bottom: 0, left: 0, right: 0, background: 'white', display: 'flex', justifyContent: 'space-around', padding: '15px', borderTop: '1px solid #eee'}}>
        <Flame color={activeTab === 'home' ? '#10b981' : '#ccc'} onClick={() => setActiveTab('home')} />
        <LayoutDashboard color={activeTab === 'mur' ? '#10b981' : '#ccc'} onClick={() => setActiveTab('mur')} />
        <ShieldCheck color={activeTab === 'admin' ? '#10b981' : '#ccc'} onClick={() => setActiveTab('admin')} />
      </nav>
    </div>
  );
};

export default App;
