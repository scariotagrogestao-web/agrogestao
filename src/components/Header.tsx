import { Search, Bell, HelpCircle, LayoutDashboard, Users, Tractor, Receipt, Settings, Scale, FileText, Sprout } from 'lucide-react';
import logoImg from '../AgroGestao_logotipo.png';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  currentView: string;
  onNavigate: (view: string) => void;
  placeholder?: string;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'registries', label: 'Cadastros', icon: Users },
  { id: 'hours', label: 'Horas-Máquina', icon: Tractor },
  { id: 'production', label: 'Lançar Produção', icon: Scale },
  { id: 'payments', label: 'Relatórios', icon: FileText },
  { id: 'safraDashboard', label: 'Métricas de Safra', icon: Sprout },
  { id: 'expenses', label: 'Controle de Gastos', icon: Receipt },
  { id: 'settings', label: 'Configurações', icon: Settings },
];

export default function Header({ 
  searchQuery, 
  onSearchChange, 
  currentView,
  onNavigate,
  placeholder = "Buscar registros..." 
}: HeaderProps) {
  return (
    <header className="h-[72px] bg-slate-950 border-b border-slate-800 flex justify-between items-center px-8 w-full sticky top-0 z-40 shadow-sm shrink-0">
      {/* Brand Logo / Identity */}
      <div className="flex items-center mr-6 shrink-0 select-none">
        <img 
          src={logoImg} 
          alt="AgroGestão Logo" 
          className="h-10 w-auto object-contain brightness-100 dark:brightness-110" 
        />
      </div>

      {/* Center Horizontal Menu Navigation Tabs */}
      <nav className="hidden lg:flex items-center gap-1.5 flex-1 justify-center">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`px-4 py-2 flex items-center gap-2 rounded-lg font-sans text-[10px] tracking-wider uppercase font-bold transition-all duration-200 cursor-pointer border-none bg-transparent ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Right User Actions & Search */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative focus-within:ring-2 focus-within:ring-emerald-700/20 rounded-lg transition-all duration-200">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="pl-10 pr-4 py-2 bg-slate-900 border-none rounded-lg text-xs font-sans w-52 focus:outline-none placeholder:text-slate-500 text-slate-100"
          />
        </div>

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
          onClick={() => alert('Perfil: agromec.contato@gmail.com')}
          className="flex items-center gap-2 hover:bg-slate-900 p-1.5 rounded-full transition-colors cursor-pointer border-none bg-transparent"
        >
          <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-xs">
            AG
          </div>
        </button>
      </div>
    </header>
  );
}
