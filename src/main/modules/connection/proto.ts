import * as protoLoader from "@grpc/proto-loader";
import path from "path";
import * as grpc from "@grpc/grpc-js";

const __dirname = path.resolve();

const PROTO_PATH = path.join(__dirname, '/src/proto/chat.proto');

console.log(PROTO_PATH);

    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

export let chatProto = grpc.loadPackageDefinition(packageDefinition).chat;
