import { type User, type InsertUser, type Conversation, type InsertConversation, type Message, type InsertMessage, type UserSettings, type InsertUserSettings } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Conversation methods
  getConversation(id: string): Promise<Conversation | undefined>;
  getConversationsByUser(userId: string): Promise<Conversation[]>;
  createConversation(conversation: InsertConversation & { userId: string }): Promise<Conversation>;
  updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation>;
  deleteConversation(id: string): Promise<boolean>;

  // Message methods
  getMessage(id: string): Promise<Message | undefined>;
  getMessagesByConversation(conversationId: string): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteMessagesByConversation(conversationId: string): Promise<boolean>;

  // User settings methods
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  createUserSettings(settings: InsertUserSettings & { userId: string }): Promise<UserSettings>;
  updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private conversations: Map<string, Conversation>;
  private messages: Map<string, Message>;
  private userSettings: Map<string, UserSettings>;

  constructor() {
    this.users = new Map();
    this.conversations = new Map();
    this.messages = new Map();
    this.userSettings = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getConversation(id: string): Promise<Conversation | undefined> {
    return this.conversations.get(id);
  }

  async getConversationsByUser(userId: string): Promise<Conversation[]> {
    return Array.from(this.conversations.values()).filter(
      (conv) => conv.userId === userId
    ).sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime());
  }

  async createConversation(conversation: InsertConversation & { userId: string }): Promise<Conversation> {
    const id = randomUUID();
    const now = new Date();
    const conv: Conversation = {
      ...conversation,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.conversations.set(id, conv);
    return conv;
  }

  async updateConversation(id: string, updates: Partial<Conversation>): Promise<Conversation> {
    const conversation = this.conversations.get(id);
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    const updated = { ...conversation, ...updates, updatedAt: new Date() };
    this.conversations.set(id, updated);
    return updated;
  }

  async deleteConversation(id: string): Promise<boolean> {
    const deleted = this.conversations.delete(id);
    if (deleted) {
      // Also delete associated messages
      await this.deleteMessagesByConversation(id);
    }
    return deleted;
  }

  async getMessage(id: string): Promise<Message | undefined> {
    return this.messages.get(id);
  }

  async getMessagesByConversation(conversationId: string): Promise<Message[]> {
    return Array.from(this.messages.values())
      .filter((msg) => msg.conversationId === conversationId)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const id = randomUUID();
    const msg: Message = {
      ...message,
      id,
      createdAt: new Date(),
    };
    this.messages.set(id, msg);
    return msg;
  }

  async deleteMessagesByConversation(conversationId: string): Promise<boolean> {
    const messagesToDelete = Array.from(this.messages.entries())
      .filter(([_, msg]) => msg.conversationId === conversationId);
    
    messagesToDelete.forEach(([id]) => this.messages.delete(id));
    return true;
  }

  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    return Array.from(this.userSettings.values()).find(
      (settings) => settings.userId === userId
    );
  }

  async createUserSettings(settings: InsertUserSettings & { userId: string }): Promise<UserSettings> {
    const id = randomUUID();
    const now = new Date();
    const userSettings: UserSettings = {
      ...settings,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.userSettings.set(id, userSettings);
    return userSettings;
  }

  async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<UserSettings> {
    const existing = await this.getUserSettings(userId);
    if (!existing) {
      throw new Error("User settings not found");
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.userSettings.set(existing.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
