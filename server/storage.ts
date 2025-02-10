import { products, type Product, type InsertProduct } from "@shared/schema";

export interface IStorage {
  getProducts(): Promise<Product[]>;
  getArchivedProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: InsertProduct): Promise<Product>;
  archiveProduct(id: number): Promise<Product>;
  deleteProduct(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private currentId: number;

  constructor() {
    this.products = new Map();
    this.currentId = 1;
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
}

export const storage = new MemStorage();