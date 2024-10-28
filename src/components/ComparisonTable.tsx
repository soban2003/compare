import React from 'react';
import { Item, Vendor } from '../types';
import { DollarSign, Trash2 } from 'lucide-react';

interface ComparisonTableProps {
  items: Item[];
  vendors: Vendor[];
  onAddItem: () => void;
  onUpdatePrice: (itemId: string, vendorId: string, price: number) => void;
  onRemoveItem: (id: string) => void;
}

export function ComparisonTable({ items, vendors, onAddItem, onUpdatePrice, onRemoveItem }: ComparisonTableProps) {
  const getBestPrice = (item: Item) => {
    const prices = Object.values(item.prices).filter(price => price > 0);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Item Name
            </th>
            {vendors.map(vendor => (
              <th
                key={vendor.id}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {vendor.name}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Best Price
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {items.map(item => {
            const bestPrice = getBestPrice(item);
            return (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.name}
                </td>
                {vendors.map(vendor => (
                  <td key={vendor.id} className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                      <input
                        type="number"
                        value={item.prices[vendor.id] || ''}
                        onChange={(e) => onUpdatePrice(item.id, vendor.id, Number(e.target.value))}
                        className="w-24 px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter price"
                      />
                    </div>
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap">
                  {bestPrice && (
                    <div className="flex items-center text-green-600 font-semibold">
                      <DollarSign className="w-4 h-4 mr-1" />
                      {bestPrice.toFixed(2)}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      <div className="mt-4">
        <button
          onClick={onAddItem}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Add New Item
        </button>
      </div>
    </div>
  );
}