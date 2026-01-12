
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
    <div className="w-full max-w-2xl mx-auto animate-in fade-in zoom-in duration-700">
      <div className="bg-white rounded-[1.5rem] shadow-[0_30px_60px_rgba(0,45,90,0.15)] overflow-hidden border border-white/50 relative">
        
        {/* Header Ultra Compacto */}
        <div className="bg-[#002d5a] p-3 flex justify-between items-center text-white relative overflow-hidden">
          <div className="flex items-center gap-3 z-10 pl-2">
            <img 
              src="https://raw.githubusercontent.com/instrutormedeiros/IndicadoresBrigadaHSM/refs/heads/main/assets/LOGO%20HSM.png" 
              className="h-7 brightness-0 invert" 
              alt="HSM Logo"
            />
          </div>
          <div className="text-right z-10 pr-2">
            <p className="text-[7px] font-black opacity-60 uppercase tracking-[0.2em] leading-none mb-0.5">Identidade Digital</p>
            <p className="text-xs font-bold poppins tracking-tight leading-none uppercase">BSSM BENEFÍCIO</p>
          </div>
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grid grid-cols-12 gap-2 p-2">
             {[...Array(24)].map((_, i) => <i key={i} className="fas fa-plus text-[6px]"></i>)}
          </div>
        </div>

        <div className="p-5 md:p-7">
          <div className="flex flex-col md:flex-row gap-5 mb-5 items-center md:items-start">
            {/* Foto Compacta */}
            <div 
              onClick={handlePhotoClick}
              className="w-24 h-28 bg-slate-50 rounded-xl border-4 border-white shadow-md overflow-hidden flex-shrink-0 cursor-pointer group relative transition-all duration-500 hover:scale-[1.05] hover:shadow-xl"
            >
              {user.photo ? (
                <img src={user.photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="User" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-slate-50">
                  <i className="fas fa-user-circle text-3xl mb-1 opacity-20"></i>
                  <span className="text-[7px] font-bold uppercase tracking-widest">Foto</span>
                </div>
              )}
              <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300 backdrop-blur-[2px]">
                <i className="fas fa-camera text-white text-sm"></i>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
            </div>

            {/* Nome e Cargo */}
            <div className="flex-1 pt-0.5 text-center md:text-left">
              <h2 className="text-lg font-black text-slate-800 leading-tight uppercase poppins tracking-tight mb-1">
                {user.name}
              </h2>
              <div className="space-y-0.5">
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Cargo / Função</p>
                <p className="text-xs font-bold text-[#005eb8] uppercase poppins leading-tight">{user.cargo}</p>
              </div>
            </div>
          </div>

          {/* Dados - Sem Negrito e Local Ajustado */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors group">
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block mb-0.5 group-hover:text-blue-400">Matrícula</span>
              <span className="text-sm font-normal text-slate-600 poppins">{user.id}</span>
            </div>
            <div className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 hover:border-blue-200 transition-colors group">
              <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block mb-0.5 group-hover:text-blue-400">Local</span>
              <span className="text-[10px] font-normal text-slate-600 poppins whitespace-nowrap overflow-hidden text-ellipsis block">
                {user.local}
              </span>
            </div>
          </div>

          {/* Separador com botão pulando */}
          <div className="relative mb-5">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
             </div>
             <div className="relative flex justify-end">
                <button className="bg-[#005eb8] text-white text-[9px] font-black px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-md shadow-blue-100 hover:bg-[#00478a] hover:scale-105 transition-all animate-bounce-custom">
                   Consulte Aqui <i className="fas fa-chevron-down text-[7px]"></i>
                </button>
             </div>
          </div>

          <div className="flex flex-col md:flex-row gap-5 items-stretch">
             {/* Status */}
             <div className="flex-1">
                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest block mb-1.5">Situação Cadastral</span>
                <div className={`${statusClasses} px-4 py-2 rounded-xl text-[10px] font-black uppercase shadow-lg flex items-center gap-2 hover:scale-[1.02] transition-transform cursor-default`}>
                  <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
                  {user.elegibilidade}
                </div>
                <p className="text-[8px] text-slate-400 mt-2 font-semibold">
                  * Documento oficial Santa Marta.
                </p>
             </div>

             {/* Botões com animação premium */}
             <div className="flex-1 flex flex-col gap-2">
                <a 
                  href="https://docs.google.com/spreadsheets/d/1EG4rAXs_hVMTn9hWh4_54uymBziVn_Q7HW3lfdODam8/edit" 
                  target="_blank"
                  className="flex items-center justify-between w-full bg-blue-50/50 text-[#005eb8] px-3.5 py-2.5 rounded-xl border border-blue-100 hover:bg-blue-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden"
                >
                  <span className="text-[9px] font-black uppercase relative z-10">Rede Credenciada</span>
                  <i className="fas fa-map-location-dot text-base group-hover:scale-125 transition-all duration-500 relative z-10 opacity-70 group-hover:opacity-100"></i>
                </a>
                
                <button className="flex items-center justify-between w-full bg-teal-50/50 text-[#0d9488] px-3.5 py-2.5 rounded-xl border border-teal-100 hover:bg-teal-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group overflow-hidden">
                   <span className="text-[9px] font-black uppercase relative z-10">Sua Cartilha</span>
                   <i className="fas fa-file-shield text-base group-hover:scale-125 transition-all duration-500 relative z-10 opacity-70 group-hover:opacity-100"></i>
                </button>
             </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#00a896] to-[#00c9b4] h-1.5 w-full"></div>
      </div>
      
      <style>{`
        @keyframes bounce-custom {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-custom {
          animation: bounce-custom 1.5s infinite ease-in-out;
        }
      `}</style>

      <div className="mt-4 text-center">
        <p className="text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] opacity-30">
          Uso Exclusivo Hospital Santa Marta
        </p>
      </div>
    </div>
  );
};

export default MemberCard;
