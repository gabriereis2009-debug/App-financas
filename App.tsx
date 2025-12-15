import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import AIImageEditor from './components/AIImageEditor';
import { Transaction } from './types';
import { LayoutDashboard, Receipt, Wand2 } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'ai'>('dashboard');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('finance_transactions');
    if (saved) {
      try {
        setTransactions(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load transactions", e);
      }
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('finance_transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTx: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...newTx,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-10">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">Finanças<span className="text-blue-600">Smart</span></h1>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'dashboard' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'transactions' 
                    ? 'border-blue-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Receipt className="w-4 h-4" />
                Transações
              </button>
              <button
                onClick={() => setActiveTab('ai')}
                className={`flex items-center gap-2 px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  activeTab === 'ai' 
                    ? 'border-purple-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:text-purple-700 hover:border-purple-300'
                }`}
              >
                <Wand2 className="w-4 h-4 text-purple-600" />
                Estúdio IA
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <Dashboard transactions={transactions} />
            
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Adicionar Rápido</h2>
                    </div>
                    <TransactionForm onAddTransaction={handleAddTransaction} />
                </section>
                
                <section>
                    <div className="flex items-center justify-between mb-4">
                         <h2 className="text-lg font-bold text-gray-800">Últimas Transações</h2>
                         <button 
                            onClick={() => setActiveTab('transactions')}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                         >
                            Ver todas
                         </button>
                    </div>
                    <TransactionList 
                        transactions={transactions.slice(-5)} // Show only last 5 in dashboard
                        onDelete={handleDeleteTransaction} 
                    />
                </section>
            </div>
          </div>
        )}

        {activeTab === 'transactions' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <div className="border-t border-gray-200 pt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Histórico Completo</h2>
                <TransactionList transactions={transactions} onDelete={handleDeleteTransaction} />
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="animate-in fade-in duration-500">
             <AIImageEditor />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 px-6 py-3 safe-area-pb">
        <div className="flex justify-around items-center">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-400'}`}
            >
                <LayoutDashboard className="w-6 h-6" />
                <span className="text-xs font-medium">Início</span>
            </button>
            <button 
                onClick={() => setActiveTab('transactions')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'transactions' ? 'text-blue-600' : 'text-gray-400'}`}
            >
                <Receipt className="w-6 h-6" />
                <span className="text-xs font-medium">Transações</span>
            </button>
            <button 
                onClick={() => setActiveTab('ai')}
                className={`flex flex-col items-center gap-1 ${activeTab === 'ai' ? 'text-purple-600' : 'text-gray-400'}`}
            >
                <Wand2 className="w-6 h-6" />
                <span className="text-xs font-medium">IA</span>
            </button>
        </div>
      </nav>
    </div>
  );
};

export default App;