const express = require('express')
const app = express()
const cors = require('cors');
const port = 9001

app.use(cors());
app.use(express.json());
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/utenti', (req, res) => {
    const agenti = req.body;
    const tempAgent=[];
    let temp={
        seed:'',
        walletName:'',
        label:'',
        properties:''
    }
    //ottengo solo i campi specifici da ogni agente e mi creo per ogni agente un oggetto che contiene 
    console.log(agenti)
    agenti.forEach((element)=>{
        temp.seed=element.id;
        temp.walletName=element.walletName;
        temp.label=element.label;
        temp.properties=element.prop;
        tempAgent.push(temp);
    })
    // Process the received data as needed
    res.status(200).json({ message: 'Data received successfully' });
    
    const uniqueObjects = tempAgent.reduce((accumulator, currentObject) => {
        // Check if the current object's "seed" property is not in the accumulator
        const isUnique = !accumulator.some(obj => obj.seed === currentObject.seed);
    
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
    console.log(agenti)
}