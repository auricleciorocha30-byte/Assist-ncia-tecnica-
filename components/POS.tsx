
import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search, Tag, Package, CreditCard, Banknote, Receipt, PlusCircle, DollarSign, Type } from 'lucide-react';
import { Product } from '../types';

const MOCK_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Câmera IP Full HD 1080p', price: 289.90, category: 'CFTV', stock: 15 },
  { id: 'p2', name: 'DVR Intelbras 4 Canais Multi HD', price: 450.00, category: 'CFTV', stock: 8 },
  { id: 'p3', name: 'Cabo Coaxial 4mm + Bipolar (100m)', price: 125.00, category: 'Infra', stock: 20 },
  { id: 'p4', name: 'Conector BNC Mola com Parafuso', price: 3.50, category: 'Acessórios', stock: 200 },
  { id: 'p5', name: 'Fonte 12V 5A Chaveada Colmeia', price: 45.90, category: 'Energia', stock: 35 },
  { id: 'p6', name: 'SSD Kingston 480GB A400', price: 189.00, category: 'Informática', stock: 12 },
  { id: 'p7', name: 'HD Seagate SkyHawk 2TB (CFTV)', price: 399.00, category: 'CFTV', stock: 6 },
  { id: 'p8', name: 'Mouse USB Óptico Simples', price: 25.00, category: 'Informática', stock: 45 },
];

interface CartItem extends Product {
  quantity: number;
}

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todos');
  
  // Manual item states
  const [manualName, setManualName] = useState('');
  const [manualPrice, setManualPrice] = useState('');

  const addToCart = (product: Product | Omit<Product, 'stock'>) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1, stock: (product as Product).stock || 0 }];
    });
  };

  const addManualItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPrice) return;

    const newItem: Omit<Product, 'stock'> = {
      id: `manual-${Date.now()}`,
      name: manualName,
      price: parseFloat(manualPrice),
      category: 'Personalizado'
    };

    addToCart(newItem);
    setManualName('');
    setManualPrice('');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const filteredProducts = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'Todos' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Todos', ...Array.from(new Set(MOCK_PRODUCTS.map(p => p.category)))];

  return (
    <div className="h-full flex flex-col md:flex-row bg-slate-50 p-6 gap-6">
      {/* Product Selection Area */}
      <div className="flex-1 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Produtos & Serviços</h2>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Buscar no catálogo..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Manual Item Form */}
          <form onSubmit={addManualItem} className="flex flex-wrap items-end gap-3 p-4 bg-blue-50/50 rounded-2xl border border-blue-100">
            <div className="flex-1 min-w-[200px] space-y-1">
              <label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                <Type size={12} /> Item Manual / Serviço
              </label>
              <input 
                type="text" 
                placeholder="Descrição do item..." 
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={manualName}
                onChange={e => setManualName(e.target.value)}
              />
            </div>
            <div className="w-32 space-y-1">
              <label className="text-[10px] font-bold text-blue-600 uppercase flex items-center gap-1">
                <DollarSign size={12} /> Preço
              </label>
              <input 
                type="number" 
                step="0.01" 
                placeholder="0,00" 
                className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                value={manualPrice}
                onChange={e => setManualPrice(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={!manualName || !manualPrice}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 disabled:opacity-50 transition-all shadow-md shadow-blue-600/10"
            >
              <PlusCircle size={18} />
              Adicionar
            </button>
          </form>

          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                  category === cat ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="flex flex-col p-4 bg-slate-50 border border-slate-200 rounded-2xl hover:border-blue-500 hover:bg-white transition-all text-left group"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{product.category}</span>
                <span className="text-xs text-slate-400">Est: {product.stock}</span>
              </div>
              <p className="text-sm font-bold text-slate-800 mb-4 line-clamp-2 h-10">{product.name}</p>
              <div className="mt-auto flex items-center justify-between">
                <span className="text-base font-black text-slate-900">R$ {product.price.toFixed(2)}</span>
                <div className="p-1.5 bg-white border border-slate-200 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Plus size={16} />
                </div>
              </div>
            </button>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full py-10 text-center opacity-40">
              <p className="text-sm font-medium">Nenhum produto encontrado no catálogo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Cart Area */}
      <div className="w-full md:w-96 flex flex-col bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <ShoppingCart size={20} />
          </div>
          <h3 className="font-bold text-slate-800">Carrinho de Venda</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.map(item => (
            <div key={item.id} className={`flex items-center gap-3 p-3 rounded-xl border border-slate-100 ${item.id.toString().startsWith('manual') ? 'bg-blue-50/30' : 'bg-slate-50'}`}>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                <p className="text-[10px] text-slate-500">R$ {item.price.toFixed(2)} un.</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Minus size={14} /></button>
                <span className="text-xs font-black text-slate-800 w-4 text-center">{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-slate-200 rounded text-slate-500"><Plus size={14} /></button>
                <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-rose-500 text-slate-400 ml-1"><Trash2 size={14} /></button>
              </div>
            </div>
          ))}
          {cart.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40 py-10">
              <Package size={48} className="mb-2" />
              <p className="text-sm font-medium">Seu carrinho está vazio</p>
            </div>
          )}
        </div>

        <div className="p-6 bg-slate-900 text-white space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-slate-400 text-xs">
              <span>Subtotal</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-black">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold transition-all">
              <CreditCard size={14} />
              Cartão
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold transition-all">
              <Banknote size={14} />
              Dinheiro/PIX
            </button>
          </div>

          <button 
            disabled={cart.length === 0}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl text-sm font-black shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2"
          >
            <Receipt size={18} />
            FINALIZAR VENDA
          </button>
        </div>
      </div>
    </div>
  );
};

export default POS;
