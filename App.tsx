import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import CategoryFilter from './components/CategoryFilter';
import ProductList from './components/ProductList';
import Chatbot from './components/Chatbot';
import ComparisonBar from './components/ComparisonBar';
import ComparisonModal from './components/ComparisonModal';
import { ProductCategory } from './types';
import { PRODUCTS_DATA } from './constants';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const [chatPrompt, setChatPrompt] = useState<string>('');
  const [comparisonList, setComparisonList] = useState<string[]>([]);
  const [isComparisonVisible, setIsComparisonVisible] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) {
      return PRODUCTS_DATA;
    }
    return PRODUCTS_DATA.filter(product => product.category === selectedCategory);
  }, [selectedCategory]);

  const productsToCompare = useMemo(() => {
    return PRODUCTS_DATA.filter(p => comparisonList.includes(p.id));
  }, [comparisonList]);

  const handleToggleCompare = (productId: string) => {
    setComparisonList(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleClearCompare = () => {
    setComparisonList([]);
  };

  const handleAskBot = (prompt: string) => {
    setChatPrompt(prompt);
    // Scroll to the chatbot if on a smaller screen for better UX
    if (window.innerWidth < 1024) {
      const chatbotElement = document.getElementById('chatbot-section');
      chatbotElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:grid lg:grid-cols-12 lg:gap-8">
        <main className="lg:col-span-7 xl:col-span-8">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
          />
          <ProductList 
            products={filteredProducts} 
            onAskBot={handleAskBot}
            comparisonList={comparisonList}
            onToggleCompare={handleToggleCompare}
          />
        </main>
        <aside id="chatbot-section" className="lg:col-span-5 xl:col-span-4 mt-10 lg:mt-0">
          <div className="lg:sticky lg:top-28">
            <Chatbot promptFromProduct={chatPrompt} onPromptHandled={() => setChatPrompt('')} />
          </div>
        </aside>
      </div>
      
      {comparisonList.length > 0 && (
        <ComparisonBar 
          selectedProducts={productsToCompare}
          onCompare={() => setIsComparisonVisible(true)}
          onClear={handleClearCompare}
        />
      )}
      
      {isComparisonVisible && (
        <ComparisonModal
          products={productsToCompare}
          onClose={() => setIsComparisonVisible(false)}
        />
      )}
    </div>
  );
};

export default App;