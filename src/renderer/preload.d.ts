import { ElectronHandler, connectionHandler } from 'main/preload';

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    electron: ElectronHandler;
    GRPCconnection: connectionHandler;
  }
}

export {};
