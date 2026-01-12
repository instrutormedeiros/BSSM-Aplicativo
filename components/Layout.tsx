
import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f7ff]">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-slate-100">
               <img 
                src="https://raw.githubusercontent.com/instrutormedeiros/IndicadoresBrigadaHSM/refs/heads/main/assets/LOGO%20HSM.png" 
                className="h-10" 
                alt="HSM Logo"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#00a896] tracking-tight leading-none poppins flex items-center gap-2">
                BSSM <span className="text-[#005eb8]">App</span>
              </h1>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Hospital Santa Marta</span>
            </div>
          </div>

          {user && (
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">MAT: {user.id}</p>
                <span className={`text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${user.role === UserRole.ADMIN ? 'bg-blue-600 text-white' : 'bg-[#00a896] text-white'}`}>
                  {user.role === UserRole.ADMIN ? 'Gestor' : 'Beneficiário'}
                </span>
              </div>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all border border-slate-100"
                title="Sair"
              >
                <i className="fas fa-power-off text-lg"></i>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-12">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
             <img 
                src="https://raw.githubusercontent.com/instrutormedeiros/IndicadoresBrigadaHSM/refs/heads/main/assets/LOGO%20HSM.png" 
                className="h-6 opacity-40 grayscale" 
                alt="HSM Logo"
              />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hospital Santa Marta - 2026</span>
          </div>
          <div className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">
            Plataforma Segura BSSM v6.0
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
