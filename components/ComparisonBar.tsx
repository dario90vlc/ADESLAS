import React from 'react';
import { Product } from '../types';
import { ScaleIcon } from './Icons';

interface ComparisonBarProps {
  selectedProducts: Product[];
  onCompare: () => void;
  onClear: () => void;
}

const ComparisonBar: React.FC<ComparisonBarProps> = ({ selectedProducts, onCompare, onClear }) => {
  const productCount = selectedProducts.length;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-50 transition-transform duration-300 transform translate-y-0 animate-slide-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-gray-800 text-lg">
              {productCount} {productCount === 1 ? 'Producto Seleccionado' : 'Productos Seleccionados'}
            </h4>
            <p className="text-sm text-gray-500 truncate mt-1">
              {selectedProducts.map(p => p.name).join('  •  ')}
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 ml-4 flex-shrink-0">
            <button
              onClick={onClear}
              className="px-4 py-2.5 text-sm font-medium rounded-lg text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
            >
              Limpiar
            </button>
            <button
              onClick={onCompare}
              disabled={productCount < 2}
              className="flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <ScaleIcon className="h-5 w-5 mr-2" />
              Comparar {productCount > 1 ? `(${productCount})` : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
