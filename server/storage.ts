import { products, type Product, type InsertProduct } from "@shared/schema";

// Хранение настроек сайта
interface SiteSettings {
  siteName: string;
  mainTitle: string;
  mainDescription: string;
  cardSize: {
    width: number;
    height: number;
  };
  sections: {
    home: string;
    archive: string;
    admin: string;
  };
}

// Сохраняем настройки сайта в памяти (в реальном проекте нужно хранить в базе данных)
let siteSettings: SiteSettings = {
  siteName: 'KoBro',
  mainTitle: 'Кожаные изделия ручной работы KoBro',
  mainDescription: 'Качественные изделия из натуральной кожи',
  cardSize: {
    width: 300,
    height: 400,
  },
  sections: {
    home: 'Главная',
    archive: 'Архив изделий',
    admin: 'Админ панель',
  }
};

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getArchivedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  archiveProduct(id: number): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
  getSettings(): Promise<SiteSettings>;
  updateSettings(settings: SiteSettings): Promise<SiteSettings>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private currentId: number;
  private settings: SiteSettings;

  constructor() {
    this.products = new Map();
    this.currentId = 1;
    this.settings = { siteName: '', mainTitle: '', mainDescription: '', cardSize: {width: 0, height: 0}, sections: {home: '', archive: '', admin: ''} };
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => !p.archived);
  }

  async getArchivedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.archived);
  }

  async getProduct(id: number): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentId++;
    const product: Product = {
      ...insertProduct,
      id,
      archived: false,
      createdAt: new Date(),
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: number, insertProduct: InsertProduct): Promise<Product> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) throw new Error("Product not found");

    const updatedProduct: Product = {
      ...existingProduct,
      ...insertProduct,
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async archiveProduct(id: number): Promise<Product> {
    const product = this.products.get(id);
    if (!product) throw new Error("Product not found");

    const updated = { ...product, archived: true };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: number): Promise<void> {
    if (!this.products.has(id)) throw new Error("Product not found");
    this.products.delete(id);
  }

  async getSettings(): Promise<SiteSettings> {
    return siteSettings;
  }

  async updateSettings(settings: SiteSettings): Promise<SiteSettings> {
    siteSettings = { ...siteSettings, ...settings };
    return siteSettings;
  }
}

export const storage = new MemStorage();