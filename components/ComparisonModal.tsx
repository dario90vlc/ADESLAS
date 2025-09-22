import React from 'react';
import { Product } from '../types';
import { CheckCircleIcon, XCircleIcon, XMarkIcon } from './Icons';

interface ComparisonModalProps {
  products: Product[];
  onClose: () => void;
}

const ComparisonCell: React.FC<{ items: string[] | string | undefined, type?: 'advantages' | 'limitations' }> = ({ items, type }) => {
  if (!items || (Array.isArray(items) && items.length === 0)) {
    return <div className="p-4 border-b border-l border-gray-200 text-gray-400 text-sm italic">N/A</div>;
  }
  
  if (Array.isArray(items)) {
    return (
      <div className="p-4 border-b border-l border-gray-200">
        <ul className="space-y-2">
          {items.map((item, index) => (
            <li key={index} className="flex items-start text-sm text-gray-600">
              {type === 'advantages' && <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-px" />}
              {type === 'limitations' && <XCircleIcon className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-px" />}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  return <div className="p-4 border-b border-l border-gray-200 text-sm text-gray-800">{items}</div>;
};

const ComparisonModal: React.FC<ComparisonModalProps> = ({ products, onClose }) => {
  const gridCols = `minmax(180px, 0.75fr) repeat(${products.length}, 1fr)`;

  const fields: { key: keyof Product; title: string; type?: 'advantages' | 'limitations' }[] = [
    { key: 'category', title: 'Categoría' },
    { key: 'strongPoint', title: 'Punto Fuerte' },
    { key: 'features', title: 'Características' },
    { key: 'advantages', title: 'Ventajas', type: 'advantages' },
    { key: 'limitations', title: 'Limitaciones', type: 'limitations' },
    { key: 'defenseArguments', title: 'Argumentos de Defensa' },
    { key: 'idealClient', title: 'Cliente Ideal' },
  ];
  
  return (
    <div 
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="comparison-title"
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-screen-xl h-[90vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-200 flex-shrink-0">
          <h2 id="comparison-title" className="text-xl sm:text-2xl font-bold text-gray-800">Comparativa de Productos</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </header>
        <main className="overflow-auto flex-1">
          <div className="grid" style={{ gridTemplateColumns: gridCols }}>
            {/* Header Row */}
            <div className="font-bold text-gray-800 p-4 sticky top-0 bg-white z-10 border-b-2 border-blue-500"></div>
            {products.map(product => (
              <div key={product.id} className="font-bold text-gray-800 p-4 sticky top-0 bg-white z-10 border-b-2 border-blue-500 border-l border-gray-200">
                {product.name}
              </div>
            ))}
            
            {/* Data Rows */}
            {fields.map(field => (
              <React.Fragment key={field.key}>
                  <div className="p-4 font-semibold text-gray-700 bg-gray-50/70 border-b border-gray-200 sticky left-0">{field.title}</div>
                  {products.map(product => (
                      <ComparisonCell key={product.id} items={product[field.key] as string[] | string} type={field.type} />
                  ))}
              </React.Fragment>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ComparisonModal;
