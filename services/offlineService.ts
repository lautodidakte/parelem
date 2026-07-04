
import { Transaction } from '../types';

const QUEUE_KEY = 'parelem_offline_queue';

export const isOnline = (): boolean => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

export const queueTransaction = (transaction: Transaction) => {
  const currentQueue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  currentQueue.push(transaction);
  localStorage.setItem(QUEUE_KEY, JSON.stringify(currentQueue));
};

export const getQueuedTransactions = (): Transaction[] => {
  return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
};

export const clearQueue = () => {
  localStorage.removeItem(QUEUE_KEY);
};

export const syncTransactions = async (
  onSync: (t: Transaction) => Promise<void>
) => {
  if (!isOnline()) return;
  const queue = getQueuedTransactions();
  if (queue.length === 0) return;

  console.log(`Syncing ${queue.length} transactions...`);
  
  for (const t of queue) {
    await onSync(t);
  }
  
  clearQueue();
  console.log('Sync complete');
};
