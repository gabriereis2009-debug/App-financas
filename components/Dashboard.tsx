import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface DashboardProps {
  transactions: Transaction[];
}

const Dashboard: React.FC<DashboardProps> = ({ transactions }) => {
  const stats = useMemo(() => {
    return transactions.reduce(
      (acc, curr) => {
        if (curr.type === TransactionType.INCOME) {
          acc.income += curr.amount;
        } else {
          acc.expense += curr.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [transactions]);

  const balance = stats.income - stats.expense;

  const chartData = useMemo(() => {
    const dataMap = new Map<string, { date: string; Receita: number; Despesa: number }>();

    // Sort transactions by date first
    const sorted = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sorted.forEach((t) => {
      // Format date nicely (DD/MM)
      const dateObj = new Date(t.date);
      // Adjust for timezone offset to avoid "day before" bugs in pure visual representation
      const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
      
      const dayKey = adjustedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

      if (!dataMap.has(dayKey)) {
        dataMap.set(dayKey, { date: dayKey, Receita: 0, Despesa: 0 });
      }
      
      const entry = dataMap.get(dayKey)!;
      if (t.type === TransactionType.INCOME) {
        entry.Receita += t.amount;
      } else {
        entry.Despesa += t.amount;
      }
    });

    // Take last 7 days with activity or just all entries if small
    return Array.from(dataMap.values()).slice(-14);
  }, [transactions]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Saldo Total</p>
            <h3 className={`text-2xl font-bold mt-1 ${balance >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
              {formatCurrency(balance)}
            </h3>
          </div>
          <div className={`p-3 rounded-full ${balance >= 0 ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'}`}>
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Receitas</p>
            <h3 className="text-2xl font-bold mt-1 text-green-600">{formatCurrency(stats.income)}</h3>
          </div>
          <div className="p-3 rounded-full bg-green-50 text-green-600">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500">Despesas</p>
            <h3 className="text-2xl font-bold mt-1 text-red-600">{formatCurrency(stats.expense)}</h3>
          </div>
          <div className="p-3 rounded-full bg-red-50 text-red-600">
            <TrendingDown className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Fluxo de Caixa (Últimos Dias)</h3>
        <div className="h-80 w-full">
            {chartData.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                   <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }} 
                    dy={10}
                   />
                   <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    tickFormatter={(value) => `R$${value}`}
                   />
                   <Tooltip 
                    formatter={(value: number) => [formatCurrency(value), '']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                   />
                   <Legend wrapperStyle={{ paddingTop: '20px' }} />
                   <Bar dataKey="Receita" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
                   <Bar dataKey="Despesa" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={20} />
                 </BarChart>
               </ResponsiveContainer>
            ) : (
                <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                    Nenhum dado para exibir no gráfico ainda.
                </div>
            )}
       
        </div>
      </div>
    </div>
  );
};

export default Dashboard;