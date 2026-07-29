import { CustomSign, EmergencyRecord, SubtitleItem } from '../types';

const DB_NAME = 'SignBridgeAI_OfflineDB';
const DB_VERSION = 1;

export class OfflineStorage {
  private dbPromise: Promise<IDBDatabase>;

  constructor() {
    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;

        if (!db.objectStoreNames.contains('emergency_logs')) {
          db.createObjectStore('emergency_logs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('custom_signs')) {
          db.createObjectStore('custom_signs', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('meeting_transcripts')) {
          db.createObjectStore('meeting_transcripts', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('model_cache')) {
          db.createObjectStore('model_cache', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Emergency Log Storage
  public async addEmergencyRecord(record: EmergencyRecord): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('emergency_logs', 'readwrite');
      tx.objectStore('emergency_logs').put(record);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async getEmergencyRecords(): Promise<EmergencyRecord[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('emergency_logs', 'readonly');
      const req = tx.objectStore('emergency_logs').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Custom AI Signs Dataset Storage
  public async saveCustomSign(sign: CustomSign): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('custom_signs', 'readwrite');
      tx.objectStore('custom_signs').put(sign);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async getCustomSigns(): Promise<CustomSign[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('custom_signs', 'readonly');
      const req = tx.objectStore('custom_signs').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }

  // Meeting Transcripts
  public async saveSubtitleItem(item: SubtitleItem): Promise<void> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('meeting_transcripts', 'readwrite');
      tx.objectStore('meeting_transcripts').put(item);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  public async getSubtitleHistory(): Promise<SubtitleItem[]> {
    const db = await this.dbPromise;
    return new Promise((resolve, reject) => {
      const tx = db.transaction('meeting_transcripts', 'readonly');
      const req = tx.objectStore('meeting_transcripts').getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
  }
}

export const offlineStorage = new OfflineStorage();
