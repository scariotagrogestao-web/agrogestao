import React, { useState } from 'react';
import { 
  Tractor, 
  Users, 
  Landmark, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Search,
  AlertTriangle 
} from 'lucide-react';
import { ClientOrVehicle } from '../types';
import { Area, Motorista } from '../types/agro';

interface RegistriesViewProps {
  clientsAndVehicles: ClientOrVehicle[];
  onAddVehicle: (item: ClientOrVehicle) => void;
  onEditVehicle: (item: ClientOrVehicle) => void;
  onDeleteVehicle: (id: string) => void;
  
  areas: Area[];
  onAddArea: (item: Area) => void;
  onEditArea: (item: Area) => void;
  onDeleteArea: (id: string) => void;

  motoristas: Motorista[];
  onAddMotorista: (item: Motorista) => void;
  onEditMotorista: (item: Motorista) => void;
  onDeleteMotorista: (id: string) => void;
}

type SubTab = 'vehicles' | 'areas' | 'drivers';

export default function RegistriesView({
  clientsAndVehicles,
  onAddVehicle,
  onEditVehicle,
  onDeleteVehicle,
  
  areas,
  onAddArea,
  onEditArea,
  onDeleteArea,

  motoristas,
  onAddMotorista,
  onEditMotorista,
  onDeleteMotorista
}: RegistriesViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>('vehicles');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / Form States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Generic Error State
  const [formError, setFormError] = useState('');

  // 1. Form States for Vehicles/Machines
  const [vName, setVName] = useState('');
  const [vType, setVType] = useState<'Máquina' | 'Caminhão' | 'Cliente/Setor'>('Máquina');
  const [vDetails, setVDetails] = useState('');
  const [vFleet, setVFleet] = useState('');
  const [vResp, setVResp] = useState('');
  const [vRate, setVRate] = useState('');

  // 2. Form States for Areas/Fazendas
  const [aName, setAName] = useState('');
  const [aCulture, setACulture] = useState('Silagem');
  const [aSize, setASize] = useState('');

  // 3. Form States for Drivers/Funcionários
  const [dName, setDName] = useState('');
  const [dRate, setDRate] = useState('');
  const [dStatus, setDStatus] = useState<'Ativo' | 'Inativo'>('Ativo');

  // Open Add Modals
  const openAddModal = () => {
    setFormError('');
    setEditingId(null);
    
    // Clear all forms
    setVName(''); setVType('Máquina'); setVDetails(''); setVFleet(''); setVResp(''); setVRate('');
    setAName(''); setACulture('Silagem'); setASize('');
    setDName(''); setDRate(''); setDStatus('Ativo');

    setIsModalOpen(true);
  };

  // Open Edit Modals
  const openEditModal = (item: any) => {
    setFormError('');
    setEditingId(item.id);

    if (activeSubTab === 'vehicles') {
      const v = item as ClientOrVehicle;
      setVName(v.name);
      setVType(v.type);
      setVDetails(v.details || '');
      setVFleet(v.plateOrFleet || '');
      setVResp(v.responsible || '');
      setVRate(v.rate ? v.rate.toString() : '');
    } else if (activeSubTab === 'areas') {
      const a = item as Area;
      setAName(a.name);
      setACulture(a.culture);
      setASize(a.sizeHectares.toString());
    } else if (activeSubTab === 'drivers') {
      const d = item as Motorista;
      setDName(d.name);
      setDRate(d.ratePerHectare.toString());
      setDStatus(d.status);
    }

    setIsModalOpen(true);
  };

  // Handle Form submit
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (activeSubTab === 'vehicles') {
      if (!vName.trim()) { setFormError('O nome do veículo é obrigatório.'); return; }
      const parsedRate = parseFloat(vRate) || 0;

      const vehicleData: ClientOrVehicle = {
        id: editingId || `V${(clientsAndVehicles.length + 1).toString().padStart(2, '0')}_${Date.now().toString().slice(-4)}`,
        name: vName.trim(),
        type: vType,
        details: vDetails.trim(),
        plateOrFleet: vFleet.trim(),
        responsible: vResp.trim(),
        status: 'Ativo',
        rate: parsedRate
      };

      if (editingId) {
        onEditVehicle(vehicleData);
      } else {
        onAddVehicle(vehicleData);
      }
    } 
    
    else if (activeSubTab === 'areas') {
      if (!aName.trim()) { setFormError('O nome da fazenda é obrigatório.'); return; }
      if (!aCulture.trim()) { setFormError('A cultura plantada é obrigatória.'); return; }
      const parsedSize = parseFloat(aSize) || 0;
      if (parsedSize <= 0) { setFormError('O tamanho da área deve ser maior que zero.'); return; }

      const areaData: Area = {
        id: editingId || `A${(areas.length + 1).toString().padStart(2, '0')}_${Date.now().toString().slice(-4)}`,
        name: aName.trim(),
        culture: aCulture.trim(),
        sizeHectares: parsedSize
      };

      if (editingId) {
        onEditArea(areaData);
      } else {
        onAddArea(areaData);
      }
    } 
    
    else if (activeSubTab === 'drivers') {
      if (!dName.trim()) { setFormError('O nome do funcionário é obrigatório.'); return; }
      const parsedRate = parseFloat(dRate) || 0;
      if (parsedRate <= 0) { setFormError('A taxa de pagamento por hectare deve ser maior que zero.'); return; }

      const driverData: Motorista = {
        id: editingId || `M${(motoristas.length + 1).toString().padStart(2, '0')}_${Date.now().toString().slice(-4)}`,
        name: dName.trim(),
        ratePerHectare: parsedRate,
        status: dStatus
      };

      if (editingId) {
        onEditMotorista(driverData);
      } else {
        onAddMotorista(driverData);
      }
    }

    setIsModalOpen(false);
    showNotification('Cadastro salvo com sucesso!');
  };

  const showNotification = (msg: string) => {
    alert(msg);
  };

  // Filter lists based on Search Query
  const filteredVehicles = clientsAndVehicles.filter(v => 
    !searchQuery || 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.responsible.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAreas = areas.filter(a => 
    !searchQuery || 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.culture.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDrivers = motoristas.filter(m => 
    !searchQuery || 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 fade-in">
      
      {/* Page Header */}
      <div className="flex justify-between items-center flex-wrap gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Painel de Cadastros Gerais</h2>
          <p className="text-xs text-slate-500 mt-1">Gerencie a frota de maquinários, fazendas de atuação e equipes de operadores.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-[#002046] hover:bg-[#0f3a6a] text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Registro</span>
        </button>
      </div>

      {/* Sub Tabs Selector */}
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap justify-between items-center gap-4 shrink-0">
        <div className="flex gap-1.5">
          <button
            onClick={() => { setActiveSubTab('vehicles'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'vehicles'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Tractor className="w-4 h-4" />
            <span>Veículos e Máquinas ({clientsAndVehicles.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('areas'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'areas'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>Áreas e Fazendas ({areas.length})</span>
          </button>

          <button
            onClick={() => { setActiveSubTab('drivers'); setSearchQuery(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeSubTab === 'drivers'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Funcionários e Motoristas ({motoristas.length})</span>
          </button>
        </div>

        {/* Local Search Input */}
        <div className="relative w-full sm:w-60">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder={`Buscar em ${activeSubTab === 'vehicles' ? 'Veículos...' : activeSubTab === 'areas' ? 'Fazendas...' : 'Funcionários...'}`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs w-full outline-none placeholder:text-slate-400 focus:border-emerald-600 text-slate-700 font-semibold"
          />
        </div>
      </div>

      {/* Lists Tables Grid */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex-1 flex flex-col min-h-[400px]">
        <div className="overflow-x-auto flex-1">
          
          {/* 1. Vehicles List */}
          {activeSubTab === 'vehicles' && (
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 w-24">ID</th>
                  <th className="py-3.5 px-4">Nome da Máquina</th>
                  <th className="py-3.5 px-4 w-32 text-center">Tipo</th>
                  <th className="py-3.5 px-4">Detalhes</th>
                  <th className="py-3.5 px-4 w-40">Frota / Placa</th>
                  <th className="py-3.5 px-4">Operador Padrão</th>
                  <th className="py-3.5 px-4 text-right w-36">Tarifa Horímetro</th>
                  <th className="py-3.5 px-4 text-center w-24">Ações</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                {filteredVehicles.map((v, idx) => {
                  const bg = idx % 2 === 1 ? '#fdf9f0' : '#ffffff';
                  return (
                    <tr key={v.id} style={{ backgroundColor: bg }} className="hover:opacity-95 transition-opacity">
                      <td className="py-3 px-4 font-mono text-slate-400 font-bold">{v.id}</td>
                      <td className="py-3 px-4 font-bold text-[#002046]">{v.name}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`badge ${v.type === 'Máquina' ? 'badge-green' : v.type === 'Caminhão' ? 'badge-blue' : 'badge-amber'}`}>
                          {v.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">{v.details}</td>
                      <td className="py-3 px-4 font-mono">{v.plateOrFleet || '—'}</td>
                      <td className="py-3 px-4 font-semibold">{v.responsible || '—'}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        {v.rate ? `R$ ${v.rate.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/h` : '—'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1.5 justify-center">
                          <button
                            onClick={() => openEditModal(v)}
                            className="text-[#002046] hover:text-emerald-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar veículo"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja realmente excluir a máquina "${v.name}"?`)) onDeleteVehicle(v.id);
                            }}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remover veículo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredVehicles.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400 font-bold">Nenhum veículo correspondente encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* 2. Areas List */}
          {activeSubTab === 'areas' && (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 w-28">ID Área</th>
                  <th className="py-3.5 px-4">Nome da Fazenda / Talhão</th>
                  <th className="py-3.5 px-4">Cultura Plantada</th>
                  <th className="py-3.5 px-4 text-right w-44">Tamanho da Área</th>
                  <th className="py-3.5 px-4 text-center w-24">Ações</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                {filteredAreas.map((a, idx) => {
                  const bg = idx % 2 === 1 ? '#fdf9f0' : '#ffffff';
                  return (
                    <tr key={a.id} style={{ backgroundColor: bg }} className="hover:opacity-95 transition-opacity">
                      <td className="py-3 px-4 font-mono text-slate-400 font-bold">{a.id}</td>
                      <td className="py-3 px-4 font-bold text-[#0c4a23]">{a.name}</td>
                      <td className="py-3 px-4">
                        <span className="badge badge-blue">{a.culture}</span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                        {a.sizeHectares.toLocaleString('pt-BR')} ha
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1.5 justify-center">
                          <button
                            onClick={() => openEditModal(a)}
                            className="text-[#002046] hover:text-emerald-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar área"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja excluir a área "${a.name}"?`)) onDeleteArea(a.id);
                            }}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remover área"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredAreas.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">Nenhuma fazenda cadastrada correspondente.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {/* 3. Drivers List */}
          {activeSubTab === 'drivers' && (
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3.5 px-4 w-28">ID Cadastro</th>
                  <th className="py-3.5 px-4">Nome do Funcionário / Operador</th>
                  <th className="py-3.5 px-4 w-36 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right w-52">Tarifa Pagamento (por Hectare)</th>
                  <th className="py-3.5 px-4 text-center w-24">Ações</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                {filteredDrivers.map((d, idx) => {
                  const bg = idx % 2 === 1 ? '#fdf9f0' : '#ffffff';
                  return (
                    <tr key={d.id} style={{ backgroundColor: bg }} className="hover:opacity-95 transition-opacity">
                      <td className="py-3 px-4 font-mono text-slate-400 font-bold">{d.id}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">{d.name}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`badge ${d.status === 'Ativo' ? 'badge-green' : 'badge-gray'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-800">
                        R$ {d.ratePerHectare.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}/ha
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex gap-1.5 justify-center">
                          <button
                            onClick={() => openEditModal(d)}
                            className="text-[#002046] hover:text-emerald-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Editar funcionário"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Deseja excluir o motorista "${d.name}"?`)) onDeleteMotorista(d.id);
                            }}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Remover funcionário"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredDrivers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-slate-400 font-bold">Nenhum funcionário encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dynamic Pop-up Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            <div className="bg-[#002046] text-white px-5 py-4 flex justify-between items-center">
              <h3 className="font-display text-sm font-bold">
                {editingId ? '✏️ Editar' : '＋ Adicionar'} {activeSubTab === 'vehicles' ? 'Veículo / Máquina' : activeSubTab === 'areas' ? 'Fazenda / Área' : 'Operador / Motorista'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/80 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700 font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* A. Vehicles Sub-Form Fields */}
              {activeSubTab === 'vehicles' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nome *</label>
                      <input
                        type="text"
                        value={vName}
                        onChange={(e) => setVName(e.target.value)}
                        placeholder="Ex: JD7250"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tipo *</label>
                      <select
                        value={vType}
                        onChange={(e) => setVType(e.target.value as any)}
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                        required
                      >
                        <option value="Máquina">Máquina</option>
                        <option value="Caminhão">Caminhão</option>
                        <option value="Cliente/Setor">Cliente / Setor / Motorista</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Detalhes / Descrição</label>
                    <input
                      type="text"
                      value={vDetails}
                      onChange={(e) => setVDetails(e.target.value)}
                      placeholder="Ex: Trator John Deere Silagem"
                      className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Frota / Placa</label>
                      <input
                        type="text"
                        value={vFleet}
                        onChange={(e) => setVFleet(e.target.value)}
                        placeholder="Ex: FROTA-12"
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Motorista / Responsável</label>
                      <input
                        type="text"
                        value={vResp}
                        onChange={(e) => setVResp(e.target.value)}
                        placeholder="Ex: Rogério, Marcos, Ramos..."
                        className="w-full border border-slate-200 rounded-lg p-2 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tarifa Horímetro Padrão (R$ / hora)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={vRate}
                      onChange={(e) => setVRate(e.target.value)}
                      placeholder="Ex: 800.00"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                    />
                  </div>
                </>
              )}

              {/* B. Areas Sub-Form Fields */}
              {activeSubTab === 'areas' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nome da Fazenda / Área *</label>
                    <input
                      type="text"
                      value={aName}
                      onChange={(e) => setAName(e.target.value)}
                      placeholder="Ex: Fazenda Santa Maria"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Cultura Cultivada *</label>
                      <input
                        type="text"
                        value={aCulture}
                        onChange={(e) => setACulture(e.target.value)}
                        placeholder="Ex: Milho, Soja, Algodão..."
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Área Total (Hectares) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={aSize}
                        onChange={(e) => setASize(e.target.value)}
                        placeholder="Ex: 120"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* C. Drivers Sub-Form Fields */}
              {activeSubTab === 'drivers' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nome Completo do Operador *</label>
                    <input
                      type="text"
                      value={dName}
                      onChange={(e) => setDName(e.target.value)}
                      placeholder="Ex: Marcos Silva"
                      className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tarifa Pagamento (R$ / Hectare) *</label>
                      <input
                        type="number"
                        step="0.01"
                        value={dRate}
                        onChange={(e) => setDRate(e.target.value)}
                        placeholder="Ex: 60.00"
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">Status de Atividade *</label>
                      <select
                        value={dStatus}
                        onChange={(e) => setDStatus(e.target.value as any)}
                        className="w-full border border-slate-200 rounded-lg p-2.5 text-xs bg-slate-50 outline-none focus:ring-1 focus:ring-emerald-600 cursor-pointer"
                        required
                      >
                        <option value="Ativo">Ativo</option>
                        <option value="Inativo">Inativo</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Gravar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
