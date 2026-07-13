// src/components/SettingsView.tsx
import React, { useState } from 'react';
import { Download, Upload, Database, Trash2, User, Plus } from 'lucide-react';

export interface CustomUser {
  username: string;
  password: string;
  role?: 'admin' | 'user';
}

interface SettingsViewProps {
  customUsers: CustomUser[];
  setCustomUsers: React.Dispatch<React.SetStateAction<CustomUser[]>>;
  handleExportData: () => void;
  handleImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAdmin: boolean;
}

export default function SettingsView({ customUsers, setCustomUsers, handleExportData, handleImportData, isAdmin }: SettingsViewProps) {
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState<'admin' | 'user'>('user');
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
    setCustomUsers(prev => [...prev, { username: uClean, password: pClean, role: newUserRole }]);
    setNewUsername('');
    setNewPassword('');
    setNewUserRole('user');
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

  const handleToggleRole = (usernameToToggle: string, currentRole: string | undefined) => {
    if (usernameToToggle.toLowerCase() === 'anderson') {
      alert('A permissão do usuário "anderson" não pode ser alterada.');
      return;
    }
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (confirm(`Deseja alterar a permissão de "${usernameToToggle}" para ${newRole === 'admin' ? 'Administrador' : 'Usuário Normal'}?`)) {
      setCustomUsers(prev => prev.map(u => u.username.toLowerCase() === usernameToToggle.toLowerCase() ? { ...u, role: newRole } : u));
    }
  };

  const handleChangePassword = (usernameToChange: string) => {
    const newPass = prompt(`Digite a nova senha para o usuário "${usernameToChange}":`);
    if (newPass !== null) {
      if (newPass.trim() === '') {
        alert('A senha não pode ser vazia.');
        return;
      }
      setCustomUsers(prev => prev.map(u => u.username.toLowerCase() === usernameToChange.toLowerCase() ? { ...u, password: newPass.trim() } : u));
      alert(`Senha do usuário "${usernameToChange}" alterada com sucesso!`);
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
          <p className="text-xs text-slate-400">Somente o administrador pode criar ou remover usuários, bem como alterar senhas e permissões.</p>
          {/* List existing users */}
          <ul className="space-y-2">
            {customUsers.map(user => (
              <li key={user.username} className="flex flex-col md:flex-row md:items-center justify-between bg-slate-800 rounded px-3 py-2 gap-3">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm capitalize font-bold">{user.username}</span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wider ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-700 text-slate-300'}`}>
                    {user.role === 'admin' ? 'Admin' : 'Normal'}
                  </span>
                </span>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <button
                    onClick={() => handleChangePassword(user.username)}
                    className="text-xs text-slate-400 hover:text-emerald-400 underline decoration-slate-600 underline-offset-2 transition-colors"
                  >
                    Alterar Senha
                  </button>
                  <button
                    onClick={() => handleToggleRole(user.username, user.role)}
                    className="text-xs text-slate-400 hover:text-emerald-400 underline decoration-slate-600 underline-offset-2 transition-colors"
                  >
                    Mudar Permissão
                  </button>
                  <button
                    onClick={() => handleDeleteUser(user.username)}
                    className="flex items-center gap-1 text-red-500 hover:text-red-400 ml-2"
                    title="Remover usuário"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {/* Form to add new user */}
          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1 font-bold">Nome de usuário</label>
              <input
                type="text"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
                placeholder="ex: novoUser"
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded focus:outline-none focus:border-emerald-600 text-sm font-medium"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1 font-bold">Senha</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded focus:outline-none focus:border-emerald-600 text-sm font-medium"
                required
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs text-slate-400 mb-1 font-bold">Permissão</label>
              <select
                value={newUserRole}
                onChange={e => setNewUserRole(e.target.value as 'admin' | 'user')}
                className="w-full p-2 bg-slate-900 border border-slate-700 rounded focus:outline-none focus:border-emerald-600 text-sm font-medium"
              >
                <option value="user">Usuário Normal</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div className="col-span-1">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1 px-4 py-2 bg-emerald-600 font-bold text-white rounded hover:bg-emerald-700 transition"
              >
                <Plus className="w-4 h-4" /> Criar Usuário
              </button>
            </div>
            {userError && (
              <p className="col-span-1 md:col-span-4 text-xs font-bold text-red-400 mt-1">{userError}</p>
            )}
          </form>
        </section>
      )}
    </div>
  );
}
