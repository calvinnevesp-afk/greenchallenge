import React, { useState, useEffect } from 'react';
import { Leaf, Sparkles, CheckCircle2, Clock, Trophy, Zap } from 'lucide-react';

export default function App() {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const isAfter13h = new Date().getHours() >= 13;

  if (loading) return <div className="p-10 text-center font-bold">Chargement...</div>;

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 shadow-2xl pb-10 font-sans">
      <div className="bg-emerald-600 p-8 text-white rounded-b-[3rem] shadow-lg">
        <div className="flex items-center gap-3 mb-8">
          <Leaf className="w-8 h-8" />
          <h1 className="text-2xl font-black uppercase tracking-tighter">Green Challenge</h1>
        </div>
        <p className="bg-black/20 w-fit px-4 py-1 rounded-full text-sm font-bold">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="px-6 -mt-6 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Zap className="w-5 h-5 mx-auto text-amber-500 mb-1" />
            <p className="text-[10px] font-bold text-slate-400">DÉFI</p>
            <p className="text-xs font-black">{isAfter13h ? "ACTIF" : "13H00"}</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Trophy className="w-5 h-5 mx-auto text-yellow-500 mb-1" />
            <p className="text-[10px] font-bold text-slate-400">TOP 1</p>
            <p className="text-xs font-black">+100 PTS</p>
          </div>
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 text-center">
            <Leaf className="w-5 h-5 mx-auto text-emerald-500 mb-1" />
            <p className="text-[10px] font-bold text-slate-400">ACTION</p>
            <p className="text-xs font-black">+40 PTS</p>
          </div>
        </div>

        {!isAfter13h ? (
          <div className="bg-white p-10 rounded-[2.5rem] text-center border-2 border-dashed border-slate-200">
            <Clock className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="font-bold text-slate-500">Rendez-vous à 13h00 !</p>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-emerald-50">
            <div className="flex items-center gap-2 mb-4 text-emerald-600 font-bold italic">
              <Sparkles className="w-5 h-5" /> DÉFI DU JOUR
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Zéro Déchet au Déjeuner</h3>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Utilise des couverts réutilisables et évite tout emballage plastique jetable pour ton repas !
            </p>
            {!hasSubmitted ? (
              <button 
                onClick={() => setHasSubmitted(true)}
                className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black shadow-lg shadow-emerald-500/40 active:scale-95 transition-all"
              >
                J'AI RÉUSSI ! (+40 pts)
              </button>
            ) : (
              <div className="bg-emerald-50 text-emerald-700 p-5 rounded-2xl flex items-center gap-3 font-bold border border-emerald-200">
                <CheckCircle2 className="w-6 h-6" /> Bravo ! Preuve envoyée.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
