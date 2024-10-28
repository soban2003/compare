import React from 'react';
import { Vendor } from '../types';
import { Store } from 'lucide-react';

interface VendorManagerProps {
  vendors: Vendor[];
  onAddVendor: (name: string) => void;
  onRemoveVendor: (id: string) => void;
}

export function VendorManager({ vendors, onAddVendor, onRemoveVendor }: VendorManagerProps) {
  const [newVendorName, setNewVendorName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newVendorName.trim()) {
      onAddVendor(newVendorName.trim());
      setNewVendorName('');
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-4 mb-4">
        {vendors.map(vendor => (
          <div
            key={vendor.id}
            className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm"
          >
            <Store className="w-4 h-4 mr-2 text-blue-600" />
            <span className="font-medium">{vendor.name}</span>
            <button
              onClick={() => onRemoveVendor(vendor.id)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newVendorName}
          onChange={(e) => setNewVendorName(e.target.value)}
          placeholder="Enter vendor name"
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Vendor
        </button>
      </form>
    </div>
  );
}