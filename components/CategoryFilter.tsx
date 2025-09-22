import React from 'react';
import { ProductCategory } from '../types';
import { SparklesIcon, StethoscopeIcon, HomeModernIcon, ToothIcon, BuildingOfficeIcon, Squares2x2Icon } from './Icons';

interface CategoryFilterProps {
  selectedCategory: ProductCategory | null;
  setSelectedCategory: (category: ProductCategory | null) => void;
}

const categories = [
    ProductCategory.Dental,
    ProductCategory.Ambulatory,
    ProductCategory.Hospital,
    ProductCategory.MyBox,
    ProductCategory.Business
];

const categoryDetails = {
    [ProductCategory.Dental]: { icon: ToothIcon, color: 'text-sky-500', bg: 'bg-sky-50' },
    [ProductCategory.Ambulatory]: { icon: StethoscopeIcon, color: 'text-teal-500', bg: 'bg-teal-50' },
    [ProductCategory.Hospital]: { icon: HomeModernIcon, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    [ProductCategory.MyBox]: { icon: SparklesIcon, color: 'text-amber-500', bg: 'bg-amber-50' },
    [ProductCategory.Business]: { icon: BuildingOfficeIcon, color: 'text-rose-500', bg: 'bg-rose-50' },
};

const categoryLabels = {
    [ProductCategory.Dental]: "Dental",
    [ProductCategory.Ambulatory]: "Ambulatorio",
    [ProductCategory.Hospital]: "Hospitalario",
    [ProductCategory.MyBox]: "MyBox",
    [ProductCategory.Business]: "Empresa"
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategory, setSelectedCategory }) => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Índice de Contenidos</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <button
            onClick={() => setSelectedCategory(null)}
            className={`flex flex-col items-center justify-center text-center p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 ${
            selectedCategory === null 
                ? 'bg-blue-600 text-white shadow-lg border-blue-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-blue-600 shadow-sm border-gray-200'
            }`}
        >
            <Squares2x2Icon className={`h-7 w-7 mb-2 ${selectedCategory === null ? 'text-white' : 'text-gray-400 group-hover:text-blue-600'}`} />
            <span className={`font-semibold text-sm ${selectedCategory === null ? 'text-white' : 'text-gray-800 group-hover:text-blue-600'}`}>Todos</span>
        </button>
        {categories.map((category) => {
          const details = categoryDetails[category];
          const Icon = details.icon;
          const isSelected = selectedCategory === category;

          return (
            <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex flex-col items-center justify-center text-center p-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 group border-2 ${
                isSelected
                    ? `${details.bg.replace('bg-', 'border-')} shadow-lg ${details.bg}`
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border-gray-200'
                }`}
            >
                <Icon className={`h-7 w-7 mb-2 ${isSelected ? details.color : 'text-gray-400 group-hover:' + details.color}`} />
                <span className={`font-semibold text-sm ${isSelected ? details.color : 'text-gray-800 group-hover:' + details.color}`}>
                    {categoryLabels[category]}
                </span>
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default CategoryFilter;