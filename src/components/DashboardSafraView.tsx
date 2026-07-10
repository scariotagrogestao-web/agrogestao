import React, { useMemo } from 'react';
import { Landmark, Scale, Crop, TrendingUp, DollarSign } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Producao, Area } from '../types/agro';

interface DashboardSafraViewProps {
  producoes: Producao[];
  areas: Area[];
}

export default function DashboardSafraView({
  producoes,
  areas
}: DashboardSafraViewProps) {
  // 1. KPI Calculations
  const stats = useMemo(() => {
    let totalTons = 0;
    let totalHa = 0;
    
    producoes.forEach(p => {
      totalTons += p.toneladas;
      totalHa += p.hectares;
    });

    const averageYield = totalHa > 0 ? totalTons / totalHa : 0;

    return {
      totalTons: parseFloat(totalTons.toFixed(2)),
      totalHa: parseFloat(totalHa.toFixed(2)),
      averageYield
    };
  }, [producoes]);

  // 2. Chart Data: Aggregated Tons per Area
  const chartData = useMemo(() => {
    const areaMap: Record<string, { name: string; culture: string; toneladas: number; hectares: number }> = {};
    
    // Initialize map with all areas
    areas.forEach(a => {
      areaMap[a.id] = { name: a.name, culture: a.culture, toneladas: 0, hectares: 0 };
    });

    // Populate with production data
    producoes.forEach(p => {
      if (areaMap[p.areaId]) {
        areaMap[p.areaId].toneladas += p.toneladas;
        areaMap[p.areaId].hectares += p.hectares;
      }
    });

    return Object.entries(areaMap)
      .map(([id, val]) => ({
        id,
        name: val.name,
        culture: val.culture,
        toneladas: parseFloat(val.toneladas.toFixed(2)),
        hectares: parseFloat(val.hectares.toFixed(2)),
        yield: val.hectares > 0 ? parseFloat((val.toneladas / val.hectares).toFixed(2)) : 0
      }))
      .sort((a, b) => b.toneladas - a.toneladas);
  }, [producoes, areas]);

  const colors = ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7'];

  return (
    <div className="flex flex-col gap-6 fade-in">
      {/* Page Title */}
      <div className="page-title shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Painel Geral de Produtividade</h2>
          <p className="text-xs text-slate-500 mt-1">Consolidação em tempo real da colheita e rendimento da safra atual.</p>
        </div>
      </div>

      {/* KPI Cards (3 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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
