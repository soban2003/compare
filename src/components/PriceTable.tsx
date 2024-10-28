import React from 'react';
import { DollarSign, Plus, Trash } from 'lucide-react';
import { Item, Vendor } from '../types';

interface PriceTableProps {
  items: Item[];
  vendors: Vendor[];
  onAddItem: (name: string) => void;
  onUpdatePrice: (itemId: string, vendorId: string, price: number) => void;
  onRemoveItem: (id: string) => void;
}

export function PriceTable({
  items,
  vendors,
  onAddItem,
  onUpdatePrice,
  onRemoveItem,
}: PriceTableProps) {
  const handleAddItem = () => {
    const name = prompt('Enter item name:');
    if (name) onAddItem(name);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50">
            <th className="text-left p-3">Item</th>
            {vendors.map((vendor) => (
              <th key={vendor.id} className="text-left p-3">
                {vendor.name}
              </th>
            ))}
            <th className="text-left p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">{item.name}</td>
              {vendors.map((vendor) => (
                <td key={vendor.id} className="p-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      value={item.prices[vendor.id] || ''}
                      onChange={(e) =>
                        onUpdatePrice(item.id, vendor.id, Number(e.target.value))
                      }
                      className="w-24 px-2 py-1 border rounded"
                      placeholder="Price"
                    />
                  </div>
                </td>
              ))}
              <td className="p-3">
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button
        onClick={handleAddItem}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        <Plus className="w-4 h-4" />
        Add Item
      </button>
    </div>
  );
}