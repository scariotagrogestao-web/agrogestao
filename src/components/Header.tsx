import { Search, Bell, HelpCircle, LayoutDashboard, Users, Tractor, Receipt, Settings, Scale, FileText, Sprout, LogOut, History } from 'lucide-react';
import logoImg from '../logo_agrogestao.png';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: string;
  onNavigate: (view: string) => void;
  placeholder?: string;
  isAdmin: boolean;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'registries', label: 'Cadastros', icon: Users },
  { id: 'hours', label: 'Horas-Máquina', icon: Tractor },
  { id: 'production', label: 'Lançar Produção', icon: Scale },
  { id: 'payments', label: 'Relatórios', icon: FileText },
  { id: 'safraDashboard', label: 'Métricas de Safra', icon: Sprout },
  { id: 'expenses', label: 'Controle de Gastos', icon: Receipt },
  { id: 'history', label: 'Histórico', icon: History },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Header({ 
  searchQuery, 
  onSearchChange, 
  currentView,
  onNavigate,
  placeholder = "Buscar registros...",
  isAdmin,
  onLogout
}: HeaderProps) {
  // Hide settings and history if the user is not admin
  const filteredMenuItems = isAdmin 
    ? menuItems 
    : menuItems.filter(item => item.id !== 'settings' && item.id !== 'history');
  return (
    <header className="h-[72px] bg-gradient-to-b from-slate-900 to-slate-950 border-b border-black flex justify-between items-center px-8 w-full sticky top-0 z-40 shadow-[0_4px_15px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] shrink-0">
      {/* Brand Logo / Identity */}
      <div className="flex items-center mr-6 shrink-0 select-none">
        <img 
          src={logoImg} 
          alt="AgroGestão Logo" 
          style={{ height: '52px' }}
          className="w-auto object-contain brightness-110 contrast-105 rounded-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]" 
        />
      </div>

      {/* Center Horizontal Menu Navigation Tabs */}
      <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
        {filteredMenuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-3 py-1.5 flex items-center gap-1.5 rounded-lg font-sans text-[10px] tracking-wider uppercase font-bold transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                isActive
                  ? 'bg-gradient-to-b from-emerald-600 to-emerald-800 text-white border-emerald-900 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_2px_4px_rgba(0,0,0,0.4)]'
                  : 'bg-transparent text-slate-400 border-transparent hover:text-slate-200 hover:bg-slate-800 hover:border-slate-700 hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.2)]'
              }`}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]' : ''}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Action icons */}
        <button 
          onClick={() => alert('Não há novas notificações.')}
          className="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-900 transition-colors relative border-none bg-transparent"
        >
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-red-500"></span>
        </button>

        <div className="h-6 w-[1px] bg-slate-800 mx-1"></div>

        <button 
          onClick={() => {
            if (confirm('Deseja encerrar a sessão?')) {
              onLogout();
            }
          }}
          className="flex items-center gap-2 hover:bg-slate-900 p-1.5 rounded-lg transition-colors cursor-pointer border-none bg-transparent"
          title="Clique para Sair / Desconectar"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs select-none">
            {isAdmin ? 'AD' : 'AN'}
          </div>
          <span className="text-[10px] font-bold text-slate-300 mr-2 capitalize">
            {isAdmin ? 'Admin' : 'Anderson'}
          </span>
          <LogOut className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </header>
  );
}
