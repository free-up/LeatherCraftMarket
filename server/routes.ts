import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import { uploadRouter } from "./uploadthing";
import { createRouteHandler } from "uploadthing/express";

export function registerRoutes(app: Express): Server {
  app.use("/api/uploadthing", createRouteHandler({ router: uploadRouter }));

  app.get("/api/products", async (_req, res) => {
    const products = await storage.getProducts();
    res.json(products);
  });

  app.get("/api/products/archived", async (_req, res) => {
    const products = await storage.getArchivedProducts();
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    try {
      const product = await storage.getProduct(id);
      res.json(product);
    } catch (err) {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/products", async (req, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    try {
      const product = await storage.updateProduct(id, result.data);
      res.json(product);
    } catch (err) {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.post("/api/products/:id/archive", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    try {
      const product = await storage.archiveProduct(id);
      res.json(product);
    } catch (err) {
      res.status(404).json({ error: "Product not found" });
    }
  });

  app.delete("/api/products/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    try {
      await storage.deleteProduct(id);
      res.status(204).end();
    } catch (err) {
      res.status(404).json({ error: "Product not found" });
    }
  });

  return createServer(app);
}