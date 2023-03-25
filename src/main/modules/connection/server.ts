import { ipcRenderer } from "electron";
import { client, createClient } from "./client";
import { chatProto } from "./proto";
import * as grpc from "@grpc/grpc-js";
import getPort from 'get-port';
import { IPCChannels } from "utils/constants";
import child_process from "child_process";
import path from "path";
import fs from "fs";

export let port: null | number = null;
export let server: null | any = null;

let tempState: any = {}


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
        },
        Receive: (call : any) => {
            const { text } = call.request;
            console.log(text);

        },
        Join: (call : any) => {
            const { port } = call.request;
            if (client !== null) return;

            ipcRenderer.send(IPCChannels.Join, {
                port: port,
                message: `port ${port} has connected.`
            })


            createClient(port, port)
        },
        Chunks: (call : any) => {
            const { data, id, index } = call.request;
            // console.log(index,id,data);

            if (tempState[id] === undefined) return;

            // tempState[id].chunks = {
            //     ...tempState[id].chunks,
            //     // [index]: data
            // }
            // console.log(index);
            // handleChunks(id,data,index);
            const handlFilePath = path.resolve('src/main/child/handleFile.js');
            const compileFilePath = path.resolve('src/main/child/compileFile.js');

            // console.log(handlFilePath, compileFilePath);
            const fileData = tempState[id];
            const child = child_process.fork(handlFilePath);
            child.send({
                id: id,
                data: data,
                index: index,
                fileData: tempState[id]
            })

            child.on('exit', (data : any) => {
                tempState[id].chunksLength--;

                if(tempState[id].chunksLength === 0){
                    console.log("File is complete")
                    const compileChild = child_process.fork(compileFilePath);

                    compileChild.send({
                        id: id,
                        fileData: tempState[id]
                    })

                    compileChild.on('exit', (data : any) => {
                        console.log("File is compiled")
                        fs.rmdirSync(path.resolve(`./server/${id}`), { recursive: true })

                        ipcRenderer.send(IPCChannels.Documents, {
                            id: id,
                            fileData: fileData,
                            name: `${id}-${fileData.name}`
                        })

                    })

                    delete tempState[id];
                }
            })

            ipcRenderer.send(IPCChannels.Chunks, {
                data: data,
                id: id,
                index: index
            })
        },
        Documents: (call : any) => {
            console.log(call.request)
            const {length,id, name, size, type} = call.request;

            tempState[id] = {
                chunksLength: length,
                len : length,
                id: id,
                name: name,
                path: path.resolve(`./server/${id}-${name}`),
                size: size,
                type: type,
            }

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
