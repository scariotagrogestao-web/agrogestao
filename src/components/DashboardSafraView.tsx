import React, { useState, useMemo } from 'react';
import { Landmark, Scale, Crop, TrendingUp, DollarSign, FileText, FileSpreadsheet, Download, Filter } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Producao, Area } from '../types/agro';
import { exportToCSV, exportToXLSX, exportToPDF } from '../utils/exportHelpers';
import ExportGenerateButton from './ExportGenerateButton';

interface DashboardSafraViewProps {
  producoes: Producao[];
  areas: Area[];
}

export default function DashboardSafraView({
  producoes,
  areas
}: DashboardSafraViewProps) {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('none');

  const filteredProducoes = useMemo(() => {
    if (selectedArea === 'none') return [];

    return producoes.filter(p => {
      if (selectedArea !== 'all' && p.areaId !== selectedArea) return false;
      
      if (startDate || endDate) {
        const pDateMs = new Date(p.date + 'T00:00:00').getTime();
        if (startDate && pDateMs < new Date(startDate + 'T00:00:00').getTime()) return false;
        if (endDate && pDateMs > new Date(endDate + 'T23:59:59').getTime()) return false;
      }
      
      return true;
    });
  }, [producoes, selectedArea, startDate, endDate]);

  // 1. KPI Calculations
  const stats = useMemo(() => {
    let totalTons = 0;
    let totalHa = 0;
    
    filteredProducoes.forEach(p => {
      totalTons += p.toneladas;
      totalHa += p.hectares;
    });

    const silagemRevenue = filteredProducoes.reduce((sum, p) => {
      if (typeof p.valorTotalReceita === 'number' && !isNaN(p.valorTotalReceita)) {
        return sum + p.valorTotalReceita;
      }
      if (typeof p.precoPorTon === 'number' && !isNaN(p.precoPorTon) && p.precoPorTon > 0) {
        return sum + (p.toneladas * p.precoPorTon);
      }
      return sum;
    }, 0);

    const averageYield = totalHa > 0 ? totalTons / totalHa : 0;

    return {
      totalTons: parseFloat(totalTons.toFixed(2)),
      totalHa: parseFloat(totalHa.toFixed(2)),
      averageYield,
      silagemRevenue
    };
  }, [filteredProducoes]);

  // 2. Production grouped by Area
  const areaChartData = useMemo(() => {
    const areaMap: Record<string, { id: string; name: string; toneladas: number; hectares: number; culture: string; yield: number }> = {};
    
    filteredProducoes.forEach(p => {
      const area = areas.find(a => a.id === p.areaId);
      const areaId = p.areaId || 'geral';
      const areaName = area?.name || 'Área Geral';
      
      if (!areaMap[areaId]) {
        areaMap[areaId] = { id: areaId, name: areaName, toneladas: 0, hectares: 0, culture: area?.cultura || '-', yield: 0 };
      }
      areaMap[areaId].toneladas += p.toneladas;
      areaMap[areaId].hectares += p.hectares;
    });

    return Object.values(areaMap)
      .map(item => ({
        ...item,
        yield: item.hectares > 0 ? parseFloat((item.toneladas / item.hectares).toFixed(2)) : 0
      }))
      .sort((a, b) => b.toneladas - a.toneladas);
  }, [filteredProducoes, areas]);

  const chartData = areaChartData;

  const colors = ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'];

  const handleExportPDF = () => {
    const headers = ['Área / Fazenda', 'Hectares (ha)', 'Toneladas (t)', 'Rendimento Média (t/ha)'];
    const rows = areaChartData.map(a => [
      a.name,
      a.hectares.toLocaleString('pt-BR'),
      a.toneladas.toLocaleString('pt-BR'),
      a.rendimento.toLocaleString('pt-BR', { minimumFractionDigits: 1 })
    ]);
    exportToPDF('MÉTRICAS DE SAFRA E PRODUÇÃO POR FAZENDA', headers, rows, `metricas_safra_${Date.now()}`);
  };

  const handleExportXLSX = () => {
    const data = areaChartData.map(a => ({
      'Área / Fazenda': a.name,
      'Hectares (ha)': a.hectares,
      'Toneladas Colhidas (t)': a.toneladas,
      'Rendimento Média (t/ha)': a.rendimento
    }));
    exportToXLSX(data, `metricas_safra_${Date.now()}`, 'Métricas Safra');
  };

  const handleExportCSVInternal = () => {
    const data = areaChartData.map(a => ({
      'Área / Fazenda': a.name,
      'Hectares (ha)': a.hectares,
      'Toneladas Colhidas (t)': a.toneladas,
      'Rendimento Média (t/ha)': a.rendimento
    }));
    exportToCSV(data, `metricas_safra_${Date.now()}`);
  };

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Page Title & Export Options */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 shrink-0 bg-white/50 p-4 rounded-2xl border border-white backdrop-blur shadow-sm relative z-30">
        <div>
          <h2 className="text-2xl font-black text-slate-800 bg-clip-text text-transparent bg-gradient-to-r from-[#002046] to-emerald-600">Métricas de Safra e Produtividade</h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">Consolidação em tempo real da colheita e rendimento da safra atual.</p>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <ExportGenerateButton 
            onExportPDF={handleExportPDF}
            onExportXLSX={handleExportXLSX}
            onExportCSV={handleExportCSVInternal}
          />
        </div>
      </div>

      {/* Global Standardized Filters Panel (Single Horizontal Line) */}
      <div className="bg-white/80 backdrop-blur-sm border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col gap-3 shrink-0 relative z-20">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-xs uppercase tracking-wider">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filtros de Métricas de Safra:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full">
          {/* Data Inicial */}
          <div className="flex flex-col gap-1 w-full sm:w-36">
            <span className="text-[10px] uppercase font-bold text-slate-400">Data Inicial</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
            />
          </div>

          {/* Data Final */}
          <div className="flex flex-col gap-1 w-full sm:w-36">
            <span className="text-[10px] uppercase font-bold text-slate-400">Data Final</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
            />
          </div>

          {/* Fazenda / Área */}
          <div className="flex flex-col gap-1 w-full sm:w-52">
            <span className="text-[10px] uppercase font-bold text-slate-400">Fazenda / Área</span>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full bg-slate-50 border-b-2 border-slate-200 rounded-t-lg text-xs font-semibold px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600 outline-none cursor-pointer"
            >
              <option value="none">🚫 NENHUMA (Selecione uma Fazenda)</option>
              <option value="all">🌐 TODAS as Áreas / Fazendas</option>
              {areas.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Total Tons */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total de Toneladas Colhidas</span>
            <Scale className="text-emerald-700 w-5 h-5" />
          </div>
          <div className="mt-4">
            <span className="font-mono text-3xl font-black text-slate-800">
              {stats.totalTons.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
            </span>
            <span className="text-xs text-slate-500 font-bold ml-1">toneladas</span>
          </div>
        </div>

        {/* KPI 2: Average Yield */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Produtividade Média da Safra</span>
            <TrendingUp className="text-emerald-700 w-5 h-5" />
          </div>
          <div className="mt-4">
            <span className="font-mono text-3xl font-black text-emerald-800">
              {stats.averageYield.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-slate-500 font-bold ml-1">t / ha</span>
          </div>
        </div>

        {/* KPI 3: Total Hectares */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Hectares Colhidos</span>
            <Crop className="text-emerald-700 w-5 h-5" />
          </div>
          <div className="mt-4">
            <span className="font-mono text-3xl font-black text-slate-800">
              {stats.totalHa.toLocaleString('pt-BR', { minimumFractionDigits: 1 })}
            </span>
            <span className="text-xs text-slate-500 font-bold ml-1">hectares</span>
          </div>
        </div>

        {/* KPI 4: Receita Silagem */}
        <div className="bg-white border border-emerald-300 rounded-xl p-5 shadow-xs bg-emerald-50/20">
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">Receita Silagem Faturada</span>
            <DollarSign className="text-emerald-700 w-5 h-5" />
          </div>
          <div className="mt-4">
            <span className="font-mono text-3xl font-black text-emerald-900">
              R$ {stats.silagemRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Main Chart Card (7 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col min-h-[400px]">
          <h3 className="font-display font-bold text-slate-800 text-sm mb-4 flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-700" />
            <span>Toneladas Colhidas por Área / Fazenda</span>
          </h3>
          
          <div className="flex-1 w-full h-[300px] mt-2">
            {chartData.length === 0 || stats.totalTons === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-semibold">
                Nenhum dado de safra cadastrado para exibição do gráfico.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#94a3b8" 
                    fontSize={10} 
                    tickLine={false} 
                    axisLine={false}
                    unit=" t"
                  />
                  <Tooltip
                    contentStyle={{ background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#0f172a' }}
                    formatter={(value: any) => [`${parseFloat(value).toLocaleString('pt-BR')} toneladas`, 'Produção']}
                  />
                  <Bar 
                    dataKey="toneladas" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={50}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Detailed Breakdown Card (4 columns) - Answers: "preciso saber quantas toneladas foi produzido por area" */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col">
          <h3 className="font-display font-bold text-slate-800 text-sm mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
            <Scale className="w-4 h-4 text-emerald-700" />
            <span>Detalhamento por Área</span>
          </h3>

          <div className="flex-1 overflow-auto">
            <div className="space-y-4">
              {chartData.map((item, index) => {
                const totalTons = stats.totalTons || 1;
                const percentage = ((item.toneladas / totalTons) * 100).toFixed(1);
                
                return (
                  <div key={item.id} className="flex flex-col gap-1.5 p-3 rounded-lg border border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <span 
                          className="w-2.5 h-2.5 rounded-full shadow-2xs" 
                          style={{ backgroundColor: colors[index % colors.length] }} 
                        />
                        {item.name}
                      </span>
                      <span className="font-mono text-emerald-800">{item.toneladas.toLocaleString('pt-BR')} t ({percentage}%)</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold px-4">
                      <span>Cultura: <strong className="text-slate-600 font-bold">{item.culture}</strong></span>
                      <span>Rend: <strong className="text-emerald-800 font-mono">{item.yield.toLocaleString('pt-BR')} t/ha</strong></span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/30">
                      <div 
                        className="h-full rounded-full transition-all duration-500" 
                        style={{ 
                          width: `${(item.toneladas / totalTons) * 100}%`,
                          backgroundColor: colors[index % colors.length] 
                        }} 
                      />
                    </div>
                  </div>
                );
              })}
              {chartData.length === 0 && (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Nenhum dado disponível.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
