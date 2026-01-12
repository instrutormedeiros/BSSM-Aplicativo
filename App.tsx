
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MemberCard from './components/MemberCard';
import AdminDashboard from './components/AdminDashboard';
import { User, UserRole } from './types';
import { db, ref, onValue } from './firebase';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allMembers, setAllMembers] = useState<User[]>([]);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Sincronização em tempo real com Firebase
  useEffect(() => {
    const membersRef = ref(db, 'members');
    const unsubscribe = onValue(membersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Converte objeto do Firebase para Array
        const membersList: User[] = Object.values(data);
        setAllMembers(membersList);
      } else {
        setAllMembers([]);
      }
      setLoading(false);
    });

    const session = localStorage.getItem('bssm_session');
    if (session) setCurrentUser(JSON.parse(session));

    return () => unsubscribe();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = loginUser.trim();
    const pass = loginPass.trim();

    // Login Admin (Hardcoded por segurança inicial)
    if (user.toLowerCase() === 'admin' && pass.toLowerCase() === 'admin') {
      const admin: User = { 
        id: 'admin', 
        name: 'Gestor HSM', 
        role: UserRole.ADMIN, 
        cargo: 'Administrador', 
        local: 'TI/RH', 
        elegibilidade: 'Ativo' 
      };
      setCurrentUser(admin);
      localStorage.setItem('bssm_session', JSON.stringify(admin));
      return;
    }

    // Busca na base sincronizada do Firebase
    // Busca por Matrícula ou CPF (que está dentro do campo cpf ou obs)
    const found = allMembers.find(m => 
      m.id === user || 
      (m.cpf && m.cpf === user.replace(/\D/g, '')) ||
      (m.obs && m.obs.includes(user))
    );

    if (found && (pass === user || pass === found.id || pass === found.cpf)) { 
      setCurrentUser(found);
      localStorage.setItem('bssm_session', JSON.stringify(found));
    } else {
      setError('Credenciais incorretas. Verifique seu CPF ou Matrícula.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bssm_session');
    setLoginUser('');
    setLoginPass('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4faff]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f4faff]">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,45,90,0.15)] border border-white p-12">
          <div className="text-center mb-12">
            <div className="bg-[#005eb8] w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl">
               <img src="https://raw.githubusercontent.com/instrutormedeiros/IndicadoresBrigadaHSM/refs/heads/main/assets/LOGO%20HSM.png" className="w-14 brightness-0 invert" alt="Logo HSM" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 poppins tracking-tight">BSSM <span className="text-blue-600">Portal</span></h1>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4">Hospital Santa Marta</p>
          </div>

          {error && <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Matrícula ou CPF</label>
              <div className="relative">
                <i className="fas fa-id-card absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="text" 
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/30 focus:bg-white outline-none transition-all text-slate-800 font-bold"
                  placeholder="Seu identificador"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha (Repita seu CPF/Matrícula)</label>
              <div className="relative">
                <i className="fas fa-shield-halved absolute left-5 top-1/2 -translate-y-1/2 text-slate-300"></i>
                <input 
                  type="password" 
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/30 focus:bg-white outline-none transition-all text-slate-800 font-bold"
                  placeholder="********"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#005eb8] text-white py-6 rounded-[1.5rem] font-black tracking-widest hover:bg-[#00478a] transition-all shadow-xl">
              EFETUAR LOGIN
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      {currentUser.role === UserRole.ADMIN ? (
        <AdminDashboard members={allMembers} />
      ) : (
        <div className="flex flex-col items-center py-10">
           <div className="text-center mb-16">
              <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Área do Beneficiário</span>
              <h2 className="text-5xl font-black text-slate-800 poppins tracking-tighter">Bem-vindo, {currentUser.name.split(' ')[0]}</h2>
              <p className="text-slate-400 mt-4 font-medium text-lg">Sua carteirinha digital HSM está pronta.</p>
           </div>
           <MemberCard user={currentUser} onPhotoUpdate={() => {}} />
        </div>
      )}
    </Layout>
  );
};

export default App;
