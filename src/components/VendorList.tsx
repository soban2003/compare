import React from 'react';
import { Store, X } from 'lucide-react';
import { Vendor } from '../types';

interface VendorListProps {
  vendors: Vendor[];
  onAdd: (name: string) => void;
  onRemove: (id: string) => void;
}

export function VendorList({ vendors, onAdd, onRemove }: VendorListProps) {
  const [newName, setNewName] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAdd(newName.trim());
      setNewName('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm"
          >
            <Store className="w-4 h-4 text-blue-500" />
            <span>{vendor.name}</span>
            <button
              onClick={() => onRemove(vendor.id)}
              className="text-gray-400 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Add new vendor..."
          className="flex-1 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add Vendor
        </button>
      </form>
    </div>
  );
}