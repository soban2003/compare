import React from 'react';
import { Search, DollarSign, Store } from 'lucide-react';
import { Vendor } from '../types';

interface SearchFiltersProps {
  vendors: Vendor[];
  searchTerm: string;
  priceRange: { min: number; max: number | null };
  selectedVendor: string | null;
  onSearchChange: (term: string) => void;
  onPriceRangeChange: (range: { min: number; max: number | null }) => void;
  onVendorChange: (vendorId: string | null) => void;
}

export function SearchFilters({
  vendors,
  searchTerm,
  priceRange,
  selectedVendor,
  onSearchChange,
  onPriceRangeChange,
  onVendorChange,
}: SearchFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search items..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="flex gap-2 items-center">
        <DollarSign className="text-gray-400 w-5 h-5 flex-shrink-0" />
        <input
          type="number"
          value={priceRange.min}
          onChange={(e) => onPriceRangeChange({ ...priceRange, min: Number(e.target.value) })}
          placeholder="Min price"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <span className="text-gray-400">-</span>
        <input
          type="number"
          value={priceRange.max || ''}
          onChange={(e) => onPriceRangeChange({ 
            ...priceRange, 
            max: e.target.value ? Number(e.target.value) : null 
          })}
          placeholder="Max price"
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div className="relative">
        <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <select
          value={selectedVendor || ''}
          onChange={(e) => onVendorChange(e.target.value || null)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none"
        >
          <option value="">All Vendors</option>
          {vendors.map(vendor => (
            <option key={vendor.id} value={vendor.id}>
              {vendor.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}