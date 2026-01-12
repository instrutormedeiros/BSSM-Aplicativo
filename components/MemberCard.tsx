
import React, { useRef } from 'react';
import { User } from '../types';

interface MemberCardProps {
  user: User;
  onPhotoUpdate: (photo: string) => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ user, onPhotoUpdate }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onPhotoUpdate(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const isElegivel = user.elegibilidade?.toLowerCase().includes('elegível') || 
                    user.elegibilidade?.toLowerCase().includes('ativo');
  
  const statusClasses = isElegivel 
    ? 'bg-emerald-500 text-white shadow-emerald-100' 
    : 'bg-[#f59e0b] text-white shadow-orange-100';

  return (
    <div className="w-full max-w-3xl mx-auto px-4 md:px-0 animate-in fade-in zoom-in duration-700">
      <div className="bg-white rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,45,90,0.15)] overflow-hidden border border-white/50 relative">
        
        {/* Header Compacto */}
        <div className="bg-[#002d5a] p-3 flex justify-between items-center text-white relative overflow-hidden">
          <div className="flex items-center gap-3 z-10 pl-4">
            <img 
              src="https://raw.githubusercontent.com/instrutormedeiros/IndicadoresBrigadaHSM/refs/heads/main/assets/LOGO%20HSM.png" 
              className="h-8 brightness-0 invert" 
              alt="HSM Logo"
            />
          </div>
          <div className="text-right z-10 pr-4">
            <p className="text-[7px] font-black opacity-60 uppercase tracking-[0.2em] leading-none mb-0.5">Identidade Digital</p>
            <p className="text-sm font-bold poppins tracking-tight leading-none uppercase">BSSM BENEFÍCIO</p>
          </div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid grid-cols-12 gap-2 p-2">
             {[...Array(24)].map((_, i) => <i key={i} className="fas fa-plus text-[6px]"></i>)}
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-8 mb-6 items-center md:items-start">
            {/* Foto Vertical Compacta */}
            <div 
              onClick={handlePhotoClick}
              className="w-32 h-36 bg-slate-50 rounded-xl border-4 border-white shadow-lg overflow-hidden flex-shrink-0 cursor-pointer group relative transition-all duration-500 hover:scale-[1.05]"
            >
              {user.photo ? (
                <img src={user.photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="User" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                  <i className="fas fa-user-circle text-4xl mb-1 opacity-20"></i>
                  <span className="text-[8px] font-bold uppercase tracking-widest">Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                <i className="fas fa-camera text-white"></i>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* Nome e Cargo Principal */}
            <div className="flex-1 pt-1 text-center md:text-left">
              <h2 className="text-2xl font-black text-slate-800 leading-tight uppercase poppins tracking-tight mb-2">
                {user.name}
              </h2>
              <div className="space-y-1">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Cargo / Função</p>
                <p className="text-sm font-bold text-[#005eb8] uppercase poppins leading-tight">{user.cargo}</p>
              </div>
            </div>
          </div>

          {/* Dados em Grid - Sem Negrito */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors group">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Matrícula</span>
              <span className="text-base font-normal text-slate-600 poppins">{user.id}</span>
            </div>
            <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors group">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-1">Local</span>
              <span className="text-xs font-normal text-slate-600 poppins whitespace-nowrap overflow-hidden text-ellipsis block">
                {user.local}
              </span>
            </div>
          </div>

          {/* Consulte Aqui Button */}
          <div className="relative mb-6">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
             </div>
             <div className="relative flex justify-end">
                <button className="bg-[#005eb8] text-white text-[10px] font-black px-5 py-2 rounded-lg flex items-center gap-2 shadow-lg shadow-blue-100 hover:bg-[#00478a] hover:scale-105 transition-all animate-bounce-custom">
                   Consulte Aqui <i className="fas fa-chevron-down text-[8px]"></i>
                </button>
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-6 items-stretch">
             {/* Elegibilidade */}
             <div className="flex-1">
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest block mb-2">Situação Cadastral</span>
                <div className={`${statusClasses} px-5 py-3 rounded-xl text-[11px] font-black uppercase shadow-lg flex items-center gap-3 hover:scale-[1.02] transition-transform cursor-default`}>
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                  {user.elegibilidade}
                </div>
                <p className="text-[9px] text-slate-400 mt-3 font-semibold italic">
                  * Documento válido exclusivamente para a rede HSM.
                </p>
             </div>

             {/* Ações */}
             <div className="flex-1 flex flex-col gap-3">
                <a 
                  href="https://docs.google.com/spreadsheets/d/1EG4rAXs_hVMTn9hWh4_54uymBziVn_Q7HW3lfdODam8/edit" 
                  target="_blank"
                  className="flex items-center justify-between w-full bg-blue-50/50 text-[#005eb8] px-5 py-3 rounded-xl border border-blue-100 hover:bg-blue-100 hover:shadow-xl transition-all duration-300 group"
                >
                  <span className="text-[10px] font-black uppercase">Rede Credenciada</span>
                  <i className="fas fa-map-location-dot text-lg group-hover:scale-125 transition-all duration-500 opacity-70 group-hover:opacity-100"></i>
                </a>
                
                <button className="flex items-center justify-between w-full bg-teal-50/50 text-[#0d9488] px-5 py-3 rounded-xl border border-teal-100 hover:bg-teal-100 hover:shadow-xl transition-all duration-300 group">
                   <span className="text-[10px] font-black uppercase">Sua Cartilha</span>
                   <i className="fas fa-file-shield text-lg group-hover:scale-125 transition-all duration-500 opacity-70 group-hover:opacity-100"></i>
                </button>
             </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#00a896] to-[#00c9b4] h-2 w-full"></div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] opacity-30">
          Uso Exclusivo Hospital Santa Marta - BSSM v6.0
        </p>
      </div>
    </div>
  );
};

export default MemberCard;
