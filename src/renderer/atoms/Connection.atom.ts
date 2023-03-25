import {atom} from "recoil"

export const ConnectionAtom = atom({
    key: "ConnectionAtom",
    default: {
        server: {
            status: "stopped",
            port: null
        },
        client: {
            status: "stopped",
            port: null
        }
    }
})

export type ConnectionAtomType = typeof ConnectionAtom