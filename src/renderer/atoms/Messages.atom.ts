import {atom} from "recoil"

export interface IMessageAtom {
    message: string,
    type: "sent" | "received" | "info" ,
    messageType: "text" | "file" | "image" | "video" | "audio" | "document" | "other",
    id?: string,
    fileData?: {
        id: string,
        len: number,
        chunksLength: number,
        name: string,
        size: number,
        type: string,
        path: string
    }
}

export const MessagesAtom = atom<Array<IMessageAtom>>({
    key: "MessagesAtom",
    default: []
})