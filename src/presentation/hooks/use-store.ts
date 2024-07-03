'use client';

import { createMainStore } from '@/presentation/stores';
import { useStore } from 'zustand';

export const mainStore = createMainStore();

export { useStore };
