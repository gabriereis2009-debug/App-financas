export enum TransactionType {
  INCOME = 'receita',
  EXPENSE = 'despesa'
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO string YYYY-MM-DD
  category: string;
}

export interface DailyStat {
  date: string;
  income: number;
  expense: number;
}