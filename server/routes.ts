import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertProductSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import express from 'express';
import { authenticateToken, verifyPassword, generateToken, type AuthRequest } from './auth';

// Настройка multer для загрузки изображений
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadDir = 'uploads';
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Недопустимый формат файла. Разрешены только JPEG, PNG и WebP.'));
    }
  },
  limits: {
    fileSize: 8 * 1024 * 1024 // 8MB
  }
});

export function registerRoutes(app: Express): Server {
  // Статический маршрут для загруженных файлов
  app.use('/uploads', express.static('uploads'));

  // Маршрут для аутентификации
  app.post("/api/auth/login", (req, res) => {
    const { password } = req.body;
    
    if (!password || !verifyPassword(password)) {
      return res.status(401).json({ error: "Неверный пароль" });
    }
    
    const token = generateToken();
    res.json({ token });
  });
  
  // Проверка статуса аутентификации
  app.get("/api/auth/status", authenticateToken, (req: AuthRequest, res) => {
    res.json({ isAuthenticated: true });
  });

  // Маршрут для загрузки изображений
  app.post("/api/upload", authenticateToken, (req: AuthRequest, res) => {
    upload.single('image')(req, res, (err) => {
      if (err) {
        console.error('Ошибка загрузки файла:', err);
        return res.status(400).json({ error: err.message });
      }
      
      if (!req.file) {
        return res.status(400).json({ error: "Файл не был загружен" });
      }
      
      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ url: imageUrl });
    });
  });

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

  app.post("/api/products", authenticateToken, async (req: AuthRequest, res) => {
    const result = insertProductSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    const product = await storage.createProduct(result.data);
    res.status(201).json(product);
  });

  app.patch("/api/products/:id", authenticateToken, async (req: AuthRequest, res) => {
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

  app.post("/api/products/:id/archive", authenticateToken, async (req: AuthRequest, res) => {
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

  app.delete("/api/products/:id", authenticateToken, async (req: AuthRequest, res) => {
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
  
  // API для работы с настройками сайта
  app.get("/api/settings", async (_req, res) => {
    try {
      const settings = await storage.getSettings();
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Не удалось получить настройки" });
    }
  });
  
  app.post("/api/settings", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const settings = await storage.updateSettings(req.body);
      res.json(settings);
    } catch (err) {
      res.status(500).json({ error: "Не удалось обновить настройки" });
    }
  });

  return createServer(app);
}