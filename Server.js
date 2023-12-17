const express = require('express')
const app = express()
const cors = require('cors');
const port = 9001
const { exec } = require('child_process');
const fetch = require('node-fetch');
const {spawn} = require('child_process');
const { rejects } = require('assert');
var localMachineIP = "192.168.0.0"

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/utenti',(req, res) => {
    
    initializeNetwork()
    .then(()=>{
      retryFetch(5,5000)
      .then(()=>{
        const agenti = req.body;
      let seedArray=[];
      // ottengo solo i campi specifici da ogni agente e mi creo per ogni agente un oggetto che contiene
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
        // // If the GET request is successful, call the function
      creteAgentCommand(uniqueObjects)
      .then(() => {
        let port=8030;
        uniqueObjects.forEach((e)=>{port=port+10;createAgents(e,port)})
      }) 
    })
  })
});

function initializeNetwork(){
  return new Promise((resolve, reject) => {

    exec('hostname -I',
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
        localMachineIP = stdout.split(" ")[0];
    });

  const curlCommand = `./von-network/manage down
    ./indy-tails-server/docker/manage down
    ./von-network/manage up
    ./indy-tails-server/docker/manage up`;
    
    const child =spawn(curlCommand,{shell:true,stdio:'inherit'})
    child.on('close',(code)=>{
      console.log("child process exited with code ",code);
      if(code<1){
        resolve(code)
      }else{
        reject(code);
        return;
      }
    })
  })
}
function retryFetch(maxRetries, delay) {
  return new Promise((resolve, reject) => {
    const fetchWithRetry = (currentRetry) => {
      const curlCommand = `curl http://localhost:9000`;
      exec(curlCommand, (error, stdout, stderr) => {
        if (!error) {
          resolve(stdout)
          // resolve(stdout);
        } else if (currentRetry < maxRetries) {
          console.log(`Retrying GET request, attempt ${currentRetry + 1}...`);
          setTimeout(() => fetchWithRetry(currentRetry + 1), delay);
        } else {
          console.error(`Error executing curl command: ${error.message}`);
          reject(error);
        }
      });
    };

    fetchWithRetry(0);
  });
}
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function creteAgentCommand(agenti){
  console.log(agenti)
  const promiseChain = agenti.reduce((promise, element) => {
    return promise.then(() => doCurl(element.id));
  }, Promise.resolve());

  return promiseChain;
}
async function createAgents(uniqueObjects,port){
  return new Promise((resolve, reject) => {
  let seedString = "00000000000000000000000000000000";
  seedString = seedString.slice(0, -uniqueObjects.id.length) + uniqueObjects.id;
  let portPlus=port+1;
  const curlCommand = `PORTS='${port} ${portPlus}' ./aries-cloudagent-python/scripts/run_docker start  --wallet-type indy --seed ${seedString} --wallet-key ${uniqueObjects.name} --wallet-name ${uniqueObjects.name} --genesis-url http://${localMachineIP}:9000/genesis --inbound-transport http 0.0.0.0 ${port} --outbound-transport http --admin 0.0.0.0 ${portPlus} --admin-insecure-mode --endpoint http://172.17.0.1:${port} --auto-provision --auto-accept-invites --auto-accept-requests --label ${uniqueObjects.name} --tails-server-base-url http://${localMachineIP}:6543 --preserve-exchange-records --auto-ping-connection --auto-store-credential --auto-respond-credential-proposal --auto-respond-credential-offer --auto-respond-credential-request --auto-verify-presentation --debug-credentials`;
  // console.log(curlCommand)
  const child =spawn(curlCommand,{shell:true,stdio:'inherit'})
  child.on('close', (code) => {
    console.log("child process exited with code ", code);
    if (code === 0) {
      resolve();
    } else {
      reject(`Child process exited with code ${code}`);
    }
  });
});

  //for some reason this worked only for a few time 
  
  // exec(curlCommand,{TTY:false}, (error, stdout, stderr) => {
  //   if (error) {
  //     console.error(Error executing curl command: ${error.message});
  //     return;
  //   }
  //   console.log("chiamata eseguita");
  // });
}
function doCurl(seed) {
  let delay=5000;
  return new Promise((resolve, reject) => {
    // let tempString = "00000000000000000000000000000000";
    // const url = 'http://localhost:9000/register';

    // tempString = tempString.slice(0, -seed.length) + seed;
    // const seedString = {"seed": `${tempString}`};
    // const curlCommand = `curl --location --request POST '${url}' \
    //   --header 'Content-Type: text/plain' \
    //   --data-raw '{"seed": "${tempString}"}'`;
    // console.log(curlCommand)
    // exec(curlCommand, (error, stdout, stderr) => {
    //   if (error) {
    //     console.error(`Error executing curl command: ${error.message}`);
    //     reject(error);
    //     return;
    //   }
    //   console.log(stderr);
    //   console.log(stdout,stdout.includes("Not ready"))
    //   console.log("chiamata eseguita");
    //   resolve(stdout);
    // });
    const fetchWithRetry = () => {
      let tempString = "00000000000000000000000000000000";
      const url = 'http://localhost:9000/register';
  
      tempString = tempString.slice(0, -seed.length) + seed;
      const curlCommand = `curl --location --request POST '${url}' \
        --header 'Content-Type: text/plain' \
        --data-raw '{"seed": "${tempString}"}'`;
      exec(curlCommand, (error, stdout, stderr) => {
        console.log(error,stdout,stderr)
        if (!stdout.includes("Not ready")) {
          resolve(stdout)
          // resolve(stdout);
        } else if (!error) {
          console.log('Retrying curl request...');
          setTimeout(() => fetchWithRetry(), delay);
        } else {
          console.error(`Error executing curl command: ${error.message}`);
          reject(error);
        }
      });
    };

    fetchWithRetry(0);
  });
}