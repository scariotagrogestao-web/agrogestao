import React, { useState, useMemo } from 'react';
import { Filter, Calendar, Tractor, User, Landmark, DollarSign, Scale, Crop, TrendingUp, Download } from 'lucide-react';
import { Producao, Area, Maquina, Motorista } from '../types/agro';
import { getEntityColor } from '../utils/agroHelpers';
interface PagamentoReportViewProps {
  producoes: Producao[];
  areas: Area[];
  maquinas: Maquina[];
  motoristas: Motorista[];
}

export default function PagamentoReportView({
  producoes,
  areas,
  maquinas,
  motoristas
}: PagamentoReportViewProps) {
  // Filter States
  const [selectedSemana, setSelectedSemana] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedMaquina, setSelectedMaquina] = useState('all');
  const [selectedMotorista, setSelectedMotorista] = useState('all');

  // Dynamic filter values lists
  const semanasList = useMemo(() => {
    const list = producoes.map(p => p.semana);
    return Array.from(new Set(list)).sort().reverse();
  }, [producoes]);

  // Filtered Production Records
  const filteredProducoes = useMemo(() => {
    return producoes.filter(p => {
      const matchesSemana = selectedSemana === 'all' || p.semana === selectedSemana;
      const matchesArea = selectedArea === 'all' || p.areaId === selectedArea;
      const matchesMaquina = selectedMaquina === 'all' || p.maquinaId === selectedMaquina;
      const matchesMotorista = selectedMotorista === 'all' || p.motoristaId === selectedMotorista;
      return matchesSemana && matchesArea && matchesMaquina && matchesMotorista;
    });
  }, [producoes, selectedSemana, selectedArea, selectedMaquina, selectedMotorista]);

  // Consolidated Results Calculations
  const consolidatedStats = useMemo(() => {
    let totalHectares = 0;
    let totalToneladas = 0;
    let totalPagamento = 0;

    filteredProducoes.forEach(p => {
      const motoristaRate = motoristas.find(m => m.id === p.motoristaId)?.ratePerHectare || 0;
      totalHectares += p.hectares;
      totalToneladas += p.toneladas;
      totalPagamento += p.hectares * motoristaRate;
    });

    const averageYield = totalHectares > 0 ? totalToneladas / totalHectares : 0;

    return {
      totalHectares: parseFloat(totalHectares.toFixed(2)),
      totalToneladas: parseFloat(totalToneladas.toFixed(2)),
      totalPagamento,
      averageYield
    };
  }, [filteredProducoes, motoristas]);

  // Entity name helpers
  const getAreaName = (id: string) => areas.find(a => a.id === id)?.name || 'Área Desconhecida';
  const getMaquinaName = (id: string) => maquinas.find(m => m.id === id)?.name || 'Máquina Desconhecida';
  const getMotoristaName = (id: string) => motoristas.find(m => m.id === id)?.name || 'Motorista Desconhecido';
  const getMotoristaRate = (id: string) => motoristas.find(m => m.id === id)?.ratePerHectare || 0;

  const formatBRL = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  // CSV Exporter for Filtered Report Rows
  const handleExportCSV = () => {
    const csvRows = [];
    csvRows.push("### RELATORIO DE PAGAMENTO E PRODUCAO AGRICOLA ###");
    csvRows.push(`Filtros Ativos: Semana: ${selectedSemana}; Fazenda: ${selectedArea}; Maquina: ${selectedMaquina}; Motorista: ${selectedMotorista}`);
    csvRows.push(`Exportado em:;${new Date().toLocaleString('pt-BR')}`);
    csvRows.push("");
    csvRows.push("Semana;Data;Area/Fazenda;Maquina;Motorista;Hectares (ha);Toneladas (t);Rendimento (t/ha);Tarifa (R$/ha);Pagamento (R$)");

    filteredProducoes.forEach(p => {
      const yieldRate = p.hectares > 0 ? p.toneladas / p.hectares : 0;
      const rate = getMotoristaRate(p.motoristaId);
      const payment = p.hectares * rate;
      csvRows.push(
        `"${p.semana}";"${p.date.split('-').reverse().join('/')}";"${getAreaName(p.areaId)}";"${getMaquinaName(p.maquinaId)}";"${getMotoristaName(p.motoristaId)}";${p.hectares.toLocaleString('pt-BR')};${p.toneladas.toLocaleString('pt-BR')};${yieldRate.toLocaleString('pt-BR')};${rate.toLocaleString('pt-BR')};${payment.toLocaleString('pt-BR')}`
      );
    });

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_pagamento_filtrado_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Page Title with Export Button */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Relatório de Pagamento e Produção</h2>
          <p className="text-xs text-slate-500 mt-1">Consolidação e fechamento de pagamentos para motoristas/operadores com base em hectares trabalhados.</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer border-none"
          title="Exportar os dados da tabela filtrada atual para Excel/CSV"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Dynamic Filters Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-wrap gap-4 items-end shrink-0">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider h-9">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filtros:</span>
        </div>

        {/* Semana Filter */}
        <div className="flex flex-col gap-1 w-full sm:w-44">
          <span className="text-[9px] uppercase font-bold text-slate-400">Semana Agrícola</span>
          <select
            value={selectedSemana}
            onChange={(e) => setSelectedSemana(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 outline-none cursor-pointer"
          >
            <option value="all">Todas as Semanas</option>
            {semanasList.map(sem => (
              <option key={sem} value={sem}>{sem}</option>
            ))}
          </select>
        </div>

        {/* Área Filter */}
        <div className="flex flex-col gap-1 w-full sm:w-48">
          <span className="text-[9px] uppercase font-bold text-slate-400">Fazenda / Área</span>
          <select
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 outline-none cursor-pointer"
          >
            <option value="all">Todas as Fazendas</option>
            {areas.map(a => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* Máquina Filter */}
        <div className="flex flex-col gap-1 w-full sm:w-48">
          <span className="text-[9px] uppercase font-bold text-slate-400">Máquina</span>
          <select
            value={selectedMaquina}
            onChange={(e) => setSelectedMaquina(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 outline-none cursor-pointer"
          >
            <option value="all">Todas as Máquinas</option>
            {maquinas.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Motorista Filter */}
        <div className="flex flex-col gap-1 w-full sm:w-48">
          <span className="text-[9px] uppercase font-bold text-slate-400">Motorista</span>
          <select
            value={selectedMotorista}
            onChange={(e) => setSelectedMotorista(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:ring-1 focus:ring-emerald-600 outline-none cursor-pointer"
          >
            <option value="all">Todos os Motoristas</option>
            {motoristas.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {/* Reset Filters */}
        <button
          onClick={() => {
            setSelectedSemana('all');
            setSelectedArea('all');
            setSelectedMaquina('all');
            setSelectedMotorista('all');
          }}
          className="px-4 py-2 border border-slate-200 bg-white text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors shrink-0 cursor-pointer ml-auto"
        >
          Limpar Filtros
        </button>
      </div>

      {/* KPI Cards Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border-t-4 border-t-emerald-700 border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Hectares Trabalhados</span>
            <Crop className="text-emerald-700 w-4 h-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-slate-800">{consolidatedStats.totalHectares.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-500 font-bold">ha</span>
          </div>
        </div>

        <div className="bg-white border-t-4 border-t-emerald-700 border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Produção Total</span>
            <Scale className="text-emerald-700 w-4 h-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-slate-800">{consolidatedStats.totalToneladas.toLocaleString('pt-BR')}</span>
            <span className="text-xs text-slate-500 font-bold">t</span>
          </div>
        </div>

        <div className="bg-white border-t-4 border-t-emerald-700 border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Rendimento Médio</span>
            <TrendingUp className="text-emerald-700 w-4 h-4" />
          </div>
          <div className="mt-3 flex items-baseline gap-1">
            <span className="font-mono text-2xl font-black text-emerald-800">
              {consolidatedStats.averageYield.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-bold">t/ha</span>
          </div>
        </div>

        <div className="bg-white border-t-4 border-t-red-600 border border-slate-200 rounded-xl p-5 shadow-xs bg-gradient-to-br from-red-50/20 to-transparent">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total a Pagar (Motoristas)</span>
            <DollarSign className="text-red-600 w-4 h-4" />
          </div>
          <div className="mt-3">
            <span className="font-mono text-2xl font-black text-red-600">{formatBRL(consolidatedStats.totalPagamento)}</span>
          </div>
        </div>
      </div>

      {/* Consolidated List Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col min-h-[350px]">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <h3 className="text-sm font-bold text-slate-800">Demonstrativo de Fechamento por Lançamento</h3>
          <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full shadow-2xs">
            {filteredProducoes.length} Lançamentos Filtrados
          </span>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-sans text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4 w-32">Semana</th>
                <th className="py-3.5 px-4 w-28 text-center">Data</th>
                <th className="py-3.5 px-4">Área / Fazenda</th>
                <th className="py-3.5 px-4">Máquina</th>
                <th className="py-3.5 px-4">Motorista</th>
                <th className="py-3.5 px-4 text-right">Hectares</th>
                <th className="py-3.5 px-4 text-right">Toneladas</th>
                <th className="py-3.5 px-4 text-right">Rend. (t/ha)</th>
                <th className="py-3.5 px-4 text-right">Tarifa (R$/ha)</th>
                <th className="py-3.5 px-4 text-right">Pagamento (R$)</th>
              </tr>
            </thead>
            <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
              {filteredProducoes.map((p, index) => {
                const yieldRate = p.hectares > 0 ? p.toneladas / p.hectares : 0;
                const rate = getMotoristaRate(p.motoristaId);
                const payment = p.hectares * rate;
                const bg = index % 2 === 1 ? '#fdf9f0' : '#ffffff'; // beautiful cream alternate zebra style!
                return (
                  <tr key={p.id} style={{ backgroundColor: bg, borderBottom: '1px solid #cbd5e1' }} className="hover:opacity-90 transition-opacity">
                    <td className="py-3 px-4 font-semibold text-slate-500">{p.semana}</td>
                    <td className="py-3 px-4 text-center font-mono text-slate-500">
                      {p.date.split('-').reverse().join('/')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getAreaName(p.areaId)).bg} ${getEntityColor(getAreaName(p.areaId)).text} border ${getEntityColor(getAreaName(p.areaId)).border} shadow-3xs`}>
                        {getAreaName(p.areaId)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getMaquinaName(p.maquinaId)).bg} ${getEntityColor(getMaquinaName(p.maquinaId)).text} border ${getEntityColor(getMaquinaName(p.maquinaId)).border} shadow-3xs`}>
                        {getMaquinaName(p.maquinaId)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getMotoristaName(p.motoristaId)).bg} ${getEntityColor(getMotoristaName(p.motoristaId)).text} border ${getEntityColor(getMotoristaName(p.motoristaId)).border} shadow-3xs`}>
                        {getMotoristaName(p.motoristaId)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono">{p.hectares.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} ha</td>
                    <td className="py-3 px-4 text-right font-mono">{p.toneladas.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} t</td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {yieldRate.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })} t/ha
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-600">
                      {formatBRL(rate)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-red-600">
                      {formatBRL(payment)}
                    </td>
                  </tr>
                );
              })}
              {filteredProducoes.length === 0 && (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400 font-semibold">
                    Nenhum resultado encontrado para os filtros selecionados.
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
