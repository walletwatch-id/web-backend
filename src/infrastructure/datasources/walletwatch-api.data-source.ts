import axios, { AxiosInstance } from 'axios';

export interface WalletWatchApiDataSource extends AxiosInstance {}

const config = {
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true,
  withXSRFToken: true,
};

export const walletWatchApiDataSourceClientImpl: WalletWatchApiDataSource = axios.create(config);
export const walletWatchApiDataSourceServerImpl: WalletWatchApiDataSource = axios.create(config);
