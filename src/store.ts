import { create } from 'zustand';
import { Item, Vendor } from './types';

interface Store {
  vendors: Vendor[];
  items: Item[];
  addVendor: (name: string) => void;
  removeVendor: (id: string) => void;
  addItem: (name: string) => void;
  updatePrice: (itemId: string, vendorId: string, price: number) => void;
  removeItem: (id: string) => void;
}

export const useStore = create<Store>((set) => ({
  vendors: [],
  items: [],

  addVendor: (name) => {
    const id = Date.now().toString();
    set((state) => ({
      vendors: [...state.vendors, { id, name }],
    }));
  },

  removeVendor: (id) => {
    set((state) => ({
      vendors: state.vendors.filter((v) => v.id !== id),
      items: state.items.map((item) => {
        const { [id]: _, ...prices } = item.prices;
        return { ...item, prices };
      }),
    }));
  },

  addItem: (name) => {
    const id = Date.now().toString();
    set((state) => ({
      items: [...state.items, { id, name, prices: {} }],
    }));
  },

  updatePrice: (itemId, vendorId, price) => {
    set((state) => ({
      items: state.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            prices: { ...item.prices, [vendorId]: price },
          };
        }
        return item;
      }),
    }));
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
}));