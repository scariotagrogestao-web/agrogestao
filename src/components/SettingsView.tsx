// src/components/SettingsView.tsx
import React, { useState } from 'react';
import { Download, Upload, Database, Trash2, User, Plus } from 'lucide-react';

interface SettingsViewProps {
  customUsers: { username: string; password: string }[];
  setCustomUsers: React.Dispatch<React.SetStateAction<{ username: string; password: string }[]>>;
  handleExportData: () => void;
  handleImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAdmin: boolean;
}

export default function SettingsView({ customUsers, setCustomUsers, handleExportData, handleImportData, isAdmin }: SettingsViewProps) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userError, setUserError] = useState('');

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserError('');
    const uClean = newUsername.trim().toLowerCase();
    const pClean = newPassword.trim();
    if (!uClean || !pClean) {
      setUserError('Preencha todos os campos.');
      return;
    }
    if (uClean === 'admin') {
      setUserError('O usuário "admin" já existe e é reservado.');
      return;
    }
    if (customUsers.some(u => u.username.toLowerCase() === uClean)) {
      setUserError('Este usuário já existe.');
      return;
    }
    setCustomUsers(prev => [...prev, { username: uClean, password: pClean }]);
    setNewUsername('');
    setNewPassword('');
    alert(`Usuário "${uClean}" criado com sucesso!`);
  };

  const handleDeleteUser = (usernameToDelete: string) => {
    if (usernameToDelete.toLowerCase() === 'anderson') {
      alert('O usuário "anderson" não pode ser excluído.');
      return;
    }
    if (confirm(`Deseja remover o acesso do usuário "${usernameToDelete}"?`)) {
      setCustomUsers(prev => prev.filter(u => u.username.toLowerCase() !== usernameToDelete.toLowerCase()));
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-8 text-slate-100">
      {/* Backup & Export Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2 text-emerald-400">
          <Database className="w-5 h-5" /> Configurações do Sistema
        </h2>
        <p className="text-xs text-slate-400">Gerencie a persistência dos dados e backups do AgroGestão.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-700">
          {/* Export */}
          <div className="border border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">📥 Backup & Exportação</h3>
            <p className="text-xs text-slate-400">Exportar todos os dados locais em JSON.</p>
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
            >
              <Download className="w-4 h-4" /> Exportar Dados
            </button>
          </div>
          {/* Import */}
          <div className="border border-slate-700 rounded-lg p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500">📤 Importação de Backup</h3>
            <p className="text-xs text-slate-400">Restaurar informações a partir de um arquivo JSON.</p>
            <label className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-slate-200 rounded cursor-pointer hover:bg-slate-700 transition">
              <Upload className="w-4 h-4" /> Selecionar Backup JSON
              <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
            </label>
          </div>
        </div>
      </section>

{isAdmin && (
        <section className="space-y-4">
          <h3 className="text-sm font-bold uppercase text-slate-500">👥 Gerenciamento de Usuários</h3>
          <p className="text-xs text-slate-400">Somente o administrador pode criar ou remover usuários.</p>
          {/* List existing users */}
          <ul className="space-y-2">
            {customUsers.map(user => (
              <li key={user.username} className="flex items-center justify-between bg-slate-800 rounded px-3 py-2">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm capitalize">{user.username}</span>
                </span>
                <button
                  onClick={() => handleDeleteUser(user.username)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-400"
                  title="Remover usuário"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </li>
            ))}
          </ul>
          {/* Form to add new user */}
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1">Nome de usuário</label>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="ex: novoUser"
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:border-emerald-600 text-sm"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1">Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 bg-slate-800 border border-slate-700 rounded focus:outline-none focus:border-emerald-600 text-sm"
                required
              />
            </div>
            <div className="col-span-1">
              <button
                type="submit"
                className="flex items-center gap-1 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition"
              >
                <Plus className="w-4 h-4" /> Criar Usuário
              </button>
            </div>
            {userError && (
              <p className="col-span-3 text-xs text-red-400 mt-1">{userError}</p>
            )}
          </form>
        </section>
      )}
    </div>
  );
}
