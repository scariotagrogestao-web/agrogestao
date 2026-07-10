import React, { useState } from 'react';
import { Calendar, Tractor, User, Landmark, Crop, Scale, Trash2, Plus, AlertCircle, Pencil, X } from 'lucide-react';
import { Producao, Area, Maquina, Motorista } from '../types/agro';
import { getWeekString, getEntityColor } from '../utils/agroHelpers';

interface ProducaoEntryViewProps {
  producoes: Producao[];
  areas: Area[];
  maquinas: Maquina[];
  motoristas: Motorista[];
  onAddProducao: (prod: Omit<Producao, 'id' | 'semana'>) => void;
  onEditProducao: (prod: Producao) => void;
  onDeleteProducao: (id: string) => void;
}

export default function ProducaoEntryView({
  producoes,
  areas,
  maquinas,
  motoristas,
  onAddProducao,
  onEditProducao,
  onDeleteProducao
}: ProducaoEntryViewProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedMaquina, setSelectedMaquina] = useState('');
  const [selectedMotorista, setSelectedMotorista] = useState('');
  const [hectares, setHectares] = useState('');
  const [toneladas, setToneladas] = useState('');
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!selectedArea || !selectedMaquina || !selectedMotorista || !hectares || !toneladas) {
      setFormError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    const haValue = parseFloat(hectares);
    const tonValue = parseFloat(toneladas);

    if (isNaN(haValue) || haValue <= 0) {
      setFormError('A quantidade de hectares deve ser maior que zero.');
      return;
    }

    if (isNaN(tonValue) || tonValue <= 0) {
      setFormError('O total de toneladas colhidas deve ser maior que zero.');
      return;
    }

    if (editingId) {
      onEditProducao({
        id: editingId,
        date,
        semana: getWeekString(date),
        areaId: selectedArea,
        maquinaId: selectedMaquina,
        motoristaId: selectedMotorista,
        hectares: haValue,
        toneladas: tonValue
      });
      setEditingId(null);
      alert('Lançamento de produção atualizado com sucesso!');
    } else {
      onAddProducao({
        date,
        areaId: selectedArea,
        maquinaId: selectedMaquina,
        motoristaId: selectedMotorista,
        hectares: haValue,
        toneladas: tonValue
      });
      alert('Lançamento de produção registrado com sucesso!');
    }

    setHectares('');
    setToneladas('');
  };

  const getAreaName = (id: string) => areas.find(a => a.id === id)?.name || 'Área Desconhecida';
  const getMaquinaName = (id: string) => maquinas.find(m => m.id === id)?.name || 'Máquina Desconhecida';
  const getMotoristaName = (id: string) => motoristas.find(m => m.id === id)?.name || 'Motorista Desconhecido';

  return (
    <div className="flex flex-col gap-6 fade-in">
      <div className="page-title shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Lançamento de Produção Diária</h2>
          <p className="text-xs text-slate-500 mt-1">Registre a produtividade de colheita e vincule os operadores e maquinários.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Registration Form (5 columns) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <h3 className="font-display font-bold text-sm text-[#0c4a23] border-b border-emerald-100 pb-3 mb-4 flex items-center gap-2">
            {editingId ? <Pencil className="w-4 h-4 text-emerald-600" /> : <Plus className="w-4 h-4 text-emerald-600" />}
            <span>{editingId ? 'Editar Apontamento de Safra' : 'Novo Apontamento de Safra'}</span>
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-xs text-red-800 font-semibold">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span>{formError}</span>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Data da Colheita *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs font-mono text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50 cursor-pointer"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Landmark className="w-3.5 h-3.5 text-slate-400" /> Área / Fazenda *
              </label>
              <select
                value={selectedArea}
                onChange={(e) => setSelectedArea(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50 cursor-pointer"
                required
              >
                <option value="">Selecione a Fazenda...</option>
                {areas.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.culture})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <Tractor className="w-3.5 h-3.5 text-slate-400" /> Máquina Utilizada *
              </label>
              <select
                value={selectedMaquina}
                onChange={(e) => setSelectedMaquina(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50 cursor-pointer"
                required
              >
                <option value="">Selecione o Veículo...</option>
                {maquinas.map(m => (
                  <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Motorista / Operador *
              </label>
              <select
                value={selectedMotorista}
                onChange={(e) => setSelectedMotorista(e.target.value)}
                className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50 cursor-pointer"
                required
              >
                <option value="">Selecione o Operador...</option>
                {motoristas.filter(m => m.status === 'Ativo').map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Crop className="w-3.5 h-3.5 text-slate-400" /> Área (Hectares) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={hectares}
                  onChange={(e) => setHectares(e.target.value)}
                  placeholder="Ex: 15.5"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-slate-400" /> Peso (Toneladas) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={toneladas}
                  onChange={(e) => setToneladas(e.target.value)}
                  placeholder="Ex: 120.4"
                  className="w-full border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-emerald-600 bg-slate-50"
                  required
                />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setHectares('');
                    setToneladas('');
                  }}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs tracking-wider uppercase py-3 rounded-lg transition-all shadow-sm cursor-pointer"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wider uppercase py-3 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                {editingId ? 'Salvar Alterações' : 'Gravar Lançamento'}
              </button>
            </div>
          </form>
        </div>

        {/* List of Entries Table (8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col min-h-[420px]">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
            <h3 className="text-sm font-bold text-slate-800">Lançamentos Gravados</h3>
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full shadow-2xs">
              {producoes.length} Registros
            </span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4 w-28">Data</th>
                  <th className="py-3 px-4 w-32">Semana</th>
                  <th className="py-3 px-4">Área / Fazenda</th>
                  <th className="py-3 px-4">Máquina</th>
                  <th className="py-3 px-4">Motorista</th>
                  <th className="py-3 px-4 text-right">Hectares</th>
                  <th className="py-3 px-4 text-right">Toneladas</th>
                  <th className="py-3 px-4 text-right">Rend. (Ton/Ha)</th>
                  <th className="py-3 px-4 text-center w-16">Ação</th>
                </tr>
              </thead>
              <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                {[...producoes].reverse().map((prod, index) => {
                  const yieldRate = prod.hectares > 0 ? prod.toneladas / prod.hectares : 0;
                  const bg = index % 2 === 1 ? '#fcfaf2' : '#ffffff'; // beautiful cream alternate zebra style!
                  return (
                    <tr key={prod.id} style={{ backgroundColor: bg }} className="hover:opacity-90 transition-opacity">
                      <td className="py-3 px-4 font-mono font-bold text-slate-500">
                        {prod.date.split('-').reverse().join('/')}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-500">{prod.semana}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getAreaName(prod.areaId)).bg} ${getEntityColor(getAreaName(prod.areaId)).text} border ${getEntityColor(getAreaName(prod.areaId)).border} shadow-3xs`}>
                          {getAreaName(prod.areaId)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getMaquinaName(prod.maquinaId)).bg} ${getEntityColor(getMaquinaName(prod.maquinaId)).text} border ${getEntityColor(getMaquinaName(prod.maquinaId)).border} shadow-3xs`}>
                          {getMaquinaName(prod.maquinaId)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getMotoristaName(prod.motoristaId)).bg} ${getEntityColor(getMotoristaName(prod.motoristaId)).text} border ${getEntityColor(getMotoristaName(prod.motoristaId)).border} shadow-3xs`}>
                          {getMotoristaName(prod.motoristaId)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-mono">{prod.hectares.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} ha</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">{prod.toneladas.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} t</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-emerald-800">
                        {yieldRate.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} t/ha
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setEditingId(prod.id);
                              setDate(prod.date);
                              setSelectedArea(prod.areaId);
                              setSelectedMaquina(prod.maquinaId);
                              setSelectedMotorista(prod.motoristaId);
                              setHectares(String(prod.hectares));
                              setToneladas(String(prod.toneladas));
                            }}
                            className="text-slate-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors cursor-pointer"
                            title="Editar lançamento"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Deseja excluir este lançamento de produção permanentemente?')) {
                                onDeleteProducao(prod.id);
                              }
                            }}
                            className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                            title="Excluir lançamento"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {producoes.length === 0 && (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-slate-400 font-semibold">
                      Nenhum lançamento registrado no momento.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
