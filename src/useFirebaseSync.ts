import { useState, useEffect, useCallback } from 'react';
import { db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';

export function useFirebaseSync<T>(docKey: string, initialLocalData: T[]) {
  // Inicializamos com o dado local para a UI renderizar rápido
  const [data, setData] = useState<T[]>(initialLocalData);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const docRef = doc(db, 'agrodata', docKey);
    
    // Tenta migrar os dados do localStorage para o Firebase se o documento não existir na nuvem
    getDoc(docRef).then(snap => {
      if (!snap.exists() && initialLocalData.length > 0) {
        setDoc(docRef, { items: initialLocalData });
      }
    });

    // Escuta as mudanças em tempo real do Firebase
    const unsub = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const cloudData = snap.data().items;
        if (cloudData) {
          setData(cloudData as T[]);
        }
      }
      setLoaded(true);
    });
    
    return unsub;
  }, [docKey]);

  // Função para atualizar os dados localmente E na nuvem
  const updateData = useCallback((newData: T[] | ((prev: T[]) => T[])) => {
    setData((prevData) => {
      const resolvedData = typeof newData === 'function' ? (newData as Function)(prevData) : newData;
      
      // Salva no Firebase de forma assíncrona para não travar a UI
      setDoc(doc(db, 'agrodata', docKey), { items: resolvedData }).catch(err => {
        console.error("Erro ao salvar no Firebase:", err);
      });
      
      return resolvedData;
    });
  }, [docKey]);

  return [data, updateData, loaded] as const;
}
