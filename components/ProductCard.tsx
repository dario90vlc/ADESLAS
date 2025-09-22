import React from 'react';
import { Product, ProductCategory } from '../types';
import { CheckCircleIcon, XCircleIcon, StarIcon, ChatBubbleBottomCenterTextIcon, InformationCircleIcon, UserGroupIcon, ChatbotIcon } from './Icons';

interface ProductCardProps {
  product: Product;
  onAskBot: (prompt: string) => void;
  isSelectedForCompare: boolean;
  onToggleCompare: (productId: string) => void;
}

const categoryColors: { [key in ProductCategory]: { tag: string; strongPoint: string } } = {
    [ProductCategory.Dental]: { tag: 'bg-sky-100 text-sky-800', strongPoint: 'bg-sky-500/10 text-sky-700' },
    [ProductCategory.Ambulatory]: { tag: 'bg-teal-100 text-teal-800', strongPoint: 'bg-teal-500/10 text-teal-700' },
    [ProductCategory.Hospital]: { tag: 'bg-indigo-100 text-indigo-800', strongPoint: 'bg-indigo-500/10 text-indigo-700' },
    [ProductCategory.MyBox]: { tag: 'bg-amber-100 text-amber-800', strongPoint: 'bg-amber-500/10 text-amber-700' },
    [ProductCategory.Business]: { tag: 'bg-rose-100 text-rose-800', strongPoint: 'bg-rose-500/10 text-rose-700' },
};

const SectionItem: React.FC<{ children: React.ReactNode; icon: React.ReactNode }> = ({ children, icon }) => (
  <li className="flex items-start">
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <span className="ml-3 text-gray-600">{children}</span>
  </li>
);

// Centralized map for section icons and colors to ensure consistency
const sectionDetailsMap: { [key: string]: { icon: React.FC<{ className?: string }>; colorClass: string; } } = {
  'Características Principales': { icon: InformationCircleIcon, colorClass: 'text-blue-600' },
  'Ventajas': { icon: CheckCircleIcon, colorClass: 'text-green-600' },
  'Limitaciones': { icon: XCircleIcon, colorClass: 'text-red-600' },
  'Argumentos de Defensa': { icon: ChatBubbleBottomCenterTextIcon, colorClass: 'text-indigo-600' },
  'Perfil de Cliente Ideal': { icon: UserGroupIcon, colorClass: 'text-amber-600' },
};

const InfoSection: React.FC<{ title: string; items: string[] }> = ({ title, items }) => {
  if (!items || items.length === 0) return null;
  
  const details = sectionDetailsMap[title];
  if (!details) return null;

  const { icon: Icon, colorClass } = details;

  const itemIcons: { [key: string]: React.ReactNode } = {
    'Ventajas': <CheckCircleIcon className="h-5 w-5 text-green-500" />,
    'Limitaciones': <XCircleIcon className="h-5 w-5 text-red-500" />,
  };
  
  const defaultItemIcon = <div className={`w-1.5 h-1.5 rounded-full ${colorClass.replace('text-', 'bg-')} mt-2`}></div>;

  return (
    <div className="mt-6">
      <h4 className={`flex items-center text-md font-semibold ${colorClass} mb-3`}>
        <Icon className="h-6 w-6" />
        <span className="ml-2">{title}</span>
      </h4>
      <ul className="space-y-2 text-sm">
        {items.map((item, index) => (
          <SectionItem key={index} icon={itemIcons[title] || defaultItemIcon}>
            {item}
          </SectionItem>
        ))}
      </ul>
    </div>
  );
};


const ProductCard: React.FC<ProductCardProps> = ({ product, onAskBot, isSelectedForCompare, onToggleCompare }) => {
  const colors = categoryColors[product.category];

  return (
    <div className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden border transform hover:-translate-y-1 ${isSelectedForCompare ? 'border-blue-500 shadow-blue-100' : 'border-gray-200/80'}`}>
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start">
            <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${colors.tag}`}>
                {product.category}
            </span>
            <label htmlFor={`compare-${product.id}`} className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer hover:text-blue-600">
                <input
                    id={`compare-${product.id}`}
                    type="checkbox"
                    checked={isSelectedForCompare}
                    onChange={() => onToggleCompare(product.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Comparar</span>
            </label>
        </div>
        <h3 className="text-xl font-bold tracking-tight text-gray-900 mt-3">{product.name}</h3>
      </div>

      <div className="px-6">
        {product.strongPoint && (
          <div className={`${colors.strongPoint} p-4 rounded-lg text-sm flex items-start`}>
              <StarIcon className="h-5 w-5 mr-3 mt-0.5 text-current flex-shrink-0" />
            <div>
              <p className="font-semibold">Punto Fuerte:</p>
              <p>{product.strongPoint}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 pt-0 mt-4 flex-grow">
        <InfoSection title="Características Principales" items={product.features} />
        <InfoSection title="Ventajas" items={product.advantages} />
        <InfoSection title="Limitaciones" items={product.limitations} />
        <InfoSection title="Argumentos de Defensa" items={product.defenseArguments} />
        <InfoSection title="Perfil de Cliente Ideal" items={product.idealClient} />
      </div>
      
      <div className="p-6 pt-2 mt-auto">
          <button 
            onClick={() => onAskBot(`Háblame más sobre el producto "${product.name}", sus ventajas y para qué tipo de cliente es ideal.`)}
            className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <ChatbotIcon className="h-5 w-5 mr-2" />
            Preguntar al Asistente
          </button>
      </div>
    </div>
  );
};

export default ProductCard;