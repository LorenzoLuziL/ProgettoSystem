const express = require('express')
const app = express()
const cors = require('cors');
const port = 9001
const { exec } = require('child_process');
const fetch = require('node-fetch');

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.post('/utenti', (req, res) => {
    const agenti = req.body;
    let seedArray=[];
    //ottengo solo i campi specifici da ogni agente e mi creo per ogni agente un oggetto che contiene
    agenti.forEach((element)=>{
      let temp={
        id:element.id,
        seed:element.seed,
        walletName:element.walletName,
        label:element.label,
        properties:element.prop,
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
     
      creteAgentCommand(uniqueObjects);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

function creteAgentCommand(agenti){
  agenti.forEach((element)=>{
    doCurl(element.seed);
  })
}

function doCurl(seed) {
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
      return;
    }
    console.log("chiamata eseguita")
  });
}