'use client';

import { injectable } from 'inversify';

export interface LocalStorageDataSource {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

@injectable()
export class LocalStorageDataSourceImpl implements LocalStorageDataSource {
  public get<T>(key: string): T | null {
    let value = null;

    if (typeof window !== 'undefined') {
      value = window.localStorage.getItem(key);
    }

    return value ? JSON.parse(value) : null;
  }

  public set<T>(key: string, value: T): void {
    window.localStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    window.localStorage.removeItem(key);
  }
}
