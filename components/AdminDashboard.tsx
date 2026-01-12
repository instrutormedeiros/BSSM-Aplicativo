
import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface AdminDashboardProps {
  members: User[];
  onUpload: (data: User[]) => void;
  onClear: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ members, onUpload, onClear }) => {
  const [filter, setFilter] = useState({ name: '', matricula: '', status: '' });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = (window as any).XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = (window as any).XLSX.utils.sheet_to_json(sheet);

      const mappedData: User[] = json.map((row: any, index: number) => {
        const cpf = String(row['CPF'] || row['cpf'] || '').replace(/\D/g, '');
        const matricula = String(row['Matrícula'] || row['MATRICULA'] || index);
        
        return {
          id: matricula,
          name: String(row['Nome'] || row['Colaborador'] || 'Sem Nome'),
          role: UserRole.MEMBER,
          cargo: String(row['Cargo'] || 'Não informado'),
          local: String(row['Local'] || row['Setor'] || 'HSM'),
          elegibilidade: String(row['Elegibilidade'] || row['Elegibilidade'] || row['Situação atual'] || 'Em Análise'),
          admissao: String(row['Admissão'] || ''),
          situacaoAtual: String(row['Situação atual'] || ''),
          dataNasc: String(row['Data Nasc.'] || ''),
          cpf: cpf,
          obs: cpf ? `CPF: ${cpf}` : ''
        };
      });

      onUpload(mappedData);
    };
    reader.readAsArrayBuffer(file);
  };

  const filteredMembers = members.filter(m => {
    const nameMatch = m.name.toLowerCase().includes(filter.name.toLowerCase());
    const matriculaMatch = m.id.toLowerCase().includes(filter.matricula.toLowerCase()) || (m.cpf && m.cpf.includes(filter.matricula));
    const statusMatch = filter.status === '' || m.elegibilidade.toLowerCase().includes(filter.status.toLowerCase());
    return nameMatch && matriculaMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-premium p-8 rounded-3xl border-l-8 border-[#005eb8] shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 poppins">Gestão da Base</h2>
            <p className="text-slate-500 mt-1">Carregue a planilha conforme o modelo do Hospital.</p>
            <div className="flex gap-4 mt-6">
               <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="block text-[10px] font-bold text-blue-400 uppercase">Total</span>
                  <span className="text-xl font-bold text-blue-700 poppins">{members.length}</span>
               </div>
               <div className="bg-emerald-50 px-4 py-2 rounded-lg">
                  <span className="block text-[10px] font-bold text-emerald-400 uppercase">Elegíveis</span>
                  <span className="text-xl font-bold text-emerald-700 poppins">
                    {members.filter(m => m.elegibilidade.toLowerCase().includes('elegível') || m.elegibilidade.toLowerCase().includes('ativo')).length}
                  </span>
               </div>
            </div>
          </div>
          
          <div className="relative group w-full md:w-64">
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className="border-2 border-dashed border-blue-200 bg-white rounded-2xl p-6 text-center group-hover:bg-blue-50 transition-colors">
               <i className="fas fa-file-excel text-3xl text-emerald-600 mb-2"></i>
               <p className="text-xs font-bold text-[#005eb8] uppercase">Importar HSM Base</p>
            </div>
          </div>
        </div>

        <div className="glass-premium p-8 rounded-3xl flex flex-col justify-center items-center gap-4 text-center">
           <button 
             onClick={onClear}
             className="w-full bg-rose-50 text-rose-600 border border-rose-100 py-4 rounded-2xl font-bold hover:bg-rose-100 transition-all flex items-center justify-center gap-3"
           >
             <i className="fas fa-trash-can"></i>
             Limpar Base
           </button>
        </div>
      </div>

      <div className="glass-premium p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative group">
          <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500"></i>
          <input 
            type="text" 
            placeholder="Nome do colaborador..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-white focus:border-[#005eb8] outline-none transition-all font-medium"
            value={filter.name}
            onChange={e => setFilter({...filter, name: e.target.value})}
          />
        </div>
        <div className="relative group">
          <i className="fas fa-id-card absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500"></i>
          <input 
            type="text" 
            placeholder="Matrícula ou CPF..." 
            className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-slate-100 bg-white focus:border-[#005eb8] outline-none transition-all font-medium"
            value={filter.matricula}
            onChange={e => setFilter({...filter, matricula: e.target.value})}
          />
        </div>
        <select 
          className="px-4 py-3 rounded-xl border-2 border-slate-100 bg-white focus:border-[#005eb8] outline-none transition-all font-medium"
          value={filter.status}
          onChange={e => setFilter({...filter, status: e.target.value})}
        >
          <option value="">Status (Todos)</option>
          <option value="Elegível">Elegível</option>
          <option value="Ativo">Ativo</option>
          <option value="Inapto">Inapto</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002d5a] text-white">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Matrícula</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Nome</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Local</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Admissão</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Situação</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Elegibilidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map(member => (
                <tr key={member.id} className="hover:bg-blue-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">{member.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{member.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{member.cargo}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500 font-medium">{member.local}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{member.admissao || '-'}</td>
                  <td className="px-6 py-4 text-xs text-slate-500">{member.situacaoAtual || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      member.elegibilidade.toLowerCase().includes('elegível') || member.elegibilidade.toLowerCase().includes('ativo')
                      ? 'bg-emerald-50 text-emerald-600' 
                      : 'bg-rose-50 text-rose-600'
                    }`}>
                      {member.elegibilidade}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-slate-400 italic">
                    <i className="fas fa-folder-open text-4xl mb-3 block opacity-20"></i>
                    Nenhum beneficiário encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
