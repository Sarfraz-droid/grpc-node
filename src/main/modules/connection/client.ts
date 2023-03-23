import * as grpc from "@grpc/grpc-js";
import { chatProto } from "./proto";
import { ipcRenderer } from "electron";
import { IPCChannels } from "utils/constants";

export let client: null | any = null;
export let connectedPort: null | number = null;

const startChat = (port : number) => {
    const channel = client.Join({
        port: port
    })
}

export const ClientSend = (message : string) => {

    if (client === null){
        console.log("Client is null")
        return;
    }

    const channel = client.Send({
        text: message
    },(res : any) => {
        console.log(res)
    })

    // console.log(channel)

    // console.log(channel?.status)

    // channel.on('*', (data : any) => {
    //     console.log("event", data)
    // });
}

export const createClient = async (port : number, serverPort : number) => {

    if (client !== null) {
        console.log(client)
        ipcRenderer.send(IPCChannels.ClientStatus, {
            status: "connected",
            port: connectedPort,
        })
        return;
    }
    console.log(`Connecting to port ${port} as Client...`)
    connectedPort = port;
    client = new (chatProto as any).Chat(
        `localhost:${port}`,
        grpc.credentials.createInsecure()
    );

    if (client === null) {
        console.log("Client is null")
        return;
    }

    ipcRenderer.send(IPCChannels.ClientStatus, {
        status: "connected",
        port: port,
        message: `Connected to port ${port}`
    })
    startChat(serverPort);
}
