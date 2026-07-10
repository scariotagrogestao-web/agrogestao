import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Download, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { ClientOrVehicle } from '../types';

interface ClientsVehiclesViewProps {
  items: ClientOrVehicle[];
  onAdd: (item: ClientOrVehicle) => void;
  onEdit: (item: ClientOrVehicle) => void;
  onDelete: (id: string) => void;
  onExport: () => void;
}

export default function ClientsVehiclesView({ 
  items, 
  onAdd, 
  onEdit, 
  onDelete,
  onExport 
}: ClientsVehiclesViewProps) {
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [typeFilter, setTypeFilter] = useState('Todos');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ClientOrVehicle | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'Máquina' | 'Caminhão' | 'Cliente/Setor'>('Máquina');
  const [formDetails, setFormDetails] = useState('');
  const [formPlateOrFleet, setFormPlateOrFleet] = useState('');
  const [formResponsible, setFormResponsible] = useState('');
  const [formStatus, setFormStatus] = useState<'Ativo' | 'Inativo' | 'Manutenção'>('Ativo');
  const [formRate, setFormRate] = useState('');
  const [formError, setFormError] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Reset Form
  const resetForm = (item?: ClientOrVehicle) => {
    if (item) {
      setEditingItem(item);
      setFormId(item.id);
      setFormName(item.name);
      setFormType(item.type);
      setFormDetails(item.details);
      setFormPlateOrFleet(item.plateOrFleet);
      setFormResponsible(item.responsible);
      setFormStatus(item.status);
      setFormRate(item.rate !== undefined ? item.rate.toString() : '');
    } else {
      setEditingItem(null);
      // Auto-generate ID
      const nextIdNum = Math.max(...items.map(i => {
        const parsed = parseInt(i.id);
        return isNaN(parsed) ? 0 : parsed;
      }), 0) + 1;
      setFormId(nextIdNum.toString().padStart(3, '0'));
      setFormName('');
      setFormType('Máquina');
      setFormDetails('');
      setFormPlateOrFleet('');
      setFormResponsible('');
      setFormStatus('Ativo');
      setFormRate('');
    }
    setFormError('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: ClientOrVehicle) => {
    resetForm(item);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('O Nome/Máquina é obrigatório.');
      return;
    }

    const payload: ClientOrVehicle = {
      id: formId,
      name: formName.trim(),
      type: formType,
      details: formDetails.trim() || '-',
      plateOrFleet: formPlateOrFleet.trim() || '-',
      responsible: formResponsible.trim() || '-',
      status: formStatus,
      rate: (formType === 'Máquina' || formType === 'Caminhão') && formRate.trim() ? parseFloat(formRate) : undefined
    };

    if (editingItem) {
      onEdit(payload);
    } else {
      // Check if ID already exists
      if (items.some(i => i.id === payload.id)) {
        setFormError(`O ID ${payload.id} já está em uso.`);
        return;
      }
      onAdd(payload);
    }
    setIsModalOpen(false);
  };

  const handleDeleteItem = (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja remover "${name}"?`)) {
      onDelete(id);
    }
  };

  // Filter & Search Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Search matches
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        item.id.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.details.toLowerCase().includes(query) ||
        item.plateOrFleet.toLowerCase().includes(query) ||
        item.responsible.toLowerCase().includes(query);

      // Status matches
      const matchesStatus = 
        statusFilter === 'Todos' || 
        (statusFilter === 'Ativos' && item.status === 'Ativo') ||
        (statusFilter === 'Inativos' && item.status === 'Inativo') ||
        (statusFilter === 'Manutenção' && item.status === 'Manutenção');

      // Type matches
      const matchesType =
        typeFilter === 'Todos' ||
        (typeFilter === 'Máquina/Trator' && item.type === 'Máquina') ||
        (typeFilter === 'Caminhão' && item.type === 'Caminhão') ||
        (typeFilter === 'Cliente/Responsável' && item.type === 'Cliente/Setor');

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [items, searchQuery, statusFilter, typeFilter]);

  // Paginated Items
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;

  // Badges styling
  const getStatusBadge = (status: 'Ativo' | 'Inativo' | 'Manutenção') => {
    switch (status) {
      case 'Ativo':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#dcfce7] text-[#14532d] border border-[#bbf7d0]">
            Ativo
          </span>
        );
      case 'Manutenção':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#f3f4f6] text-[#374151] border border-[#e5e7eb]">
            Manutenção
          </span>
        );
      case 'Inativo':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#fee2e2] text-[#991b1b] border border-[#fca5a5]">
            Inativo
          </span>
        );
    }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto bg-slate-50 relative flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#002046] mb-2">Clientes e Veículos</h1>
          <p className="text-sm text-slate-500">
            Gerencie o cadastro de clientes, máquinas e responsáveis para vinculação nas planilhas de horas e despesas.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={onExport}
            className="border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span>Exportar</span>
          </button>
          <button 
            onClick={handleOpenAddModal}
            className="bg-[#002046] text-white hover:bg-[#1b365d] px-4 py-2 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-xs shrink-0">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Filtrar por nome, placa ou ID..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:border-[#002046] focus:ring-1 focus:ring-[#002046] outline-none transition-all text-slate-800 placeholder:text-slate-400"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">Status:</span>
          <select 
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-[#002046] focus:ring-1 focus:ring-[#002046] outline-none w-full md:w-auto"
          >
            <option>Todos</option>
            <option>Ativos</option>
            <option>Inativos</option>
            <option>Manutenção</option>
          </select>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 whitespace-nowrap">Tipo:</span>
          <select 
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:border-[#002046] focus:ring-1 focus:ring-[#002046] outline-none w-full md:w-auto"
          >
            <option>Todos</option>
            <option>Máquina/Trator</option>
            <option>Caminhão</option>
            <option>Cliente/Responsável</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex-1 flex flex-col shadow-xs min-h-[350px]">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-400 w-16">ID</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Nome / Máquina</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tipo</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Modelo / Detalhes</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Placa / Frota ID</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Motorista / Responsável</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Tarifa (R$/hora)</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="py-3.5 px-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right w-24">Ações</th>
              </tr>
            </thead>
            <tbody className="text-sm text-slate-700 divide-y divide-slate-100">
              {paginatedItems.map((item, index) => {
                const bg = index % 2 === 1 ? '#fdf9f0' : '#ffffff';
                return (
                  <tr 
                    key={item.id} 
                    className="hover:opacity-90 transition-opacity duration-150"
                    style={{ backgroundColor: bg }}
                  >
                  <td className="py-3 px-4 font-mono text-slate-400 text-xs font-semibold">{item.id}</td>
                  <td className="py-3 px-4 font-bold text-[#002046]">{item.name}</td>
                  <td className="py-3 px-4 text-slate-500">{item.type}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{item.details}</td>
                  <td className="py-3 px-4 font-mono text-xs text-slate-500">{item.plateOrFleet}</td>
                  <td className="py-3 px-4 text-slate-600 font-medium">{item.responsible}</td>
                  <td className="py-3 px-4 font-mono text-sm font-bold text-slate-700">
                    {item.rate !== undefined && item.rate > 0 ? `R$ ${item.rate.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
                  </td>
                  <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                  <td className="py-3 px-4 text-right flex items-center justify-end gap-1.5 h-12">
                    <button 
                      onClick={() => handleOpenEditModal(item)}
                      className="text-[#002046] hover:text-[#1b365d] hover:bg-slate-100 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Editar registro"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id, item.name)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Deletar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                );
              })}
              {paginatedItems.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Nenhum registro encontrado correspondente aos filtros.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination */}
        <div className="bg-slate-50 py-3.5 px-4 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <div>
            Mostrando <span className="font-bold text-slate-700">{filteredItems.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</span> a{' '}
            <span className="font-bold text-slate-700">{Math.min(currentPage * itemsPerPage, filteredItems.length)}</span> de{' '}
            <span className="font-bold text-slate-700">{filteredItems.length}</span> registros
          </div>
          <div className="flex gap-1.5">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1 rounded-md border border-slate-200 hover:bg-white bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                  currentPage === page 
                    ? 'bg-[#002046] text-white' 
                    : 'hover:bg-white border border-transparent hover:border-slate-200'
                }`}
              >
                {page}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1 rounded-md border border-slate-200 hover:bg-white bg-slate-50 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 transition-all duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-[#002046] text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-display text-base font-bold">
                {editingItem ? 'Editar Registro' : 'Adicionar Novo Registro'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-xs text-red-800 font-medium">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">ID</label>
                  <input 
                    type="text"
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    disabled={!!editingItem} // ID cannot be changed once created
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-slate-100 disabled:opacity-80 text-slate-600 font-mono outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tipo</label>
                  <select 
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white text-slate-700 outline-none focus:ring-1 focus:ring-[#002046]"
                  >
                    <option value="Máquina">Máquina / Trator</option>
                    <option value="Caminhão">Caminhão</option>
                    <option value="Cliente/Setor">Cliente / Setor / Motorista</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Nome / Identificação</label>
                <input 
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: JD7250, Área Rogério, Caminhão Caçamba"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Modelo / Detalhes</label>
                <input 
                  type="text"
                  value={formDetails}
                  onChange={(e) => setFormDetails(e.target.value)}
                  placeholder="Ex: John Deere 7250, Fazenda Boa Esperança"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#002046]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Placa / Frota ID</label>
                  <input 
                    type="text"
                    value={formPlateOrFleet}
                    onChange={(e) => setFormPlateOrFleet(e.target.value)}
                    placeholder="Ex: FROTA-12, ABC-1234"
                    disabled={formType === 'Cliente/Setor'}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white disabled:bg-slate-100 disabled:opacity-50 text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#002046]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Motorista / Responsável</label>
                  <input 
                    type="text"
                    value={formResponsible}
                    onChange={(e) => setFormResponsible(e.target.value)}
                    placeholder="Ex: Rogério, Marcos, Ramos, Chico..."
                    disabled={formType === 'Cliente/Setor'}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm bg-white disabled:bg-slate-100 disabled:opacity-50 text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#002046]"
                  />
                </div>
              </div>

              {(formType === 'Máquina' || formType === 'Caminhão') && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Tarifa Padrão (R$ / hora)</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={formRate}
                    onChange={(e) => setFormRate(e.target.value)}
                    placeholder="Ex: 900.00"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm bg-white text-slate-800 placeholder:text-slate-400 outline-none focus:ring-1 focus:ring-[#002046]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Status</label>
                <div className="flex gap-4">
                  {(['Ativo', 'Inativo', 'Manutenção'] as const).map((status) => (
                    <label key={status} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input 
                        type="radio"
                        name="status"
                        checked={formStatus === status}
                        onChange={() => setFormStatus(status)}
                        className="text-[#002046] focus:ring-[#002046]"
                      />
                      <span>{status}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#002046] hover:bg-[#1b365d] text-white font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Salvar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
