import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { PlusCircle } from 'lucide-react';

interface TransactionFormProps {
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onAddTransaction }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date) return;

    onAddTransaction({
      description,
      amount: parseFloat(amount),
      type,
      date,
      category: category || 'Geral'
    });

    // Reset form
    setDescription('');
    setAmount('');
    setCategory('');
    // Keep date as is or reset to today? keeping as is for easy multiple entry
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Nova Transação</h3>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        
        <div className="lg:col-span-4">
          <label className="block text-xs font-medium text-gray-500 mb-1">Descrição</label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Supermercado"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Valor (R$)</label>
          <input
            type="number"
            required
            step="0.01"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo</label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setType(TransactionType.INCOME)}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                type === TransactionType.INCOME 
                  ? 'bg-white text-green-700 shadow-sm font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setType(TransactionType.EXPENSE)}
              className={`flex-1 py-1.5 px-2 text-sm rounded-md transition-all ${
                type === TransactionType.EXPENSE 
                  ? 'bg-white text-red-700 shadow-sm font-medium' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Despesa
            </button>
          </div>
        </div>

        <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Data</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
        
         <div className="lg:col-span-2">
          <label className="block text-xs font-medium text-gray-500 mb-1">Categoria</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Ex: Alimentação"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="lg:col-span-12 flex justify-end mt-2">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors shadow-sm active:transform active:scale-95"
          >
            <PlusCircle className="w-5 h-5" />
            Adicionar
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;