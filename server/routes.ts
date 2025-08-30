import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertConversationSchema, insertMessageSchema, insertUserSettingsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Conversations API
  app.get("/api/conversations", async (req, res) => {
    try {
      // For demo purposes, we'll use a default user ID
      const userId = "demo-user";
      const conversations = await storage.getConversationsByUser(userId);
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const userId = "demo-user"; // For demo purposes
      const conversation = await storage.createConversation({ ...data, userId });
      res.json(conversation);
    } catch (error) {
      res.status(400).json({ error: "Invalid conversation data" });
    }
  });

  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteConversation(id);
      if (deleted) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Conversation not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Messages API
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const messages = await storage.getMessagesByConversation(id);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const { id } = req.params;
      const data = insertMessageSchema.parse({ ...req.body, conversationId: id });
      const message = await storage.createMessage(data);
      res.json(message);
    } catch (error) {
      res.status(400).json({ error: "Invalid message data" });
    }
  });

  // Weather Agent Streaming
  app.post("/api/weather-agent/stream", async (req, res) => {
    try {
      const { messages, threadId = "demo-thread" } = req.body;
      
      // Make request to the weather agent API
      const response = await fetch("https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream", {
        method: "POST",
        headers: {
          'Accept': '*/*',
          'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8,fr;q=0.7',
          'Connection': 'keep-alive',
          'Content-Type': 'application/json',
          'x-mastra-dev-playground': 'true'
        },
        body: JSON.stringify({
          messages,
          runId: "weatherAgent",
          maxRetries: 2,
          maxSteps: 5,
          temperature: 0.5,
          topP: 1,
          runtimeContext: {},
          threadId,
          resourceId: "weatherAgent"
        })
      });

      if (!response.ok) {
        throw new Error(`Weather agent API responded with ${response.status}`);
      }

      // Set up streaming response
      res.setHeader('Content-Type', 'text/stream-protocol');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');

      // Pipe the response stream
      if (response.body) {
        const reader = response.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              res.write(value);
            }
            res.end();
          } catch (error) {
            console.error('Streaming error:', error);
            res.status(500).end();
          }
        };
        pump();
      } else {
        res.status(500).json({ error: "No response body from weather agent" });
      }
    } catch (error) {
      console.error('Weather agent error:', error);
      res.status(500).json({ error: "Failed to communicate with weather agent" });
    }
  });

  // User Settings API
  app.get("/api/settings", async (req, res) => {
    try {
      const userId = "demo-user";
      let settings = await storage.getUserSettings(userId);
      
      if (!settings) {
        // Create default settings
        settings = await storage.createUserSettings({
          userId,
          theme: "auto",
          language: "en",
          weatherAlerts: true,
          soundEnabled: false,
          location: null,
        });
      }
      
      res.json(settings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch settings" });
    }
  });

  app.patch("/api/settings", async (req, res) => {
    try {
      const userId = "demo-user";
      const updates = insertUserSettingsSchema.partial().parse(req.body);
      const settings = await storage.updateUserSettings(userId, updates);
      res.json(settings);
    } catch (error) {
      res.status(400).json({ error: "Invalid settings data" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket server for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    console.log('WebSocket client connected');

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        // Handle different message types
        switch (message.type) {
          case 'typing':
            // Broadcast typing indicator to other clients
            wss.clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({
                  type: 'typing',
                  conversationId: message.conversationId,
                  isTyping: message.isTyping
                }));
              }
            });
            break;
            
          case 'join_conversation':
            // Join a specific conversation room
            ws.conversationId = message.conversationId;
            break;
            
          default:
            console.log('Unknown message type:', message.type);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });

    // Send welcome message
    ws.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Weather Agent WebSocket'
    }));
  });

  return httpServer;
}
