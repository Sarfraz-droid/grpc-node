const path = require('path');
const fs = require('fs');

console.log("Child Process Spawned",process.pid)

process.on('message', (message) => {
    console.log('Message from parent:', message)
    const {fileData, id,index, data} = message;

    handleChunks(id, data,index, fileData);
    fileData.chunksLength--;

    process.exit(1);
})

const handleChunks = (id, data,index, fileData) => {
    

    // console.log(fileData,data)

    const filePath = path.resolve(`./server/${id}/${index}-${fileData.name}.bin`);

    if(!fs.existsSync(path.resolve(`./server/${id}`))){
        fs.mkdirSync(path.resolve(`./server/${id}`));
    }

    fs.writeFileSync(filePath, Buffer.from(data));
}
