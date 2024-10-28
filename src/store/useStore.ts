import { create } from 'zustand';
import { Item, Vendor } from '../types';
import { createClient } from '@libsql/client';

// Initialize database with in-memory mode for local development
const db = createClient({
  url: 'file:local?mode=memory'
});

interface Store {
  vendors: Vendor[];
  items: Item[];
  searchTerm: string;
  priceRange: { min: number; max: number | null };
  selectedVendor: string | null;
  initialized: boolean;
  setSearchTerm: (term: string) => void;
  setPriceRange: (range: { min: number; max: number | null }) => void;
  setSelectedVendor: (vendorId: string | null) => void;
  addVendor: (name: string) => Promise<void>;
  removeVendor: (id: string) => Promise<void>;
  addItem: (name: string) => Promise<void>;
  updatePrice: (itemId: string, vendorId: string, price: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  loadInitialData: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  vendors: [],
  items: [],
  searchTerm: '',
  priceRange: { min: 0, max: null },
  selectedVendor: null,
  initialized: false,

  setSearchTerm: (term) => set({ searchTerm: term }),
  setPriceRange: (range) => set({ priceRange: range }),
  setSelectedVendor: (vendorId) => set({ selectedVendor: vendorId }),

  loadInitialData: async () => {
    try {
      // Create tables if they don't exist
      await db.batch([
        `CREATE TABLE IF NOT EXISTS vendors (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS items (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS prices (
          item_id TEXT,
          vendor_id TEXT,
          price REAL,
          PRIMARY KEY (item_id, vendor_id),
          FOREIGN KEY (item_id) REFERENCES items(id),
          FOREIGN KEY (vendor_id) REFERENCES vendors(id)
        )`
      ]);

      const [vendorsResult, itemsResult, pricesResult] = await Promise.all([
        db.execute('SELECT * FROM vendors'),
        db.execute('SELECT * FROM items'),
        db.execute('SELECT * FROM prices')
      ]);

      const vendors = vendorsResult.rows.map(row => ({
        id: row.id as string,
        name: row.name as string,
      }));

      const prices = pricesResult.rows.reduce((acc, row) => {
        const itemId = row.item_id as string;
        const vendorId = row.vendor_id as string;
        const price = row.price as number;
        
        if (!acc[itemId]) acc[itemId] = {};
        acc[itemId][vendorId] = price;
        return acc;
      }, {} as Record<string, Record<string, number>>);

      const items = itemsResult.rows.map(row => ({
        id: row.id as string,
        name: row.name as string,
        prices: prices[row.id as string] || {},
      }));

      set({ vendors, items, initialized: true });
    } catch (error) {
      console.error('Failed to load initial data:', error);
      // Set initialized to true even on error to prevent infinite loading
      set({ initialized: true });
    }
  },

  addVendor: async (name) => {
    const id = Date.now().toString();
    await db.execute({
      sql: 'INSERT INTO vendors (id, name) VALUES (?, ?)',
      args: [id, name],
    });
    set(state => ({ vendors: [...state.vendors, { id, name }] }));
  },

  removeVendor: async (id) => {
    await db.execute({
      sql: 'DELETE FROM vendors WHERE id = ?',
      args: [id],
    });
    await db.execute({
      sql: 'DELETE FROM prices WHERE vendor_id = ?',
      args: [id],
    });
    set(state => ({
      vendors: state.vendors.filter(v => v.id !== id),
      items: state.items.map(item => {
        const { [id]: _, ...prices } = item.prices;
        return { ...item, prices };
      }),
    }));
  },

  addItem: async (name) => {
    const id = Date.now().toString();
    await db.execute({
      sql: 'INSERT INTO items (id, name) VALUES (?, ?)',
      args: [id, name],
    });
    set(state => ({ items: [...state.items, { id, name, prices: {} }] }));
  },

  updatePrice: async (itemId, vendorId, price) => {
    await db.execute({
      sql: 'INSERT OR REPLACE INTO prices (item_id, vendor_id, price) VALUES (?, ?, ?)',
      args: [itemId, vendorId, price],
    });
    set(state => ({
      items: state.items.map(item => {
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

  removeItem: async (id) => {
    await db.execute({
      sql: 'DELETE FROM items WHERE id = ?',
      args: [id],
    });
    await db.execute({
      sql: 'DELETE FROM prices WHERE item_id = ?',
      args: [id],
    });
    set(state => ({
      items: state.items.filter(item => item.id !== id),
    }));
  },
}));