import React from 'react';

const AdeslasLogo: React.FC = () => (
    <div className="bg-white/90 backdrop-blur-sm py-1.5 px-4 rounded-lg shadow-sm border border-gray-200/80">
        <span className="text-xl font-bold text-blue-800">
            <span className="text-blue-600">*</span> Adeslas
        </span>
        <div className="text-xs font-semibold text-blue-900 -mt-1.5">SegurCaixa</div>
    </div>
);


const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Guía de Seguros de Salud</h1>
          <p className="text-lg text-gray-500 font-light">Formación en Retención</p>
        </div>
        <AdeslasLogo />
      </div>
    </header>
  );
};

export default Header;