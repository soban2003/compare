import React, { useEffect } from 'react';
import { LineChart } from 'lucide-react';
import { useStore } from './store';
import { VendorManager } from './components/VendorManager';
import { ComparisonTable } from './components/ComparisonTable';
import { SearchFilters } from './components/SearchFilters';

function App() {
  const store = useStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [priceRange, setPriceRange] = React.useState({ min: 0, max: null as number | null });
  const [selectedVendor, setSelectedVendor] = React.useState<string | null>(null);

  const handleAddItem = () => {
    const name = prompt('Enter item name:');
    if (name) store.addItem(name);
  };

  // Filter items based on search criteria
  const filteredItems = store.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = !selectedVendor || (item.prices[selectedVendor] !== undefined);
    const matchesPriceRange = Object.values(item.prices).some(price => {
      const aboveMin = price >= priceRange.min;
      const belowMax = priceRange.max === null || price <= priceRange.max;
      return aboveMin && belowMax;
    });

    return matchesSearch && matchesVendor && (Object.keys(item.prices).length === 0 || matchesPriceRange);
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <LineChart className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Vendor Price Comparison</h1>
        </div>

        <div className="grid gap-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Manage Vendors</h2>
            <VendorManager
              vendors={store.vendors}
              onAddVendor={store.addVendor}
              onRemoveVendor={store.removeVendor}
            />
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Price Comparison</h2>
            <SearchFilters
              vendors={store.vendors}
              searchTerm={searchTerm}
              priceRange={priceRange}
              selectedVendor={selectedVendor}
              onSearchChange={setSearchTerm}
              onPriceRangeChange={setPriceRange}
              onVendorChange={setSelectedVendor}
            />
            <ComparisonTable
              items={filteredItems}
              vendors={store.vendors}
              onAddItem={handleAddItem}
              onUpdatePrice={store.updatePrice}
              onRemoveItem={store.removeItem}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;