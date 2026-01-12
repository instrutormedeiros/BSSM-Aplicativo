
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import MemberCard from './components/MemberCard';
import AdminDashboard from './components/AdminDashboard';
import { User, UserRole } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allMembers, setAllMembers] = useState<User[]>([]);
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('bssm_db_v6');
    if (saved) setAllMembers(JSON.parse(saved));
    
    const session = localStorage.getItem('bssm_session');
    if (session) setCurrentUser(JSON.parse(session));
  }, []);

  useEffect(() => {
    localStorage.setItem('bssm_db_v6', JSON.stringify(allMembers));
  }, [allMembers]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = loginUser.trim();
    const pass = loginPass.trim();

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

    if (user === '123' && pass === '123') {
       const testUser = allMembers[0] || { 
         id: '123', 
         name: 'Usuário Teste', 
         role: UserRole.MEMBER, 
         cargo: 'Colaborador', 
         local: 'Operacional', 
         elegibilidade: 'Elegível' 
       };
       setCurrentUser(testUser);
       localStorage.setItem('bssm_session', JSON.stringify(testUser));
       return;
    }

    const found = allMembers.find(m => m.id === user || (m.obs && m.obs.includes(user)));
    if (found && pass === user) { 
      setCurrentUser(found);
      localStorage.setItem('bssm_session', JSON.stringify(found));
    } else {
      setError('Credenciais incorretas. Verifique seu CPF.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('bssm_session');
    setLoginUser('');
    setLoginPass('');
  };

  const updatePhoto = (photo: string) => {
    if (currentUser) {
      const updated = { ...currentUser, photo };
      setCurrentUser(updated);
      setAllMembers(prev => prev.map(m => m.id === currentUser.id ? updated : m));
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f4faff]">
        <div className="max-w-md w-full bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,45,90,0.15)] border border-white p-12 transition-all duration-500">
          <div className="text-center mb-12">
            <div className="bg-[#005eb8] w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-blue-200 transform hover:rotate-6 transition-transform">
               <img src="https://raw.githubusercontent.com/instrutormedeiros/IndicadoresBrigadaHSM/refs/heads/main/assets/LOGO%20HSM.png" className="w-14 brightness-0 invert" alt="Logo HSM" />
            </div>
            <h1 className="text-4xl font-black text-slate-800 poppins tracking-tight">BSSM <span className="text-blue-600">Portal</span></h1>
            <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mt-4">Hospital Santa Marta</p>
          </div>

          {error && <div className="mb-8 p-5 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-black text-center animate-pulse">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Acesso via CPF</label>
              <div className="relative group">
                <i className="fas fa-id-card absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input 
                  type="text" 
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all text-slate-800 font-bold placeholder-slate-300 shadow-sm"
                  placeholder="000.000.000-00"
                  value={loginUser}
                  onChange={e => setLoginUser(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Segurança</label>
              <div className="relative group">
                <i className="fas fa-shield-halved absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"></i>
                <input 
                  type="password" 
                  className="w-full pl-14 pr-6 py-5 rounded-[1.5rem] border-2 border-slate-100 bg-slate-50/30 focus:bg-white focus:border-blue-500 focus:ring-0 outline-none transition-all text-slate-800 font-bold placeholder-slate-300 shadow-sm"
                  placeholder="********"
                  value={loginPass}
                  onChange={e => setLoginPass(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="w-full bg-[#005eb8] text-white py-6 rounded-[1.5rem] font-black tracking-widest hover:bg-[#00478a] transition-all shadow-2xl shadow-blue-200 transform active:scale-[0.97] flex items-center justify-center gap-3">
              EFETUAR LOGIN <i className="fas fa-arrow-right-long"></i>
            </button>
          </form>

          <div className="mt-12 pt-10 border-t border-slate-50 flex justify-between items-center opacity-40 grayscale group hover:grayscale-0 hover:opacity-100 transition-all">
             <div className="flex items-center gap-3">
                <i className="fas fa-user-gear text-blue-600"></i>
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Administração</p>
                   <p className="text-[10px] font-bold text-slate-700">admin / admin</p>
                </div>
             </div>
             <div className="flex items-center gap-3 text-right">
                <div>
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Beneficiário</p>
                   <p className="text-[10px] font-bold text-slate-700">CPF / CPF</p>
                </div>
                <i className="fas fa-id-badge text-[#00a896]"></i>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Layout user={currentUser} onLogout={handleLogout}>
      {currentUser.role === UserRole.ADMIN ? (
        <AdminDashboard members={allMembers} onUpload={setAllMembers} onClear={() => setAllMembers([])} />
      ) : (
        <div className="flex flex-col items-center py-10">
           <div className="text-center mb-16 animate-in slide-in-from-top duration-700">
              <span className="bg-blue-100 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Área do Beneficiário</span>
              <h2 className="text-5xl font-black text-slate-800 poppins tracking-tighter">Bem-vindo, {currentUser.name.split(' ')[0]}</h2>
              <p className="text-slate-400 mt-4 font-medium text-lg">Aqui está sua carteirinha digital exclusiva HSM.</p>
           </div>
           <MemberCard user={currentUser} onPhotoUpdate={updatePhoto} />
        </div>
      )}
    </Layout>
  );
};

export default App;
