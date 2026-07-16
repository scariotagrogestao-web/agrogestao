import React, { useState, useMemo } from 'react';
import { Filter, Calendar, Tractor, User, Landmark, DollarSign, Scale, Crop, TrendingUp, Download, FileText, Truck, Layers } from 'lucide-react';
import { Producao, Area, Maquina, Motorista } from '../types/agro';
import { LocalitySheet, ClientOrVehicle } from '../types';
import { getEntityColor, getDriverForMachine, isTruckVehicle, calculateHours } from '../utils/agroHelpers';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PagamentoReportViewProps {
  producoes: Producao[];
  areas: Area[];
  maquinas: Maquina[];
  motoristas: Motorista[];
  localitySheets?: LocalitySheet[];
  clientsAndVehicles?: ClientOrVehicle[];
}

export default function PagamentoReportView({
  producoes,
  areas,
  maquinas,
  motoristas,
  localitySheets = [],
  clientsAndVehicles = []
}: PagamentoReportViewProps) {
  const [activeTab, setActiveTab] = useState<'producao' | 'maquina' | 'caminhao'>('producao');

  // ==========================================
  // STATE: PRODUCAO FILTERS
  // ==========================================
  const [selectedSemana, setSelectedSemana] = useState('all');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedMaquina, setSelectedMaquina] = useState('all');
  const [selectedMotorista, setSelectedMotorista] = useState('all');

  // ==========================================
  // STATE: HORAS FILTERS (MÁQUINAS E CAMINHÕES)
  // ==========================================
  const [selectedHourArea, setSelectedHourArea] = useState('all');
  const [selectedHourMonth, setSelectedHourMonth] = useState('all');

  // ==========================================
  // LOGIC: PRODUCAO
  // ==========================================
  const semanasList = useMemo(() => {
    const list = producoes.map(p => p.semana);
    return Array.from(new Set(list)).sort().reverse();
  }, [producoes]);

  const filteredProducoes = useMemo(() => {
    return producoes.filter(p => {
      const matchesSemana = selectedSemana === 'all' || p.semana === selectedSemana;
      const matchesArea = selectedArea === 'all' || p.areaId === selectedArea;
      const matchesMaquina = selectedMaquina === 'all' || p.maquinaId === selectedMaquina;
      const matchesMotorista = selectedMotorista === 'all' || p.motoristaId === selectedMotorista;
      return matchesSemana && matchesArea && matchesMaquina && matchesMotorista;
    });
  }, [producoes, selectedSemana, selectedArea, selectedMaquina, selectedMotorista]);

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

  const getAreaName = (id: string) => areas.find(a => a.id === id)?.name || 'Área Desconhecida';
  const getMaquinaName = (id: string) => maquinas.find(m => m.id === id)?.name || 'Máquina Desconhecida';
  const getMotoristaName = (id: string) => motoristas.find(m => m.id === id)?.name || 'Motorista Desconhecido';
  const getMotoristaRate = (id: string) => motoristas.find(m => m.id === id)?.ratePerHectare || 0;

  // ==========================================
  // LOGIC: HORAS (MÁQUINAS E CAMINHÕES)
  // ==========================================
  const allReadings = useMemo(() => {
    const list: any[] = [];
    localitySheets.forEach(sheet => {
      sheet.machines.forEach(m => {
        const isTruck = isTruckVehicle(m.name, clientsAndVehicles);
        const driver = getDriverForMachine(m.name, clientsAndVehicles);
        
        Object.entries(m.readings).forEach(([dateStr, reading]) => {
          const hours = calculateHours(reading.initial, reading.final);
          if (hours > 0) {
            list.push({
              sheetId: sheet.id,
              sheetName: sheet.name,
              machineId: m.id,
              machineName: m.name,
              isTruck,
              driver,
              ratePerHour: m.ratePerHour,
              dateStr,
              initial: reading.initial,
              final: reading.final,
              hours,
              revenue: hours * m.ratePerHour,
              month: dateStr.split('/')[1] || 'Outro'
            });
          }
        });
      });
    });
    return list;
  }, [localitySheets, clientsAndVehicles]);

  const monthsList = useMemo(() => {
    return Array.from(new Set(allReadings.map(r => r.month))).sort();
  }, [allReadings]);

  const filteredMachineReadings = useMemo(() => {
    return allReadings.filter(r => !r.isTruck && (selectedHourArea === 'all' || r.sheetId === selectedHourArea) && (selectedHourMonth === 'all' || r.month === selectedHourMonth));
  }, [allReadings, selectedHourArea, selectedHourMonth]);

  const filteredTruckReadings = useMemo(() => {
    return allReadings.filter(r => r.isTruck && (selectedHourArea === 'all' || r.sheetId === selectedHourArea) && (selectedHourMonth === 'all' || r.month === selectedHourMonth));
  }, [allReadings, selectedHourArea, selectedHourMonth]);

  const machineStats = useMemo(() => {
    return {
      totalHours: filteredMachineReadings.reduce((sum, r) => sum + r.hours, 0),
      totalRevenue: filteredMachineReadings.reduce((sum, r) => sum + r.revenue, 0)
    };
  }, [filteredMachineReadings]);

  const truckStats = useMemo(() => {
    return {
      totalHours: filteredTruckReadings.reduce((sum, r) => sum + r.hours, 0),
      totalRevenue: filteredTruckReadings.reduce((sum, r) => sum + r.revenue, 0)
    };
  }, [filteredTruckReadings]);


  const formatBRL = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // ==========================================
  // EXPORT FUNCTIONS
  // ==========================================
  const handleExportCSV = (type: 'producao' | 'maquina' | 'caminhao') => {
    const csvRows = [];
    csvRows.push(`### RELATORIO DE ${type.toUpperCase()} ###`);
    csvRows.push(`Exportado em:;${new Date().toLocaleString('pt-BR')}`);
    csvRows.push("");

    if (type === 'producao') {
      csvRows.push("Semana;Data;Area/Fazenda;Maquina;Motorista;Hectares (ha);Toneladas (t);Rendimento (t/ha);Tarifa (R$/ha);Pagamento (R$)");
      filteredProducoes.forEach(p => {
        const yieldRate = p.hectares > 0 ? p.toneladas / p.hectares : 0;
        const rate = getMotoristaRate(p.motoristaId);
        const payment = p.hectares * rate;
        csvRows.push(`"${p.semana}";"${p.date.split('-').reverse().join('/')}";"${getAreaName(p.areaId)}";"${getMaquinaName(p.maquinaId)}";"${getMotoristaName(p.motoristaId)}";${p.hectares.toLocaleString('pt-BR')};${p.toneladas.toLocaleString('pt-BR')};${yieldRate.toLocaleString('pt-BR')};${rate.toLocaleString('pt-BR')};${payment.toLocaleString('pt-BR')}`);
      });
    } else {
      const dataList = type === 'maquina' ? filteredMachineReadings : filteredTruckReadings;
      csvRows.push("Data;Fazenda;Equipamento;Motorista/Operador;Hr. Inicial;Hr. Final;Total Horas;Tarifa (R$/h);Faturamento (R$)");
      dataList.forEach(r => {
        csvRows.push(`"${r.dateStr}";"${r.sheetName}";"${r.machineName}";"${r.driver}";"${r.initial}";"${r.final}";${r.hours.toLocaleString('pt-BR')};${r.ratePerHour.toLocaleString('pt-BR')};${r.revenue.toLocaleString('pt-BR')}`);
      });
    }

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `relatorio_${type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = (type: 'producao' | 'maquina' | 'caminhao') => {
    const doc = new jsPDF();
    let title = "RELATÓRIO";
    let head: any[] = [];
    let tableData: any[] = [];

    if (type === 'producao') {
      title = "RELATÓRIO DE PAGAMENTO E PRODUÇÃO";
      head = [['Data', 'Área', 'Motorista', 'Hectares', 'Toneladas', 'Pagamento']];
      tableData = filteredProducoes.map(p => {
        const rate = getMotoristaRate(p.motoristaId);
        return [
          p.date.split('-').reverse().join('/'),
          getAreaName(p.areaId),
          getMotoristaName(p.motoristaId),
          p.hectares.toLocaleString('pt-BR'),
          p.toneladas.toLocaleString('pt-BR'),
          (p.hectares * rate).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        ];
      });
    } else {
      title = type === 'maquina' ? "RELATÓRIO DE HORAS: MÁQUINAS" : "RELATÓRIO DE HORAS: CAMINHÕES";
      const dataList = type === 'maquina' ? filteredMachineReadings : filteredTruckReadings;
      head = [['Data', 'Fazenda', 'Equipamento', 'Hr. Inic.', 'Hr. Final', 'Total Hrs', 'Faturamento']];
      tableData = dataList.map(r => [
        r.dateStr,
        r.sheetName,
        r.machineName,
        r.initial,
        r.final,
        r.hours.toLocaleString('pt-BR'),
        r.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      ]);
    }

    doc.text(title, 14, 15);
    autoTable(doc, {
      startY: 22,
      head: head,
      body: tableData,
    });
    doc.save(`relatorio_${type}_${Date.now()}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Page Title & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0 bg-white/50 p-4 rounded-2xl border border-white backdrop-blur shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-[#002046] to-emerald-600">Central de Relatórios e Exportação</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Consolidação de dados para análises, fechamentos e exportação (PDF/Excel).</p>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner overflow-hidden">
          <button 
            onClick={() => setActiveTab('producao')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'producao' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
          >
            <Scale className="w-4 h-4" />
            Produção
          </button>
          <button 
            onClick={() => setActiveTab('maquina')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'maquina' ? 'bg-white text-[#002046] shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
          >
            <Tractor className="w-4 h-4" />
            Máquinas
          </button>
          <button 
            onClick={() => setActiveTab('caminhao')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'caminhao' ? 'bg-white text-purple-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 border border-transparent'}`}
          >
            <Truck className="w-4 h-4" />
            Caminhões
          </button>
        </div>
      </div>

      <div className="flex gap-2 justify-end">
        <button
          onClick={() => handleExportPDF(activeTab)}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
        >
          <FileText className="w-4 h-4" />
          <span>Gerar PDF ({activeTab})</span>
        </button>
        <button
          onClick={() => handleExportCSV(activeTab)}
          className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer border-none"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV ({activeTab})</span>
        </button>
      </div>

      {activeTab === 'producao' && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Dynamic Filters Panel */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap gap-4 items-end shrink-0">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider h-9 mr-2">
              <Filter className="w-4 h-4 text-emerald-700" />
              <span>Filtros:</span>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-40">
              <span className="text-[10px] uppercase font-bold text-slate-400">Semana</span>
              <select value={selectedSemana} onChange={(e) => setSelectedSemana(e.target.value)} className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer">
                <option value="all">Todas as Semanas</option>
                {semanasList.map(sem => <option key={sem} value={sem}>{sem}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-44">
              <span className="text-[10px] uppercase font-bold text-slate-400">Fazenda / Área</span>
              <select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)} className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer">
                <option value="all">Todas as Fazendas</option>
                {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-44">
              <span className="text-[10px] uppercase font-bold text-slate-400">Motorista</span>
              <select value={selectedMotorista} onChange={(e) => setSelectedMotorista(e.target.value)} className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer">
                <option value="all">Todos os Motoristas</option>
                {motoristas.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <button onClick={() => { setSelectedSemana('all'); setSelectedArea('all'); setSelectedMaquina('all'); setSelectedMotorista('all'); }} className="px-4 py-2 border border-slate-200 bg-white text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shrink-0 cursor-pointer ml-auto shadow-sm">
              Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="bg-white border-t-4 border-t-emerald-600 border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Hectares</span>
                <Crop className="text-emerald-600 w-5 h-5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-slate-800 tracking-tighter">{consolidatedStats.totalHectares.toLocaleString('pt-BR')}</span>
                <span className="text-xs text-slate-500 font-bold">ha</span>
              </div>
            </div>
            <div className="bg-white border-t-4 border-t-emerald-600 border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Produção</span>
                <Scale className="text-emerald-600 w-5 h-5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="font-mono text-3xl font-black text-slate-800 tracking-tighter">{consolidatedStats.totalToneladas.toLocaleString('pt-BR')}</span>
                <span className="text-xs text-slate-500 font-bold">t</span>
              </div>
            </div>
            <div className="bg-white border-t-4 border-t-red-500 border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Pagamento Base</span>
                <DollarSign className="text-red-500 w-5 h-5" />
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-400 mr-0.5">R$</span>
                <span className="font-mono text-3xl font-black text-slate-800 tracking-tighter">{consolidatedStats.totalPagamento.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[350px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-800 font-display">Relatório Detalhado: Produção</h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-sans text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="py-4 px-4 w-28">Data</th>
                    <th className="py-4 px-4">Área / Fazenda</th>
                    <th className="py-4 px-4">Motorista</th>
                    <th className="py-4 px-4 text-right">Hectares</th>
                    <th className="py-4 px-4 text-right">Toneladas</th>
                    <th className="py-4 px-4 text-right">Tarifa</th>
                    <th className="py-4 px-4 text-right">Pagamento</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                  {filteredProducoes.map((p, index) => {
                    const rate = getMotoristaRate(p.motoristaId);
                    const payment = p.hectares * rate;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-4 font-mono text-slate-500 group-hover:text-slate-800 font-bold">{p.date.split('-').reverse().join('/')}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getAreaName(p.areaId)).bg} ${getEntityColor(getAreaName(p.areaId)).text} border ${getEntityColor(getAreaName(p.areaId)).border}`}>{getAreaName(p.areaId)}</span></td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(getMotoristaName(p.motoristaId)).bg} ${getEntityColor(getMotoristaName(p.motoristaId)).text} border ${getEntityColor(getMotoristaName(p.motoristaId)).border}`}>{getMotoristaName(p.motoristaId)}</span></td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-600">{p.hectares.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} ha</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-slate-600">{p.toneladas.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} t</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{formatBRL(rate)}</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-red-600">{formatBRL(payment)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {(activeTab === 'maquina' || activeTab === 'caminhao') && (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Horas Filters */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-wrap gap-4 items-end shrink-0">
            <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider h-9 mr-2">
              <Filter className={`w-4 h-4 ${activeTab === 'maquina' ? 'text-[#002046]' : 'text-purple-700'}`} />
              <span>Filtros ({activeTab}):</span>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-44">
              <span className="text-[10px] uppercase font-bold text-slate-400">Mês de Apontamento</span>
              <select value={selectedHourMonth} onChange={(e) => setSelectedHourMonth(e.target.value)} className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer">
                <option value="all">Todos os Meses</option>
                {monthsList.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-56">
              <span className="text-[10px] uppercase font-bold text-slate-400">Fazenda / Localidade</span>
              <select value={selectedHourArea} onChange={(e) => setSelectedHourArea(e.target.value)} className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer">
                <option value="all">Todas as Fazendas</option>
                {localitySheets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <button onClick={() => { setSelectedHourArea('all'); setSelectedHourMonth('all'); }} className="px-4 py-2 border border-slate-200 bg-white text-slate-500 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors shrink-0 cursor-pointer ml-auto shadow-sm">
              Limpar Filtros
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`bg-gradient-to-br border-t-4 rounded-2xl p-6 shadow-sm ${activeTab === 'maquina' ? 'from-blue-50 to-blue-100 border-t-[#002046]' : 'from-purple-50 to-purple-100 border-t-purple-700'}`}>
              <div className="flex justify-between items-start">
                <span className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'maquina' ? 'text-[#002046]/70' : 'text-purple-700/70'}`}>Horas Acumuladas</span>
                {activeTab === 'maquina' ? <Tractor className="text-[#002046] w-5 h-5" /> : <Truck className="text-purple-700 w-5 h-5" />}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className={`font-mono text-4xl font-black tracking-tighter ${activeTab === 'maquina' ? 'text-[#002046]' : 'text-purple-900'}`}>
                  {(activeTab === 'maquina' ? machineStats.totalHours : truckStats.totalHours).toLocaleString('pt-BR')}
                </span>
                <span className={`text-sm font-bold ${activeTab === 'maquina' ? 'text-[#002046]/70' : 'text-purple-700/70'}`}>hrs</span>
              </div>
            </div>
            <div className="bg-white border-t-4 border-t-emerald-500 border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Faturamento Bruto</span>
                <DollarSign className="text-emerald-500 w-5 h-5" />
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-sm font-bold text-slate-400 mr-0.5">R$</span>
                <span className="font-mono text-4xl font-black text-slate-800 tracking-tighter">
                  {(activeTab === 'maquina' ? machineStats.totalRevenue : truckStats.totalRevenue).toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[350px]">
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <h3 className="text-sm font-bold text-slate-800 font-display">Relatório Detalhado: {activeTab === 'maquina' ? 'Máquinas' : 'Caminhões'}</h3>
            </div>
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 font-sans text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <th className="py-4 px-4 w-24">Data</th>
                    <th className="py-4 px-4">Fazenda</th>
                    <th className="py-4 px-4">Equipamento</th>
                    <th className="py-4 px-4">Operador</th>
                    <th className="py-4 px-4 text-center">Hr. Inic.</th>
                    <th className="py-4 px-4 text-center">Hr. Final</th>
                    <th className="py-4 px-4 text-right">Hrs Trabalhadas</th>
                    <th className="py-4 px-4 text-right">Tarifa</th>
                    <th className="py-4 px-4 text-right">Faturamento</th>
                  </tr>
                </thead>
                <tbody className="text-xs text-slate-700 divide-y divide-slate-100 font-medium">
                  {(activeTab === 'maquina' ? filteredMachineReadings : filteredTruckReadings).map((r, index) => {
                    return (
                      <tr key={index} className="hover:bg-slate-50 transition-colors group">
                        <td className="py-3 px-4 font-mono text-slate-500 group-hover:text-slate-800 font-bold">{r.dateStr}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(r.sheetName).bg} ${getEntityColor(r.sheetName).text} border ${getEntityColor(r.sheetName).border}`}>{r.sheetName}</span></td>
                        <td className="py-3 px-4 font-bold text-slate-800">{r.machineName}</td>
                        <td className="py-3 px-4"><span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getEntityColor(r.driver).bg} ${getEntityColor(r.driver).text} border ${getEntityColor(r.driver).border}`}>{r.driver}</span></td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500">{r.initial}</td>
                        <td className="py-3 px-4 text-center font-mono text-slate-500">{r.final}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-[#002046] bg-[#002046]/5">{r.hours.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}</td>
                        <td className="py-3 px-4 text-right font-mono text-slate-500">{formatBRL(r.ratePerHour)}/h</td>
                        <td className="py-3 px-4 text-right font-mono font-black text-emerald-600">{formatBRL(r.revenue)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
