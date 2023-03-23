
export {};

declare global {
  interface Window {
    connection: {
      createNode(): Promise<void>;
      start(): Promise<void>;
    }
  }
}
