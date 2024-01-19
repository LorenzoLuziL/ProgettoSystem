
# ChorSSI

A model driven framework for implementing Self-Sovereign Identity on Blockchain.

As we increasingly rely on digital platforms for communication, commerce, and other activities, the need for secure and reliable methods of identifying ourselves has become more important than ever. Traditional identity management systems, which are often centralized and controlled by third parties, have been criticized for being insecure and vulnerable to data breaches, fraud, and other forms of abuse. In fact, the storage of user identity data in multiple centralized data repositories with varying implementations of security present a tempting target for hackers, leading to increased security breaches and identity fraud. In addition, centralized data repositories present a lack of appropriate data management standards, resulting in potential privacy troubles.

Self-sovereign identity (SSI) is an emerging concept in the field of digital identity management that aims to empower individuals by providing them with more control and autonomy over their personal data and online identities. The SSI paradigm shifts away from the traditional, centralized systems of identity management, where individuals are forced to rely on third-party providers to create, manage, and authenticate their digital identities. Instead, SSI proposes a decentralized and distributed architecture where individuals can create, own, and control their digital identities using cryptographic technologies such as blockchain.

This software is a model-driven framework that can replicate the behavior and reproduce all the typical operations of self-sovereign identity systems.

## Requirements for running in a new Virtual Machine 
- Docker: https://docs.docker.com/engine/install/
```
sudo apt install install docker.io
```
- Python & pip
```
sudo apt update
sudo apt install software-properties-common
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
sudo apt install python3.8
python --version
sudo apt update
sudo apt install python3-pip
pip3 --version
```
-  NVM (version 14.17.5 of Node)
```
sudo apt install curl 
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash 
source ~/.profile   
nvm install 14.17.5
```

### Software Compliance
This software was originally built using version 18.04 of Ubuntu https://releases.ubuntu.com/18.04/ and version 14.17.5 of Node.
If you are using different versions of these, you could maybe meet some unexpected problems or errors.

These external repositories are already included in the main repository:
- Aca-Py: [aries-cloudagent-python](https://github.com/hyperledger/aries-cloudagent-python/tree/main)
- Indy-Von Network: [von-network](https://github.com/bcgov/von-network)
- Indy Tails Server: [indy-tails-server](https://github.com/bcgov/indy-tails-server)

If you're not using codespace you can run the tool following the instructions below.

### Make the code runnable for Virtual Machines
First of all modify the following files
> [!CAUTION]
> Do not modify the following files if you want to use the software in codespace

- APIUtils.js   `./src/components/util/APIUtils.js`
  Replace each line of this form
  ```
  url: "https://friendly-couscous-r444p94p66qg354v4-"+port+".app.github.dev/connections/create-invitation?auto_accept=true&multi_use=true",
  ```
  with:
  ```
  url: "http://localhost:"+port+"/connections/create-invitation?auto_accept=true&multi_use=true",
  ```
  
- Server.js 
  Replace each IP 172.x.y.z with `localhost`
   
- bpmn.modeler.component.jsx   `./src/components/bpmn/bpmn.modeler.component.jsx`
  replace
  ```
  url:`https://friendly-couscous-r444p94p66qg354v4-${port}.app.github.dev`
  ```
  with
  ```
  url:`https://localhost:${port}`
  ```
- SpellProps.js  `./src/lib/property-panel/provider/magic/parts/SpellProps.js`
  Replace this line of code
  ```
  var url = "https://friendly-couscous-r444p94p66qg354v4-" + getPortByAgentName(parsedName) + ".app.github.dev";
  ```
  with
  ```
  var url = "https://localhost:" + getPortByAgentName(parsedName);
  ```
  
## Starting ChorSSI


- Build the von-network's server
  ```
  ./von-network/manage build
  ```
  
- Install dependencies
  ```
  npm install
  ```

- Start the server
  ```
  node Server.js
  ```

- Start the tool
  ```
  node Server.js
  ```
