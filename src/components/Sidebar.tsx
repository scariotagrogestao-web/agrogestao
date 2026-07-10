import { 
  LayoutDashboard, 
  Users, 
  Tractor, 
  Receipt, 
  Plus, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onQuickAction: () => void;
}

export default function Sidebar({ currentView, onNavigate, onQuickAction }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes e Veículos', icon: Users },
    { id: 'expenses', label: 'Controle de Gastos', icon: Receipt },
    { id: 'hours', label: 'Horas-Máquina', icon: Tractor },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-[#002046] flex flex-col py-6 border-r border-slate-700/30 z-50 text-white">
      {/* Brand */}
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-[#d6e3ff] flex items-center justify-center">
          <Tractor className="text-[#002046] w-6 h-6" />
        </div>
        <div>
          <h1 className="font-display text-[18px] font-bold text-[#d6e3ff] leading-tight">AgroGestion ERP</h1>
          <p className="text-xs text-white/70">Administrador</p>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 flex flex-col gap-1 px-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left mx-2 my-1 px-4 py-3 flex items-center gap-3 rounded-lg font-sans text-xs tracking-wider uppercase font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-[#d5e0f7] text-[#002046] font-bold scale-[0.98]'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Launch CTA */}
      <div className="px-4 mb-4">
        <button 
          onClick={onQuickAction}
          className="w-full bg-[#d6e3ff] text-[#002046] font-semibold text-xs tracking-wider uppercase py-3 rounded-lg hover:bg-[#aec7f7] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Lançamento</span>
        </button>
      </div>

      {/* Footer Navigation */}
      <div className="mt-auto px-2 flex flex-col gap-1 border-t border-slate-700/30 pt-4">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full text-left mx-2 my-1 px-4 py-3 flex items-center gap-3 rounded-lg font-sans text-xs tracking-wider uppercase font-semibold transition-colors duration-200 ${
            currentView === 'settings'
              ? 'bg-[#d5e0f7] text-[#002046] font-bold'
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
        >
          <Settings className="w-5 h-5 shrink-0" />
          <span>Configurações</span>
        </button>
        <button
          onClick={() => {
            if (confirm('Deseja realmente sair?')) {
              alert('Sessão encerrada com sucesso!');
            }
          }}
          className="w-full text-left mx-2 my-1 px-4 py-3 flex items-center gap-3 rounded-lg font-sans text-xs tracking-wider uppercase font-semibold text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
}
