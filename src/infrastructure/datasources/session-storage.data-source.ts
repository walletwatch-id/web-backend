'use client';

import { injectable } from 'inversify';

export interface SessionStorageDataSource {
  get<T>(key: string): T | null;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
}

@injectable()
export class SessionStorageDataSourceImpl implements SessionStorageDataSource {
  public get<T>(key: string): T | null {
    let value = null;

    if (typeof window !== 'undefined') {
      value = window.sessionStorage.getItem(key);
    }

    return value ? JSON.parse(value) : null;
  }

  public set<T>(key: string, value: T): void {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    window.sessionStorage.removeItem(key);
  }
}
