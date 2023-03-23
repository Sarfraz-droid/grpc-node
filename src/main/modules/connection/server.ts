import { ipcRenderer } from "electron";
import { client, createClient } from "./client";
import { chatProto } from "./proto";
import * as grpc from "@grpc/grpc-js";
import getPort from 'get-port';
import { IPCChannels } from "utils/constants";

export let port: null | number = null;
export let server: null | any = null;
export const createServer = async () => {

    if (server !== null){
        console.log("Server already running at %d", port)
        ipcRenderer.send(IPCChannels.ServerStatus, {
            status: "running",
            port: port
        });
        return;
    }

    port = await getPort();
    server = new grpc.Server();
    server.addService((chatProto as any).Chat.service, {
        Send: (call : any) => {
            const { text } = call.request;
            console.log(text);

            ipcRenderer.send(IPCChannels.Send, {
                message: text
            })
            // callback(null, { message: 'Hello from server!' });
        },
        Receive: (call : any) => {
            const { text } = call.request;
            console.log(text);

            // callback(null, { message: 'Hello from server!' });
        },
        Join: (call : any) => {
            // console.log(call.request);
            const { port } = call.request;
            // console.log("Port: ", port);
            if (client !== null) return;

            ipcRenderer.send(IPCChannels.Join, {
                port: port,
                message: `port ${port} has connected.`
            })


            createClient(port, port)
        }
    });

    server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), () => {
        // console.log("Server started at port 50051")
        server.start();
    });
    console.log(`Server started at port ${port}`)
    ipcRenderer.send(IPCChannels.ServerStatus, {
        status: "started",
        port: port
    });

    // return server;
}
