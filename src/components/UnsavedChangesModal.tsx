import React from 'react';
import { AlertTriangle, Save, LogOut, X } from 'lucide-react';

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onSaveAndExit: () => void | Promise<void>;
  onExitWithoutSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export default function UnsavedChangesModal({
  isOpen,
  onSaveAndExit,
  onExitWithoutSave,
  onCancel,
  isSaving = false
}: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-display font-black text-lg uppercase tracking-wider text-white">
                Alterações Não Salvas
              </h3>
              <p className="text-xs text-amber-100 font-medium">Atenção! Você possui lançamentos pendentes.</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer border-none bg-transparent"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 text-slate-700">
          <p className="text-sm font-medium leading-relaxed">
            Existem alterações de apontamento manual de horas que ainda não foram salvas. O que deseja fazer antes de sair?
          </p>

          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Se sair sem salvar, as alterações digitadas serão desfeitas.</span>
          </div>
        </div>

        {/* Modal Footer / Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row gap-2 justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2.5 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-xs"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={onExitWithoutSave}
            disabled={isSaving}
            className="px-4 py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Sair Sem Salvar</span>
          </button>

          <button
            type="button"
            onClick={onSaveAndExit}
            disabled={isSaving}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-emerald-700/20 border-none disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Salvando...' : 'Salvar e Sair'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
