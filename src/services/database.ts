export interface Word {
  id: number;
  headword: string;
  meaning: string;
  example?: string;
  audioKey?: string;
}

export interface Progress {
  wordId: number;
  correct: number;
  wrong: number;
}

export interface Meta {
  highScore: number;
}

export interface QuizQuestion {
  word: Word;
  type: 'choice' | 'type' | 'audio';
  options?: string[];
  userAnswer?: string;
  isCorrect?: boolean;
}

export class DatabaseService {
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'FunWordsDB';
  private readonly DB_VERSION = 1;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create words store
        if (!db.objectStoreNames.contains('words')) {
          const wordsStore = db.createObjectStore('words', { keyPath: 'id' });
          wordsStore.createIndex('headword', 'headword', { unique: true });
        }

        // Create progress store
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'wordId' });
        }

        // Create meta store
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta', { keyPath: 'key' });
        }
      };
    });
  }

  async addWords(words: Word[]): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['words'], 'readwrite');
      const store = transaction.objectStore('words');

      words.forEach(word => {
        store.add(word);
      });

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async getRandomWords(count: number): Promise<Word[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['words'], 'readonly');
      const store = transaction.objectStore('words');
      const request = store.getAll();

      request.onsuccess = () => {
        const allWords = request.result;
        // Shuffle and take count words
        const shuffled = [...allWords].sort(() => Math.random() - 0.5);
        resolve(shuffled.slice(0, count));
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateProgress(wordId: number, isCorrect: boolean): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      
      const getRequest = store.get(wordId);
      getRequest.onsuccess = () => {
        const progress = getRequest.result || { wordId, correct: 0, wrong: 0 };
        
        if (isCorrect) {
          progress.correct += 1;
        } else {
          progress.wrong += 1;
        }
        
        const putRequest = store.put(progress);
        putRequest.onsuccess = () => resolve();
        putRequest.onerror = () => reject(putRequest.error);
      };
      getRequest.onerror = () => reject(getRequest.error);
    });
  }

  async getHighScore(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meta'], 'readonly');
      const store = transaction.objectStore('meta');
      const request = store.get('highScore');

      request.onsuccess = () => {
        resolve(request.result?.value || 0);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async updateHighScore(score: number): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['meta'], 'readwrite');
      const store = transaction.objectStore('meta');
      const request = store.put({ key: 'highScore', value: score });

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getProgress(): Promise<Progress[]> {
    if (!this.db) throw new Error('Database not initialized');

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}

export const dbService = new DatabaseService();