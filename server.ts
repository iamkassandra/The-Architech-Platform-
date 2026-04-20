
import express from "express";
import { createServer as createViteServer } from "vite";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { Storage } from "@google-cloud/storage";
import admin from "firebase-admin";
import axios from "axios";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();
const storage = new Storage();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use(cookieParser());

  // THE MERCHANT: Discreet Order Bridge
  app.post("/api/orders/create", async (req, res) => {
    try {
      const { productId, email, userId } = req.body;
      
      // 1. Create PENDING order
      const orderRef = await db.collection("orders").add({
        userId: userId || "anonymous",
        email,
        productId,
        status: "PENDING",
        amount: 49.00, // Fixed enterprise rate for demo
        currency: "USD",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 2. Mock Wise Bridge (Discreet)
      // In production, this would call Wise API to create a quote and payment link
      // For now, return a simulated payment entry point
      res.json({ 
        orderId: orderRef.id, 
        paymentUrl: `https://wise.com/pay/simulated-${orderRef.id}`,
        status: "PENDING"
      });
    } catch (error) {
      console.error("Merchant failure:", error);
      res.status(500).json({ error: "Orchestration failure" });
    }
  });

  // THE CONCIERGE: Fulfillment Webhook
  app.post("/api/webhooks/payment", async (req, res) => {
    try {
      const { orderId, secret } = req.body;
      
      // Security check (simulated)
      if (secret !== process.env.WISE_WEBHOOK_SECRET && process.env.NODE_ENV === "production") {
        return res.status(401).send("Unauthorized");
      }

      const orderRef = db.collection("orders").doc(orderId);
      const orderDoc = await orderRef.get();

      if (!orderDoc.exists) return res.status(404).send("Order not found");

      // 3. Flip status to PAID
      await orderRef.update({ 
        status: "PAID",
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // 4. Generate V4 Signed URL (valid for 60 mins)
      const bucketName = "architech-vault-storage";
      const fileName = `vault/${orderDoc.data()?.productId}.zip`;
      
      const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl({
        version: "v4",
        action: "read",
        expires: Date.now() + 60 * 60 * 1000, // 60 minutes
      });

      // 5. Finalize Fulfillment
      await orderRef.update({
        status: "FULFILLED",
        vaultUrl: url,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.status(200).send("Fulfillment complete");
    } catch (error) {
      console.error("Concierge failure:", error);
      res.status(500).send("Fulfillment failed");
    }
  });

  // THE SCRIBE: Journal Publication Node
  app.post("/api/blog/publish", async (req, res) => {
    try {
      const { title, excerpt, content, category, level } = req.body;
      
      const postRef = await db.collection("blog").add({
        title,
        excerpt,
        content,
        category,
        level,
        author: "architech",
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase(),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ id: postRef.id, status: "PUBLISHED" });
    } catch (error) {
      console.error("Scribe failure:", error);
      res.status(500).json({ error: "Scribe publishing failure" });
    }
  });

  // THE LIBRARIAN: Vault Asset Management
  app.post("/api/vault/assets", async (req, res) => {
    try {
      const { name, description, price, category } = req.body;
      
      const assetRef = await db.collection("assets").add({
        name,
        description,
        price: parseFloat(price),
        category,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      res.json({ id: assetRef.id, status: "Vault Asset Created" });
    } catch (error) {
      console.error("Librarian failure:", error);
      res.status(500).json({ error: "Librarian orchestration failure" });
    }
  });

  // THE STEWARD: Identity Node Status
  app.get("/api/orders/:id", async (req, res) => {
    try {
      const orderDoc = await db.collection("orders").doc(req.params.id).get();
      if (!orderDoc.exists) return res.status(404).json({ error: "Node not found" });
      res.json(orderDoc.data());
    } catch (error) {
      res.status(500).json({ error: "Steward connection failure" });
    }
  });

  // THE INTELLIGENCE: Feed Fetcher
  app.get("/api/blog", async (req, res) => {
    try {
      const postsSnapshot = await db.collection("blog").orderBy("createdAt", "desc").get();
      const posts = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Intelligence sync failure" });
    }
  });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
