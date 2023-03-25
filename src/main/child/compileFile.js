const fs = require('fs');
const path = require('path');

console.log('Child Process Spawned');

process.on('message', (message) => {
    const { fileData, id, data, index } = message;
    
    compileFile(id, fileData);
    process.exit(0);
});

const compileFile = (id, fileData) => {
  const files = fs.readdirSync(path.resolve(`./server/${id}`));

  console.log(files);

  const filesData = [];

  for (let i = 0; i < fileData.len; i++) {
    const data = fs.readFileSync(
      path.resolve(`./server/${id}/${i}-${fileData.name}.bin`)
    );
    filesData.push(data);
  }

  const finalFile = Buffer.concat(filesData);
  // console.log('Final File', filesData);

  // fs.rmdir(path.resolve(`./server/${id}`), { recursive: true }, (err) => {
  //   if (err) {
  //     throw err;
  //   }else{
  //       console.log('Deleted')
  //   }
  // });




  const filePath = path.resolve(`./server/${id}-${fileData.name}`);

  fs.writeFileSync(filePath, finalFile);
};
