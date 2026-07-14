import React, { useState, useEffect, useMemo } from 'react';
import { useFirebaseSync } from './useFirebaseSync';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import RegistriesView from './components/RegistriesView';
import MachineHoursView from './components/MachineHoursView';
import ExpensesView from './components/ExpensesView';
import ProducaoEntryView from './components/ProducaoEntryView';
import PagamentoReportView from './components/PagamentoReportView';
import DashboardSafraView from './components/DashboardSafraView';
import SettingsView from './components/SettingsView';
import * as XLSX from 'xlsx';
import logoAgrogestao from './logo_agrogestao.png';
import logoIdeia from './logo_ideia.jpeg';

  // Add rendering for Settings view
  // After existing view conditions, add:
  // {currentView === 'settings' && isAdmin && (
  //   <SettingsView customUsers={customUsers} setCustomUsers={setCustomUsers} />
  // )}


import { initialClientsAndVehicles, initialExpenses, initialLocalitySheets } from './initialData';
import { ClientOrVehicle, LocalitySheet, Expense, HourlyReading, MachineConfig, AuditLog } from './types';
import HistoryView from './components/HistoryView';

import { Motorista, Area, Maquina, Producao } from './types/agro';
import { 
  initialMotoristas, 
  initialAreas, 
  initialMaquinas, 
  initialProducoes, 
  getWeekString 
} from './utils/agroHelpers';

import { 
  RotateCcw, 
  Download, 
  Upload, 
  Database,
  FileSpreadsheet,
  Trash2
} from 'lucide-react';

import { CustomUser } from './components/SettingsView';

export default function App() {
  // Navigation
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [globalSearch, setGlobalSearch] = useState<string>('');

  // Authentication States
  const [currentUser, setCurrentUser] = useState<string | null>(() => localStorage.getItem('agrog_user'));
  const [rememberUser, setRememberUser] = useState<boolean>(true);
  const [username, setUsername] = useState(() => (localStorage.getItem('agrog_remember') === 'true' ? localStorage.getItem('agrog_saved_username') || '' : ''));
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Forgot Password States
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotContact, setForgotContact] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const getLocal = (key: string, initial: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initial;
  };

  const [customUsers, setCustomUsers] = useFirebaseSync<CustomUser>(
    'agrog_custom_users', 
    getLocal('agrog_custom_users', [{ username: 'anderson', password: 'AgroGestao10726', role: 'admin' }])
  );

  // 1. Core Original App States
  const [clientsAndVehicles, setClientsAndVehicles] = useFirebaseSync<ClientOrVehicle[]>(
    'agrog_clients', 
    getLocal('agrog_clients', initialClientsAndVehicles)
  );
  const [localitySheets, setLocalitySheets] = useFirebaseSync<LocalitySheet[]>(
    'agrog_sheets', 
    getLocal('agrog_sheets', initialLocalitySheets)
  );
  const [expenses, setExpenses] = useFirebaseSync<Expense[]>(
    'agrog_expenses', 
    getLocal('agrog_expenses', initialExpenses)
  );

  // 2. New Safra App States
  const [motoristas, setMotoristas] = useFirebaseSync<Motorista[]>(
    'agrog_motoristas', 
    getLocal('agrog_motoristas', initialMotoristas)
  );
  const [areas, setAreas] = useFirebaseSync<Area[]>(
    'agrog_areas', 
    getLocal('agrog_areas', initialAreas)
  );
  const [maquinas, setMaquinas] = useFirebaseSync<Maquina[]>(
    'agrog_maquinas', 
    getLocal('agrog_maquinas', initialMaquinas)
  );
  const [producoes, setProducoes] = useFirebaseSync<Producao[]>(
    'agrog_producoes', 
    getLocal('agrog_producoes', initialProducoes)
  );

  const [auditLogs, setAuditLogs] = useFirebaseSync<AuditLog[]>(
    'agrog_audit_logs',
    getLocal('agrog_audit_logs', [])
  );
  const isCurrentUserAdmin = useMemo(() => {
    if (currentUser === 'admin') return true;
    const found = customUsers.find(u => u.username === currentUser);
    return found?.role === 'admin';
  }, [currentUser, customUsers]);

  // Migrate 'admin' user into customUsers if missing
  useEffect(() => {
    setCustomUsers(prev => {
      if (!prev.find(u => u.username === 'admin')) {
        return [{ username: 'admin', password: '041912', role: 'admin' }, ...prev];
      }
      return prev;
    });
  }, [setCustomUsers]);

  // Security guard for non-admin settings access
  useEffect(() => {
    if (!isCurrentUserAdmin && (currentView === 'settings' || currentView === 'history')) {
      setCurrentView('dashboard');
    }
  }, [isCurrentUserAdmin, currentView]);

  const addAuditLog = (action: string, details: string, overrideUser?: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      user: overrideUser || currentUser || 'Desconhecido',
      action,
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const uLower = username.toLowerCase().trim();
    // Check system admin
    const isSystemAdmin = uLower === 'admin' && password === '041912';
    
    // Check custom user
    const matchedUser = customUsers.find(u => u.username.toLowerCase().trim() === uLower);
    const isCustomUser = matchedUser && matchedUser.password === password;

    if (isSystemAdmin || isCustomUser) {
      setCurrentUser(uLower);
      localStorage.setItem('agrog_user', uLower);
      
      if (rememberUser) {
        localStorage.setItem('agrog_saved_username', username);
        localStorage.setItem('agrog_remember', 'true');
      } else {
        localStorage.removeItem('agrog_saved_username');
        localStorage.setItem('agrog_remember', 'false');
      }
      
      setLoginError('');
      setPassword('');
      addAuditLog('Login', `Entrou no sistema.`, uLower);
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    addAuditLog('Logout', `Saiu do sistema.`);
    setCurrentUser(null);
    localStorage.removeItem('agrog_user');
    setCurrentView('dashboard');
  };

  const handleSendForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotUsername || !forgotContact) {
      alert("Preencha seu usuário e contato.");
      return;
    }
    setForgotLoading(true);
    try {
      const response = await fetch("https://formsubmit.co/ajax/jmarcos0484@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: "Sistema AgroGestão",
          message: `O usuário "${forgotUsername}" está solicitando a redefinição de senha.\nContato fornecido: ${forgotContact}`,
          _subject: "AgroGestão: Solicitação de Alteração de Senha",
          _captcha: "false"
        })
      });

      if (response.ok) {
        alert("Sua solicitação foi enviada com sucesso! O administrador entrará em contato com você em breve.");
        setShowForgotModal(false);
        setForgotUsername('');
        setForgotContact('');
      } else {
        alert("Ocorreu um erro ao enviar. Por favor, avise o administrador diretamente.");
      }
    } catch (error) {
      alert("Falha de conexão. Tente novamente mais tarde.");
    } finally {
      setForgotLoading(false);
    }
  };

  // Registry (Cadastro Geral) actions
  const handleAddClientOrVehicle = (item: ClientOrVehicle) => {
    setClientsAndVehicles(prev => [...prev, item]);
    addAuditLog('Cadastro', `Adicionou cliente/veículo: ${item.name}`);
  };
  const handleEditClientOrVehicle = (updated: ClientOrVehicle) => {
    setClientsAndVehicles(prev => prev.map(c => c.id === updated.id ? updated : c));
    addAuditLog('Cadastro', `Alterou cliente/veículo: ${updated.name}`);
  };
  const handleDeleteClientOrVehicle = (id: string) => {
    const item = clientsAndVehicles.find(c => c.id === id);
    setClientsAndVehicles(prev => prev.filter(c => c.id !== id));
    addAuditLog('Cadastro', `Removeu cliente/veículo: ${item?.name || id}`);
  };

  const handleAddArea = (item: Area) => {
    setAreas(prev => [...prev, item]);
    addAuditLog('Cadastro', `Adicionou área: ${item.nome}`);
  };
  const handleEditArea = (updated: Area) => {
    setAreas(prev => prev.map(a => a.id === updated.id ? updated : a));
    addAuditLog('Cadastro', `Alterou área: ${updated.nome}`);
  };
  const handleDeleteArea = (id: string) => {
    const item = areas.find(a => a.id === id);
    setAreas(prev => prev.filter(a => a.id !== id));
    addAuditLog('Cadastro', `Removeu área: ${item?.nome || id}`);
  };

  const handleAddMotorista = (item: Motorista) => {
    setMotoristas(prev => [...prev, item]);
    addAuditLog('Cadastro', `Adicionou motorista: ${item.nome}`);
  };
  const handleEditMotorista = (updated: Motorista) => {
    setMotoristas(prev => prev.map(m => m.id === updated.id ? updated : m));
    addAuditLog('Cadastro', `Alterou motorista: ${updated.nome}`);
  };
  const handleDeleteMotorista = (id: string) => {
    const item = motoristas.find(m => m.id === id);
    setMotoristas(prev => prev.filter(m => m.id !== id));
    addAuditLog('Cadastro', `Removeu motorista: ${item?.nome || id}`);
  };

  // Horimeter sheet actions
  const handleUpdateReadings = (sheetId: string, machineId: string, date: string, reading: HourlyReading) => {
    setLocalitySheets(prev => prev.map(s => {
      if (s.id !== sheetId) return s;
      const machine = s.machines.find(m => m.id === machineId);
      if (machine) {
        addAuditLog('Horas-Máquina', `Atualizou horas da máquina ${machine.name} no dia ${date}`);
      }
      return {
        ...s,
        machines: s.machines.map(m => {
          if (m.id !== machineId) return m;
          return {
            ...m,
            readings: {
              ...m.readings,
              [date]: reading
            }
          };
        })
      };
    }));
  };

  const handleAddMachine = (sheetId: string, machine: Partial<MachineConfig>) => {
    setLocalitySheets(prev => prev.map(s => {
      if (s.id !== sheetId) return s;
      const newMachine: MachineConfig = {
        id: machine.id || `M_${Date.now()}`,
        name: machine.name || '',
        ratePerHour: machine.ratePerHour || 0,
        readings: machine.readings || {}
      };
      addAuditLog('Horas-Máquina', `Adicionou máquina: ${newMachine.name} na localidade ${s.name}`);
      return {
        ...s,
        machines: [...s.machines, newMachine]
      };
    }));
  };

  const handleDeleteMachine = (sheetId: string, machineId: string) => {
    setLocalitySheets(prev => prev.map(s => {
      if (s.id !== sheetId) return s;
      const machine = s.machines.find(m => m.id === machineId);
      if (machine) {
        addAuditLog('Horas-Máquina', `Removeu máquina: ${machine.name} da localidade ${s.name}`);
      }
      return {
        ...s,
        machines: s.machines.filter(m => m.id !== machineId)
      };
    }));
  };

  const handleAddLocality = (name: string): string => {
    const newId = `sheet_${Date.now()}`;
    const newSheet: LocalitySheet = {
      id: newId,
      name,
      machines: [],
      dates: ["09/jun", "10/jun", "11/jun", "12/jun", "13/jun", "14/jun", "15/jun", "16/jun", "17/jun", "18/jun", "19/jun", "20/jun", "21/jun", "22/jun"]
    };
    setLocalitySheets(prev => [...prev, newSheet]);
    addAuditLog('Horas-Máquina', `Criou a localidade: ${name}`);
    return newId;
  };

  const handleDeleteLocality = (sheetId: string) => {
    const sheet = localitySheets.find(s => s.id === sheetId);
    setLocalitySheets(prev => prev.filter(s => s.id !== sheetId));
    addAuditLog('Horas-Máquina', `Removeu a localidade: ${sheet?.name || sheetId}`);
  };

  const handleAddDate = (sheetId: string, dateStr: string) => {
    setLocalitySheets(prev => prev.map(s => {
      if (s.id !== sheetId) return s;
      if (s.dates.includes(dateStr)) return s;
      addAuditLog('Horas-Máquina', `Adicionou data ${dateStr} na localidade ${s.name}`);
      return {
        ...s,
        dates: [...s.dates, dateStr]
      };
    }));
  };

  // Expense actions
  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `E_${Date.now()}`
    };
    setExpenses(prev => [...prev, newExpense]);
    addAuditLog('Despesas', `Adicionou despesa: ${expense.type} de R$ ${expense.value}`);
  };

  const handleDeleteExpense = (id: string) => {
    const exp = expenses.find(e => e.id === id);
    setExpenses(prev => prev.filter(e => e.id !== id));
    addAuditLog('Despesas', `Removeu despesa: ${exp?.type || id}`);
  };

  // Production actions
  const handleAddProducao = (prod: Omit<Producao, 'id' | 'semana'>) => {
    const semana = getWeekString(prod.date);
    const newRecord: Producao = {
      ...prod,
      id: `P_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      semana
    };
    setProducoes(prev => [...prev, newRecord]);
    addAuditLog('Produção', `Lançou produção de ${prod.pesoRealTotal || 0}kg para área ${prod.areaId}`);
  };

  const handleDeleteProducao = (id: string) => {
    const prod = producoes.find(p => p.id === id);
    setProducoes(prev => prev.filter(p => p.id !== id));
    addAuditLog('Produção', `Removeu produção da área ${prod?.areaId || id}`);
  };

  const handleEditProducao = (updated: Producao) => {
    setProducoes(prev => prev.map(p => p.id === updated.id ? updated : p));
    addAuditLog('Produção', `Alterou produção da área ${updated.areaId}`);
  };

  // Reset database back to default initial values
  const handleResetDatabase = () => {
    if (confirm('Deseja realmente redefinir o banco de dados? Todos os seus lançamentos de despesas, horímetros e safra serão restaurados para o padrão original.')) {
      setClientsAndVehicles(initialClientsAndVehicles);
      setLocalitySheets(initialLocalitySheets);
      setExpenses(initialExpenses);
      setMotoristas(initialMotoristas);
      setAreas(initialAreas);
      setMaquinas(initialMaquinas);
      setProducoes(initialProducoes);
      addAuditLog('Sistema', `Redefiniu o banco de dados completo.`);
      alert('Banco de dados redefinido com sucesso!');
    }
  };

  // Export Data to JSON
  const handleExportData = () => {
    const dataStr = JSON.stringify({
      clientsAndVehicles,
      localitySheets,
      expenses,
      motoristas,
      areas,
      maquinas,
      producoes
    }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `agrogestao_backup_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  // Import Data from JSON
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.clientsAndVehicles && parsed.localitySheets && parsed.expenses) {
          setClientsAndVehicles(parsed.clientsAndVehicles);
          setLocalitySheets(parsed.localitySheets);
          setExpenses(parsed.expenses);
          if (parsed.motoristas) setMotoristas(parsed.motoristas);
          if (parsed.areas) setAreas(parsed.areas);
          if (parsed.maquinas) setMaquinas(parsed.maquinas);
          if (parsed.producoes) setProducoes(parsed.producoes);
          alert('Banco de dados importado com sucesso!');
        } else {
          alert('Formato de backup inválido. Chaves fundamentais não encontradas.');
        }
      } catch (err) {
        alert('Erro ao ler arquivo de backup JSON.');
      }
    };
    reader.readAsText(file);
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const arrayBuffer = evt.target?.result;
        if (!arrayBuffer) return;

        const data = new Uint8Array(arrayBuffer as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        
        let newVehicles = [...clientsAndVehicles];
        let newLocalitySheets = [...localitySheets];
        let newExpenses = [...expenses];
        let newMotoristas = [...motoristas];
        let newAreas = [...areas];
        let newMaquinas = [...maquinas];

        const findOrCreateDriver = (name: string) => {
          const normalized = name.toLowerCase().trim();
          let found = newMotoristas.find(m => m.name.toLowerCase().trim() === normalized);
          if (!found) {
            found = {
              id: `M${(newMotoristas.length + 1).toString().padStart(2, '0')}_${Math.floor(Math.random() * 100)}`,
              name: name.trim(),
              ratePerHectare: 50.00,
              status: 'Ativo'
            };
            newMotoristas.push(found);
          }
        };

        const getDriverNameForMachine = (machineName: string) => {
          const d = machineName.toLowerCase();
          if (d.includes('rogerio')) return 'Rogério';
          if (d.includes('marcos')) return 'Marcos';
          if (d.includes('chico')) return 'Chico';
          if (d.includes('rodrigo')) return 'Rodrigo';
          if (d.includes('leonir')) return 'Leonir';
          if (d.includes('cowboy')) return 'Cowboy';
          if (d.includes('bigode')) return 'Bigode';
          if (d.includes('eduardo')) return 'Eduardo';
          return null;
        };

        const findOrCreateVehicle = (name: string, rate: number) => {
          const normalized = name.toLowerCase().replace(/\s/g, '');
          let found = newVehicles.find(v => v.name.toLowerCase().replace(/\s/g, '') === normalized);
          if (!found) {
            let vType: 'Máquina' | 'Caminhão' | 'Cliente/Setor' = 'Máquina';
            if (name.toLowerCase().includes('caminhão') || name.toLowerCase().includes('volks') || name.toLowerCase().includes('cargo') || name.toLowerCase().includes('mula') || name.toLowerCase().includes('rodrigo') || name.toLowerCase().includes('bigode') || name.toLowerCase().includes('eduardo') || name.toLowerCase().includes('1620') || name.toLowerCase().includes('constellation') || name.toLowerCase().includes('carreta')) {
              vType = 'Caminhão';
            }
            found = {
              id: `V${(newVehicles.length + 1).toString().padStart(2, '0')}_${Math.floor(Math.random() * 100)}`,
              name: name.trim(),
              type: vType,
              details: `${vType} importado via Excel`,
              plateOrFleet: `FROTA-${name.toUpperCase().replace(/\s/g, '')}`,
              responsible: getDriverNameForMachine(name) || '-',
              status: 'Ativo',
              rate: rate || 0
            };
            newVehicles.push(found);

            newMaquinas.push({
              id: `MA${(newMaquinas.length + 1).toString().padStart(2, '0')}_${Math.floor(Math.random() * 100)}`,
              name: name.trim(),
              type: vType === 'Caminhão' ? 'Caminhão' : 'Trator'
            });
          } else {
            if (rate && (!found.rate || found.rate === 0)) {
              found.rate = rate;
            }
          }
          return found;
        };

        const excelDateToDateStr = (excelDate: number) => {
          const date = new Date((excelDate - 25569) * 86400 * 1000);
          const day = String(date.getUTCDate()).padStart(2, '0');
          const months = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
          const month = months[date.getUTCMonth()];
          return `${day}/${month}`;
        };

        const excelDateToISO = (excelDate: number) => {
          const date = new Date((excelDate - 25569) * 86400 * 1000);
          return date.toISOString().split('T')[0];
        };

        workbook.SheetNames.forEach((sheetName) => {
          if (sheetName.toLowerCase().includes('matriz') || sheetName.toLowerCase().includes('acerto') || sheetName.toLowerCase().includes('planilha')) {
            return;
          }

          const sheet = workbook.Sheets[sheetName];
          const dataRows = XLSX.utils.sheet_to_json<any[]>(sheet, { header: 1, defval: '' });
          if (dataRows.length < 5) return;

          let headerRowIdx = -1;
          for (let rIdx = 0; rIdx < dataRows.length; rIdx++) {
            const row = dataRows[rIdx];
            if (row && row.some(cell => typeof cell === 'string' && cell.toLowerCase().includes('hora inicial'))) {
              headerRowIdx = rIdx - 1;
              break;
            }
          }

          if (headerRowIdx === -1) return;

          const sheetMachines: { name: string; ratePerHour: number; colIdx: number }[] = [];
          const headerRow = dataRows[headerRowIdx];

          for (let col = 1; col < headerRow.length; col += 3) {
            const mName = headerRow[col];
            const rate = parseFloat(headerRow[col + 2]) || 0;
            const mNameStr = String(mName || '').trim();

            if (mNameStr === '') break;

            const mNameLower = mNameStr.toLowerCase();
            if (mNameLower.includes('data') || mNameLower.includes('despesa') || mNameLower.includes('descri') || mNameLower.includes('coluna') || mNameLower.includes('valor')) {
              continue;
            }

            const cleanedName = mNameStr.replace(/\s+/g, ' ');
            const driverName = getDriverNameForMachine(cleanedName);
            if (driverName) findOrCreateDriver(driverName);

            const vehicle = findOrCreateVehicle(cleanedName, rate);
            sheetMachines.push({
              name: cleanedName,
              ratePerHour: rate || vehicle.rate || 0,
              colIdx: col
            });
          }

          // Area / Fazenda
          const areaId = `A${(newAreas.length + 1).toString().padStart(2, '0')}_${Math.floor(Math.random() * 100)}`;
          if (!newAreas.some(a => a.name.toLowerCase().trim() === sheetName.toLowerCase().trim())) {
            newAreas.push({
              id: areaId,
              name: sheetName.trim(),
              culture: 'Silagem',
              sizeHectares: 150
            });
          }

          // LocalitySheet
          const sheetId = sheetName.toLowerCase().trim().replace(/\s+/g, '-');
          let localSheet = newLocalitySheets.find(s => s.id === sheetId);
          if (!localSheet) {
            localSheet = {
              id: sheetId,
              name: sheetName.trim(),
              machines: [],
              dates: []
            };
            newLocalitySheets.push(localSheet);
          }

          sheetMachines.forEach((sm) => {
            let machConfig = localSheet!.machines.find(m => m.name.toLowerCase() === sm.name.toLowerCase());
            if (!machConfig) {
              machConfig = {
                id: `M_${Date.now()}_${Math.floor(Math.random() * 100)}`,
                name: sm.name,
                ratePerHour: sm.ratePerHour,
                readings: {}
              };
              localSheet!.machines.push(machConfig);
            }
          });

          for (let rIdx = headerRowIdx + 2; rIdx < dataRows.length; rIdx++) {
            const row = dataRows[rIdx];
            if (!row || typeof row[0] !== 'number' || row[0] < 40000) continue;

            const dateStr = excelDateToDateStr(row[0]);
            if (!localSheet.dates.includes(dateStr)) {
              localSheet.dates.push(dateStr);
            }

            sheetMachines.forEach((sm) => {
              const initVal = row[sm.colIdx];
              const finVal = row[sm.colIdx + 1];

              if (initVal !== '' && finVal !== '' && initVal !== undefined && finVal !== undefined) {
                const machConfig = localSheet!.machines.find(m => m.name.toLowerCase() === sm.name.toLowerCase());
                if (machConfig) {
                  machConfig.readings[dateStr] = {
                    initial: String(initVal),
                    final: String(finVal)
                  };
                }
              }
            });

            // Expenses
            if (row.length > 17 && row[16] !== '' && row[17] !== '') {
              const expDateExcel = row[16];
              const expType = String(row[17]).toLowerCase().trim();
              const expDesc = String(row[18] || '').trim();
              const expVal = parseFloat(row[19]) || 0;

              if (typeof expDateExcel === 'number' && expDateExcel > 40000 && expVal > 0) {
                const isoDate = excelDateToISO(expDateExcel);
                const isDup = newExpenses.some(e => e.date === isoDate && e.type === expType && e.value === expVal);

                if (!isDup) {
                  const expMach = smNameFromDesc(expDesc);
                  const expDriver = driverNameFromDesc(expDesc);
                  if (expDriver) findOrCreateDriver(expDriver);

                  newExpenses.push({
                    id: `E_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
                    date: isoDate,
                    type: expType === 'hospedagem e alimentação' ? 'alimentação' : expType,
                    value: expVal,
                    machineName: expMach || undefined,
                    responsibleName: expDriver || undefined,
                    localityName: sheetName.trim()
                  });
                }
              }
            }
          }
        });

        setClientsAndVehicles(newVehicles);
        setLocalitySheets(newLocalitySheets);
        setExpenses(newExpenses);
        setMotoristas(newMotoristas);
        setAreas(newAreas);
        setMaquinas(newMaquinas);

        alert(`Planilha Excel importada com sucesso!\n- Total de veículos cadastrados: ${newVehicles.length}\n- Localidades de horímetro: ${newLocalitySheets.length}\n- Despesas registradas: ${newExpenses.length}`);
      } catch (err: any) {
        alert('Erro ao importar planilha Excel: ' + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExportAllSpreadsheets = () => {
    handleExportData();
    alert('Dados de planilhas exportados em backup JSON com sucesso.');
  };

  if (!currentUser) {
    return (
      <>
        <div className="min-h-screen bg-slate-950 flex flex-col p-6 text-slate-100 font-sans antialiased">
          <div className="flex-1 flex items-center justify-center w-full">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-6 animate-in fade-in zoom-in-95 duration-200">
          <img 
            src={logoAgrogestao} 
            alt="AgroGestão Logo" 
            className="w-40 h-40 object-contain rounded-full shadow-lg border border-slate-800/50 bg-emerald-950/20 p-2" 
          />
          <div className="text-center">
            <h2 className="text-2xl font-black text-emerald-400">Acesso ao Sistema</h2>
            <p className="text-xs text-slate-400 mt-1">Insira suas credenciais para entrar na plataforma</p>
          </div>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-xs font-semibold text-center">
                {loginError}
              </div>
            )}
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="username" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Usuário</label>
              <input 
                id="username"
                name="username"
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: Admin"
                autoComplete="username"
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-lg text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-100"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Senha</label>
              <div className="relative">
                <input 
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full p-3 pr-16 bg-slate-950 border border-slate-800 rounded-lg text-sm outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 text-slate-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-[10px] font-bold uppercase tracking-wider cursor-pointer border-none bg-transparent select-none"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-1">
              <input
                type="checkbox"
                id="rememberUser"
                checked={rememberUser}
                onChange={(e) => setRememberUser(e.target.checked)}
                className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 text-emerald-600 focus:ring-emerald-600 focus:ring-offset-slate-950 cursor-pointer accent-emerald-600"
              />
              <label htmlFor="rememberUser" className="text-xs text-slate-400 cursor-pointer select-none">
                Lembrar meu usuário (salvar acesso)
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase py-3.5 rounded-lg hover:bg-emerald-800 transition-colors shadow-lg cursor-pointer mt-2"
            >
              Confirmar Acesso
            </button>

            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="w-full text-center text-[10px] text-slate-400 hover:text-emerald-400 font-bold uppercase tracking-wider transition-colors mt-3 bg-transparent border-none cursor-pointer"
            >
              Solicitar Alteração de Senha
            </button>
          </form>
        </div>
      </div>
      <footer className="bg-slate-950 border-t border-slate-800/50 py-4 mt-auto flex flex-col md:flex-row items-center justify-center gap-4 text-center shrink-0 w-full px-6">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          © 2026 AgroGestão ERP — Sistema Integrado de Controle Agrícola & Safra
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-700"></div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-[10px] text-slate-400 font-medium tracking-wide">
          <span>Todos os Direitos Reservados - IdeIA Gestão e Criação - By Joao Marcos Alves</span>
          <img src={logoIdeia} alt="IdeIA Logo" className="h-6 w-auto object-contain rounded brightness-110" />
        </div>
      </footer>
    </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-2xl max-w-sm w-full">
            <h3 className="text-emerald-400 font-bold text-lg mb-2">Esqueci minha senha</h3>
            <p className="text-slate-400 text-xs mb-4">
              Preencha os dados abaixo. O administrador receberá um e-mail com a sua solicitação.
            </p>
            <form onSubmit={handleSendForgotPassword} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seu Nome de Usuário</label>
                <input
                  type="text"
                  value={forgotUsername}
                  onChange={(e) => setForgotUsername(e.target.value)}
                  placeholder="ex: anderson"
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Seu WhatsApp / E-mail</label>
                <input
                  type="text"
                  value={forgotContact}
                  onChange={(e) => setForgotContact(e.target.value)}
                  placeholder="Para receber a nova senha..."
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 outline-none focus:border-emerald-600"
                  required
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="flex-1 bg-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="flex-1 bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {forgotLoading ? 'Enviando...' : 'Enviar Pedido'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans antialiased text-slate-100">
      <Header 
        searchQuery={globalSearch} 
        onSearchChange={setGlobalSearch} 
        currentView={currentView}
        onNavigate={setCurrentView}
        placeholder={currentView === 'expenses' ? "Filtrar por despesa ou motorista..." : "Buscar nos registros..."}
        isAdmin={isCurrentUserAdmin}
        onLogout={handleLogout}
      />

      <main className="flex-1 p-6 max-w-7xl mx-auto w-full flex flex-col gap-6 overflow-y-auto">
        {currentView === 'dashboard' && (
          <DashboardView 
            localitySheets={localitySheets}
            expenses={expenses}
            clientsAndVehicles={clientsAndVehicles}
            onNavigate={setCurrentView}
            onExport={handleExportAllSpreadsheets}
          />
        )}
        
        {currentView === 'registries' && (
          <RegistriesView 
            clientsAndVehicles={clientsAndVehicles}
            onAddVehicle={handleAddClientOrVehicle}
            onEditVehicle={handleEditClientOrVehicle}
            onDeleteVehicle={handleDeleteClientOrVehicle}
            
            areas={areas}
            onAddArea={handleAddArea}
            onEditArea={handleEditArea}
            onDeleteArea={handleDeleteArea}
 
            motoristas={motoristas}
            onAddMotorista={handleAddMotorista}
            onEditMotorista={handleEditMotorista}
            onDeleteMotorista={handleDeleteMotorista}
          />
        )}
 
        {currentView === 'hours' && (
          <MachineHoursView 
            localitySheets={localitySheets}
            clientsAndVehicles={clientsAndVehicles}
            onUpdateReadings={handleUpdateReadings}
            onAddMachine={handleAddMachine}
            onDeleteMachine={handleDeleteMachine}
            onAddLocality={handleAddLocality}
            onDeleteLocality={handleDeleteLocality}
            onAddDate={handleAddDate}
            onExport={handleExportAllSpreadsheets}
          />
        )}
 
        {currentView === 'production' && (
          <ProducaoEntryView 
            producoes={producoes}
            areas={areas}
            maquinas={maquinas}
            motoristas={motoristas}
            onAddProducao={handleAddProducao}
            onEditProducao={handleEditProducao}
            onDeleteProducao={handleDeleteProducao}
          />
        )}
 
        {currentView === 'payments' && (
          <PagamentoReportView 
            producoes={producoes}
            areas={areas}
            maquinas={maquinas}
            motoristas={motoristas}
          />
        )}
 
        {currentView === 'safraDashboard' && (
          <DashboardSafraView 
            producoes={producoes} 
            areas={areas} 
          />
        )}
 
        {currentView === 'expenses' && (
          <ExpensesView 
            expenses={expenses}
            clientsAndVehicles={clientsAndVehicles}
            onAddExpense={handleAddExpense}
            onDeleteExpense={handleDeleteExpense}
            onExport={handleExportAllSpreadsheets}
          />
        )}
 
        {currentView === 'settings' && (
          <SettingsView
            customUsers={customUsers}
            setCustomUsers={setCustomUsers}
            handleExportData={handleExportData}
            handleImportData={handleImportData}
            isAdmin={isCurrentUserAdmin}
            auditLogs={auditLogs}
          />
        )}
      </main>
 
      <footer className="bg-slate-950 border-t border-slate-800/50 py-4 flex flex-col md:flex-row items-center justify-center gap-4 text-center shrink-0 w-full px-6">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          © 2026 AgroGestão ERP — Sistema Integrado de Controle Agrícola & Safra
        </div>
        <div className="hidden md:block w-px h-4 bg-slate-700"></div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 text-[10px] text-slate-400 font-medium tracking-wide">
          <span>Todos os Direitos Reservados - IdeIA Gestão e Criação - By Joao Marcos Alves</span>
          <img src={logoIdeia} alt="IdeIA Logo" className="h-6 w-auto object-contain rounded brightness-110" />
        </div>
      </footer>
    </div>
  );
}
