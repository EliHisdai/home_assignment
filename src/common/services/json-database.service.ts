import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DATABASE } from '../constants';
import { LogService } from './log.service';

@Injectable()
export class JsonDatabaseService implements OnModuleInit {
  constructor(private readonly logService: LogService) {}

  private readonly dbPath = path.join(process.cwd(), DATABASE.DEFAULT_PATH);
  private db: { [key: string]: unknown[] } = {};

  async onModuleInit(): Promise<void> {
    this.logService.log('Initializing JSON database service', 'JsonDatabaseService');
    await this.ensureDbExists();
    setInterval(async () => {
      try {
        await this.saveDatabase();
      } catch (error) {
        this.logService.exception(error as Error, 'JsonDatabaseService', 'Error saving database');
      }
    }, 1000);
  }

  private async ensureDbExists(): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(this.dbPath));
      const exists = await fs.pathExists(this.dbPath);

      if (!exists) {
        this.logService.log(`Database file not found, creating new one at ${this.dbPath}`, 'JsonDatabaseService');
        await fs.writeJson(this.dbPath, this.db);
      } else {
        this.logService.log(`Database file found at ${this.dbPath}, loading data`, 'JsonDatabaseService');
        await this.loadDatabase();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.logService.exception(error as Error, 'JsonDatabaseService', 'Error initializing database');
      } else {
        throw new Error('Unknown error occurred while initializing database');
      }
    }
  }

  private async loadDatabase(): Promise<void> {
    try {
      this.logService.debug(`Loading database from ${this.dbPath}`, 'JsonDatabaseService');
      this.db = await fs.readJson(this.dbPath);
      this.logService.debug(
        `Database loaded successfully - ${Object.keys(this.db)
          .map(k => `${k}: ${this.db[k].length} items`)
          .join(', ')}`,
        'JsonDatabaseService',
      );
    } catch (error) {
      this.logService.exception(error as Error, 'JsonDatabaseService', 'Error loading database');
      throw error;
    }
  }

  async saveDatabase(): Promise<void> {
    try {
      this.logService.debug(`Saving database to ${this.dbPath}`, 'JsonDatabaseService');
      await fs.writeJson(this.dbPath, this.db, { spaces: 2 });
      this.logService.debug('Database saved successfully', 'JsonDatabaseService');
    } catch (error) {
      this.logService.exception(error as Error, 'JsonDatabaseService', 'Error saving database');
      throw error;
    }
  }

  getCollection<T>(collectionName: (typeof DATABASE.COLLECTIONS)[keyof typeof DATABASE.COLLECTIONS]): T[] {
    this.logService.debug(`Getting collection: ${collectionName}`, 'JsonDatabaseService');
    //await this.loadDatabase();
    return (this.db[collectionName] as T[]) || [];
  }

  addItem<T extends object>(
    collectionName: (typeof DATABASE.COLLECTIONS)[keyof typeof DATABASE.COLLECTIONS],
    item: T,
  ): T {
    this.logService.debug(`Adding item to collection: ${collectionName}`, 'JsonDatabaseService');
    const collection = this.getCollection<T>(collectionName);

    // Check for duplicate ID
    if (item && 'id' in item) {
      const existingItem = collection.find(existing => (existing as { id: string }).id === item.id);
      if (existingItem) {
        throw new Error(`Item with id ${item.id} already exists in collection ${collectionName}`);
      }
    }
    collection.push(item as T);
    // No need to call saveCollection - the in-memory DB is already updated
    return item;
  }

  updateItem<T extends { id: string }>(
    collectionName: (typeof DATABASE.COLLECTIONS)[keyof typeof DATABASE.COLLECTIONS],
    id: string,
    updates: Partial<T>,
  ): T {
    this.logService.debug(`Updating item ${id} in collection: ${collectionName}`, 'JsonDatabaseService');
    const collection = this.getCollection<T>(collectionName);
    if (updates && !('id' in updates)) {
      const itemIndex = collection.findIndex(item => item.id === id);
      if (itemIndex === -1) {
        this.logService.warn(`Item with id ${id} not found in collection ${collectionName}`, 'JsonDatabaseService');
        throw new NotFoundException(`Item with id ${id} not found in collection ${collectionName}`);
      }

      const updatedItem = { ...collection[itemIndex], ...updates, id };
      collection[itemIndex] = updatedItem;
      return updatedItem;
    }
    throw new Error('Updates must not contain the id field');
  }

  deleteItem<T extends { id: string }>(
    collectionName: (typeof DATABASE.COLLECTIONS)[keyof typeof DATABASE.COLLECTIONS],
    id: string,
  ): boolean {
    this.logService.debug(`Deleting item ${id} from collection: ${collectionName}`, 'JsonDatabaseService');
    const collection = this.getCollection<T>(collectionName);
    const initialLength = collection.length;
    const filteredCollection = collection.filter(item => item.id !== id);

    if (filteredCollection.length === initialLength) {
      this.logService.warn(`Item with id ${id} not found in collection ${collectionName}`, 'JsonDatabaseService');
      return false;
    }

    // Update the in-memory database directly
    this.db[collectionName] = filteredCollection;
    return true;
  }

  async saveCollection<T>(
    collectionName: (typeof DATABASE.COLLECTIONS)[keyof typeof DATABASE.COLLECTIONS],
    data: T[],
  ): Promise<void> {
    this.logService.debug(`Saving collection: ${collectionName} with ${data.length} items`, 'JsonDatabaseService');
    this.db[collectionName] = data;
  }
}
