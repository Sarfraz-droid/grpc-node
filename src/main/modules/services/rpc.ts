import {client} from "../connection/client"
import chunk from "chunk"


export const Send = (message : string) => {
    client.Send({
        text: message
    },(res : any) => {
        console.log(res)
    })
}

const convertToBuffer = async (file : File) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
    reader.onload = () => {
        
        resolve(Buffer.from(reader.result as ArrayBuffer));
    }

    reader.onerror = () => {
        console.log('Error: ', reader.error);
        reject(reader.error);
    }
    })
}

export const FileSend = async (file : File) => {

    const buffer = await convertToBuffer(file);

    if (buffer === null) return;

    console.log(buffer)

    const chunks = chunk(buffer as Array<any>, 102400);

    const id = window.crypto.randomUUID();

    console.log(chunks)
    console.log(id)

    client.Documents({
        id: id,
        name: file.name,
        size: file.size,
        type: file.type,
        length: chunks.length
    },(res: any) => {
        console.log(res)
    })

    chunks.forEach((chunk : any, index : number) => {
        client.Chunks({
            data: chunk,
            id: id,
            index: index
        },(res : any) => {
            console.log(res)
        })
    })
}