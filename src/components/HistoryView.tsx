import { useState } from 'react';
import { AuditLog } from '../types';
import { History, Search, Filter } from 'lucide-react';

interface HistoryViewProps {
  logs: AuditLog[];
}

export default function HistoryView({ logs }: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterUser, setFilterUser] = useState('all');

  // Extrair usuários únicos para o filtro
  const uniqueUsers = Array.from(new Set(logs.map(log => log.user)));

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesUser = filterUser === 'all' || log.user === filterUser;

    return matchesSearch && matchesUser;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR');
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-12">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <History className="w-7 h-7 text-emerald-500" />
            Histórico de Ações
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Auditoria e registro de alterações feitas no sistema.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            placeholder="Buscar por ação ou detalhe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="w-full md:w-64 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-500" />
          </div>
          <select
            className="block w-full pl-10 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-emerald-500 appearance-none"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          >
            <option value="all">Todos os usuários</option>
            {uniqueUsers.map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs uppercase bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 font-bold">Data / Hora</th>
                <th className="px-6 py-4 font-bold">Usuário</th>
                <th className="px-6 py-4 font-bold">Ação</th>
                <th className="px-6 py-4 font-bold">Detalhes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredLogs.length > 0 ? (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-3 whitespace-nowrap text-slate-400 text-xs">
                      {formatDate(log.timestamp)}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-bold capitalize border border-slate-700">
                        {log.user}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-semibold text-emerald-400">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-300">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                    Nenhum registro encontrado com estes filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
