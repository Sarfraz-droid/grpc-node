// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { createServer } from "./modules/connection/server"
import { createClient, ClientSend } from "./modules/connection/client"
import { IPCChannels } from 'utils/constants';
import { FileSend } from './modules/services/rpc'
import fs from "fs"


const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: IPCChannels, args: unknown[]) {
      ipcRenderer.send(channel, args);
    },
    on(channel: IPCChannels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: IPCChannels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event: any, ...args: any) => func(...args));
    },
    removeAllListeners(channel: IPCChannels) {
      ipcRenderer.removeAllListeners(channel);
    }
  },
  // connection : {
  //   createServer,
  //   createClient
  // }
};


const connectionHandler = {
  createServer,
  createClient,
  send(text:string) {
    console.log(`Sending message: ${text}`)
    // console.log(text)
    ClientSend(text)
  },
  FileSend
}

if(!fs.existsSync('./server')) {
  fs.mkdirSync('./server')
}

contextBridge.exposeInMainWorld('GRPCconnection', connectionHandler);

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;

export type connectionHandler = typeof connectionHandler;
