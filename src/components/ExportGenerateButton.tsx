import React, { useState, useRef, useEffect } from 'react';
import { Download, ChevronDown, FileText, FileSpreadsheet, FileCode, Loader2 } from 'lucide-react';

interface ExportGenerateButtonProps {
  onExportPDF?: () => void | Promise<void>;
  onExportXLSX?: () => void | Promise<void>;
  onExportCSV?: () => void | Promise<void>;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export default function ExportGenerateButton({
  onExportPDF,
  onExportXLSX,
  onExportCSV,
  label = "EXPORTAR / GERAR",
  className = "",
  disabled = false
}: ExportGenerateButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingFormat, setLoadingFormat] = useState<'pdf' | 'xlsx' | 'csv' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleAction = async (format: 'pdf' | 'xlsx' | 'csv', action?: () => void | Promise<void>) => {
    if (!action) return;
    try {
      setLoadingFormat(format);
      await action();
    } catch (err) {
      console.error(`Erro ao gerar arquivo ${format.toUpperCase()}:`, err);
    } finally {
      setLoadingFormat(null);
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative inline-block text-left z-40 ${className}`} ref={containerRef}>
      {/* Main Unified Export Button */}
      <button
        type="button"
        disabled={disabled || loadingFormat !== null}
        onClick={() => setIsOpen(prev => !prev)}
        className="px-4 py-2.5 bg-gradient-to-r from-[#002046] to-slate-800 hover:from-slate-800 hover:to-slate-900 text-white font-sans text-xs tracking-wider uppercase font-bold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2 cursor-pointer border border-slate-700/60 disabled:opacity-50 select-none active:scale-[0.98]"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {loadingFormat ? (
          <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
        ) : (
          <Download className="w-4 h-4 text-emerald-400" />
        )}
        <span>{loadingFormat ? `Gerando ${loadingFormat.toUpperCase()}...` : label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2 w-60 bg-[#0f172a] border border-slate-700/90 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200 divide-y divide-slate-800/80"
          role="menu"
        >
          <div className="px-3.5 py-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-between">
            <span>Selecione o formato</span>
          </div>

          <div className="py-1">
            {/* Option 1: PDF */}
            {onExportPDF && (
              <button
                type="button"
                onClick={() => handleAction('pdf', onExportPDF)}
                className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white flex items-center gap-3 transition-colors cursor-pointer border-none bg-transparent"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0 shadow-xs">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">Documento PDF</span>
                  <span className="text-[10px] text-slate-400 font-normal">Relatório formatado (.pdf)</span>
                </div>
              </button>
            )}

            {/* Option 2: XLSX */}
            {onExportXLSX && (
              <button
                type="button"
                onClick={() => handleAction('xlsx', onExportXLSX)}
                className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white flex items-center gap-3 transition-colors cursor-pointer border-none bg-transparent"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">Planilha Excel</span>
                  <span className="text-[10px] text-slate-400 font-normal">Planilha nativa (.xlsx)</span>
                </div>
              </button>
            )}

            {/* Option 3: CSV */}
            {onExportCSV && (
              <button
                type="button"
                onClick={() => handleAction('csv', onExportCSV)}
                className="w-full text-left px-3.5 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800/80 hover:text-white flex items-center gap-3 transition-colors cursor-pointer border-none bg-transparent"
                role="menuitem"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-800/90 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-xs">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white">Arquivo CSV</span>
                  <span className="text-[10px] text-slate-400 font-normal">Dados estruturados (.csv)</span>
                </div>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
