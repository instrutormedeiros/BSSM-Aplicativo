
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { db, ref, set } from '../firebase';

interface AdminDashboardProps {
  members: User[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ members }) => {
  const [filter, setFilter] = useState({ name: '', matricula: '', status: '' });
  const [uploading, setUploading] = useState(false);

  const formatDate = (value: any): string => {
    if (!value) return '-';
    if (typeof value === 'number') {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000));
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    }
    const dateStr = String(value);
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/) || dateStr.match(/(\d{2})\/(\d{2})\/(\d{2,4})/);
    if (match) {
      if (match[0].includes('-')) return `${match[3]}/${match[2]}/${match[1].slice(-2)}`;
      else return `${match[1]}/${match[2]}/${match[3].slice(-2)}`;
    }
    return dateStr;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target?.result as ArrayBuffer);
      const workbook = (window as any).XLSX.read(data, { type: 'array', cellDates: false });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = (window as any).XLSX.utils.sheet_to_json(sheet);

      const mappedData: Record<string, User> = {};
      json.forEach((row: any, index: number) => {
        const cpfRaw = String(row['CPF'] || row['cpf'] || '');
        const cpf = cpfRaw.replace(/\D/g, '');
        const matricula = String(row['Matrícula'] || row['MATRICULA'] || row['Matricula'] || index);
        
        mappedData[matricula] = {
          id: matricula,
          name: String(row['Nome'] || row['Colaborador'] || row['NOME'] || 'Sem Nome').trim(),
          role: UserRole.MEMBER,
          cargo: String(row['Cargo'] || row['CARGO'] || 'Não informado'),
          local: String(row['Local'] || row['Setor'] || 'HSM'),
          elegibilidade: String(row['Elegibilidade'] || row['SITUAÇÃO ATUAL'] || row['Situação atual'] || 'Em Análise'),
          admissao: formatDate(row['Admissão'] || row['ADMISSÃO'] || row['DATA ADMISSÃO'] || row['Admissao']),
          situacaoAtual: String(row['Situação atual'] || row['SITUAÇÃO ATUAL'] || ''),
          dataNasc: formatDate(row['Data Nasc.'] || row['DATA NASC'] || row['Nascimento']),
          cpf: cpf,
          obs: cpf ? `CPF: ${cpf}` : ''
        };
      });

      // Salva no Firebase
      try {
        await set(ref(db, 'members'), mappedData);
        alert('Base atualizada com sucesso no Firebase!');
      } catch (err) {
        console.error(err);
        alert('Erro ao salvar no Firebase.');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleClear = async () => {
    if (confirm('Deseja realmente apagar toda a base do Firebase?')) {
      await set(ref(db, 'members'), null);
    }
  };

  const filteredMembers = members.filter(m => {
    const nameMatch = m.name.toLowerCase().includes(filter.name.toLowerCase());
    const matMatch = m.id.toString().includes(filter.matricula) || (m.cpf && m.cpf.includes(filter.matricula));
    const statusMatch = filter.status === '' || m.elegibilidade.toLowerCase().includes(filter.status.toLowerCase());
    return nameMatch && matMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-premium p-8 rounded-3xl border-l-8 border-[#005eb8] shadow-sm flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-800 poppins">Gestão Cloud</h2>
            <p className="text-slate-500 mt-1">Sincronizado com Firebase Realtime Database.</p>
            <div className="flex gap-4 mt-6">
               <div className="bg-blue-50 px-4 py-2 rounded-lg">
                  <span className="block text-[10px] font-bold text-blue-400 uppercase">Total Cloud</span>
                  <span className="text-xl font-bold text-blue-700 poppins">{members.length}</span>
               </div>
            </div>
          </div>
          
          <div className="relative group w-full md:w-64">
            <input 
              type="file" 
              accept=".xlsx, .xls" 
              onChange={handleFileUpload}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <div className={`border-2 border-dashed ${uploading ? 'bg-slate-100' : 'bg-white'} border-blue-200 rounded-2xl p-6 text-center`}>
               <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-arrow-up'} text-3xl text-emerald-600 mb-2`}></i>
               <p className="text-xs font-bold text-[#005eb8] uppercase">{uploading ? 'Enviando...' : 'Atualizar Nuvem'}</p>
            </div>
          </div>
        </div>

        <div className="glass-premium p-8 rounded-3xl flex flex-col justify-center">
           <button onClick={handleClear} className="w-full bg-rose-50 text-rose-600 border border-rose-100 py-4 rounded-2xl font-bold hover:bg-rose-100 transition-all">
             Zerar Base Nuvem
           </button>
        </div>
      </div>

      <div className="glass-premium p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 border border-slate-200">
        <input 
          type="text" 
          placeholder="Filtrar Nome..." 
          className="px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-semibold"
          value={filter.name}
          onChange={e => setFilter({...filter, name: e.target.value})}
        />
        <input 
          type="text" 
          placeholder="Matrícula/CPF..." 
          className="px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-semibold"
          value={filter.matricula}
          onChange={e => setFilter({...filter, matricula: e.target.value})}
        />
        <select 
          className="px-4 py-3 rounded-xl border border-slate-200 text-slate-800 font-semibold"
          value={filter.status}
          onChange={e => setFilter({...filter, status: e.target.value})}
        >
          <option value="">Status (Todos)</option>
          <option value="Elegível">Elegível</option>
          <option value="Inapto">Inapto</option>
        </select>
      </div>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#002d5a] text-white">
              <tr>
                <th className="px-6 py-4 text-[10px] font-black uppercase">Matrícula</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase">Nome</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase">Admissão</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase">Elegibilidade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map((member, idx) => (
                <tr key={`${member.id}-${idx}`} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-blue-700">{member.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-800">{member.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{member.cargo}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-slate-500">{member.admissao}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${
                      member.elegibilidade.toLowerCase().includes('elegível') || member.elegibilidade.toLowerCase().includes('ativo')
                      ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {member.elegibilidade}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
