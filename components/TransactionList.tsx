import React, { useMemo } from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowDownCircle, ArrowUpCircle, Calendar } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onDelete }) => {
  
  const groupedTransactions = useMemo(() => {
    // Sort descending
    const sorted = [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const groups: { [key: string]: Transaction[] } = {};
    
    sorted.forEach(t => {
      // Create a key like "Setembro 2023"
      const dateObj = new Date(t.date);
      // Adjust timezone for display label consistency
      const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);

      const monthYear = adjustedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      const capitalized = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);
      
      if (!groups[capitalized]) {
        groups[capitalized] = [];
      }
      groups[capitalized].push(t);
    });

    return groups;
  }, [transactions]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  const formatDateDay = (dateStr: string) => {
      const dateObj = new Date(dateStr);
      const userTimezoneOffset = dateObj.getTimezoneOffset() * 60000;
      const adjustedDate = new Date(dateObj.getTime() + userTimezoneOffset);
      return adjustedDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-gray-800 font-medium text-lg">Nenhuma transação ainda</h3>
        <p className="text-gray-500">Adicione suas receitas e despesas para ver o histórico.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions).map(([month, monthTransactions]) => {
        const txs = monthTransactions as Transaction[];
        return (
        <div key={month} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">{month}</h3>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{txs.length} Lançamentos</span>
          </div>
          <div className="divide-y divide-gray-50">
            {txs.map((t) => (
              <div key={t.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                <div className="flex items-center gap-4">
                   <div className={`p-2 rounded-full ${t.type === TransactionType.INCOME ? 'bg-green-100' : 'bg-red-100'}`}>
                      {t.type === TransactionType.INCOME ? (
                        <ArrowUpCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <ArrowDownCircle className="w-5 h-5 text-red-600" />
                      )}
                   </div>
                   <div>
                     <p className="font-medium text-gray-800">{t.description}</p>
                     <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{formatDateDay(t.date)}</span>
                        <span>•</span>
                        <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{t.category}</span>
                     </div>
                   </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-green-600' : 'text-gray-800'}`}>
                    {t.type === TransactionType.INCOME ? '+' : '-'}{formatCurrency(t.amount)}
                  </p>
                  <button 
                    onClick={() => onDelete(t.id)}
                    className="text-xs text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity mt-1"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )})}
    </div>
  );
};

export default TransactionList;