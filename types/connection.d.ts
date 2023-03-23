import { Libp2p } from 'libp2p';

export {};

declare global {
  export interface IConnection {
    host: Libp2p | undefined;
    createNode(): Promise<void>;
    start(): Promise<void>;
  }
}
