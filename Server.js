const express = require('express')
const app = express()
const cors = require('cors');
const port = 9001
const { exec } = require('child_process');
const fetch = require('node-fetch');
const {spawn} = require('child_process');

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/utenti',(req, res) => {
    const agenti = req.body;
    let seedArray=[];
    //ottengo solo i campi specifici da ogni agente e mi creo per ogni agente un oggetto che contiene
    agenti.forEach((element)=>{
      let temp={
        id:element.id,
        name:element.name,
        properties:element.tipoAgente,
      }
        seedArray.push(temp)
    })
    // Process the received data as needed
    res.status(200).json({ message: 'Data received successfully' });
    const uniqueObjects = seedArray.reduce((accumulator, currentObject) => {
        // Check if the current object's "seed" property is not in the accumulator
        const isUnique = !accumulator.some(obj => obj.id === currentObject.id);
    
        // If unique, add it to the accumulator
        if (isUnique) {
          accumulator.push(currentObject);
        }
    
        return accumulator;
      }, []);
      console.log("primo log",uniqueObjects);
      creteAgentCommand(uniqueObjects)
    .then(() => {
      let port=8030;
      uniqueObjects.forEach((e)=>{port=port+10;createAgents(e,port)})
    })
    .catch((error) => console.error('Error:', error));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function creteAgentCommand(agenti){
  const promiseChain = agenti.reduce((promise, element) => {
    return promise.then(() => doCurl(element.id));
  }, Promise.resolve());

  return promiseChain;
}
function createAgents(uniqueObjects,port){
  let seedString = "00000000000000000000000000000000";
  seedString = seedString.slice(0, -uniqueObjects.seed.length) + uniqueObjects.seed;
  let portPlus=port+1;
  const curlCommand = `PORTS='${port} ${portPlus}' /home/lollo/Scrivania/Progett/Lib/aries-cloudagent-python/scripts/run_docker start  --wallet-type indy --seed ${seedString} --wallet-key welldone --wallet-name ${uniqueObjects.walletName} --genesis-url http://192.168.1.11:9000/genesis --inbound-transport http 0.0.0.0 ${port} --outbound-transport http --admin 0.0.0.0 ${portPlus} --admin-insecure-mode --endpoint http://172.17.0.1:${port} --auto-provision --auto-accept-invites --auto-accept-requests --label ${uniqueObjects.label} --tails-server-base-url http://192.168.1.11:6543 --preserve-exchange-records --auto-ping-connection ${uniqueObjects.properties}`;
  const child =spawn(curlCommand,{shell:true,stdio:'inherit'})
  child.on('close',(code)=>{
    console.log("child process exited with code ",code);
  })

  //for some reason this worked only for a few time 
  
  // exec(curlCommand,{TTY:false}, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(`Error executing curl command: ${error.message}`);
  //     return;
  //   }
  //   console.log("chiamata eseguita");
  // });
}
function doCurl(seed) {
  return new Promise((resolve, reject) => {
    let tempString = "00000000000000000000000000000000";
    const url = 'http://localhost:9000/register';

    tempString = tempString.slice(0, -seed.length) + seed;
    const seedString = `{"seed": "${tempString}"}`;
    const curlCommand = `curl --location --request POST '${url}' \
      --header 'Content-Type: text/plain' \
      --data-raw '${seedString}'`;

    exec(curlCommand, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing curl command: ${error.message}`);
        reject(error);
        return;
      }
      console.log("chiamata eseguita");
      resolve(stdout);
    });
  });
}