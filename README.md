
# ChorSSI

A model driven framework for implementing Self-Sovereign Identity on Blockchain


## Requirements

- Aca-Py: https://github.com/hyperledger/aries-cloudagent-python/tree/main
- Indy-Von Network: https://github.com/bcgov/von-network
- Indy Tails Server: https://github.com/bcgov/indy-tails-server
- Docker: https://docs.docker.com/engine/install/

von-network & indy-tails-server folders have to be placed inside the project (ChorSSI) folder


## Starting the Web Application

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Starting ChorSSI
Inside 'config' folder, you have to replace on each file:
- "pathTo" string with the path to the matching installed libraries indicated on the 'Requirements' section.
- "192.168.1.8" string with the local IP address of your device
- "dockerLocalIP" string with the IP address of Docker 

Once you have correctly changed the script files, you will be able to build up ChorSSI by launching the 'start.sh' script with the following command:

```bash
sh start.sh
```