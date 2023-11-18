const http = require('http');
//import http from 'http';


const hostname = 'localhost';
//const port = 8041;

//console.log('Agent is running on: ' + `http://${hostname}:`);
var invitation ={
    "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation",
    "@id": "23a3fd0f-f3b8-4e77-a262-7f7bf69559e3",
    "label": "registry",
    "recipientKeys": [
        "82GbRtGUCVVP5Stc19BC98hK667JzSDNwW8oCLo4JddF"
    ],
    "serviceEndpoint": "http://dockerLocalIP:8050"
}
const httpAsync =(options, body) =>{
    
    return new Promise(function (resolve, reject) {
        const req = http.request(options, (res) => {
            const { statusCode } = res;
            const contentType = res.headers['content-type'];

            let e;
            if (statusCode !== 200) {
                e = new Error('Request Failed.\n' + `Status Code: ${statusCode}`);
            } else if (!/^application\/json/.test(contentType)) {
                e = new Error('Invalid content-type.\n' + `Expected application/json but received ${contentType}`);
            }
            if (e) {
                // Consume response data to free up memory
                res.resume();
                return reject(e);
            }

            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    return resolve(parsedData);
                } catch (e) {
                    return reject(e);
                }
            });
        }).on('error', (e) => {
            return reject(e);
        });
        
        if (body) {
            req.write(body || '');
        }
        
        req.end();
    }); 
   /*  const headers = new Headers({
        'Content-Type': 'application/json',
    })
    

    const defaults = {headers: headers};
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
    .then(response => 
        response.json().then(json => {
            if(!response.ok) {
                return Promise.reject(json);
            }
            return json;
        })
    ); */
}

 class AgentService {
    

    async getStatus(port) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/status',
                method: 'GET'
            });
            //console.log("response",response);
            return response.label;
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async getConnections(port) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/connections',
                method: 'GET'
            });
            return response.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async createInvitation(port) {
        try {
            console.log(port);
            const response = await httpAsync({
                headers: {"Content-Type":"application/json",'Access-Control-Allow-Origin': '*'},
                hostname: hostname,
                port: port,
                path: '/connections/create-invitation?auto_accept=true',
                method: 'POST'
            }, invitation);
            console.log("responseInvitation",response);
            return response;
        } catch (error) {
            console.error(error);
            return {};
        }
    }

    async receiveInvitation(port, invitation) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/connections/receive-invitation',
                method: 'POST'
            }, invitation);
            return response;
        } catch (error) {
            console.error(error);
            return;
        }
    }

    async acceptInvitation(port, connectionId) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/connections/${connectionId}/accept-invitation`,
                method: 'POST'
            });
        } catch (error) {
            console.error(error);
            return;
        }
    }
    
    async removeConnection(port, connectionId) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/connections/${connectionId}`,
                method: 'DELETE'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getProofRequests(port) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/present-proof/records',
                method: 'GET'
            });
            return response.results;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async sendProofRequest(port, proofRequest) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: '/present-proof/send-request',
                method: 'POST'
            }, proofRequest);
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getCredentialRecord(port) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: '/issue-credential/records',
                method: 'GET'
            });
            this.response = response;
            return response.results;
        } catch (error) {
            console.error("errore" + error);
            return;
        }
    }

    async sendProposal(port, proposal) {
        try {
            await httpAsync({
                headers: {"Content-Type":"application/json"},
                hostname: hostname,
                port: port,
                path: '/issue-credential/send-proposal',
                method: 'POST'
            }, proposal);
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async sendRequest(port, proposal, exchange_id) {
        try {
            await httpAsync({
                headers: {"Content-Type":"application/json"},
                hostname: hostname,
                port: port,
                path: `/issue-credential/records/${exchange_id}/send-request`,
                method: 'POST'
            }, proposal);
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async storeCredential(port, exchange_id) {
        try {
            await httpAsync({
                //headers: {"Content-Type":"application/json"},
                hostname: hostname,
                port: port,
                path: `/issue-credential/records/${exchange_id}/store`,
                method: 'POST'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async removeCredential(port, exchange_id) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/issue-credential/records/${exchange_id}`,
                method: 'DELETE'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }
    
    async credentialForProof(port, presentation_id) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: `/present-proof/records/${presentation_id}/credentials`,
                method: 'GET'
            });
            this.response = response;
            return response;
        } catch (error) {
            console.error("errore" + error);
            return;
        }
    }

async getWalletCredential(port) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: `/credentials`,
                method: 'GET'
            });
            this.response = response;
            return response.results;
        } catch (error) {
            console.error("errore" + error);
            return;
        }
    }

    async removeWalletCredential(port, referent) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/credential/${referent}`,
                method: 'DELETE'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async removeProof(port, presentation_id) {
        try {
            await httpAsync({
                hostname: hostname,
                port: port,
                path: `/present-proof/records/${presentation_id}`,
                method: 'DELETE'
            });
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getSingleCredential(port, exchange_id) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: `/issue-credential/records/${exchange_id}`,
                method: 'GET'
            });
            //console.log("response",response.results);
            return response;
            
        } catch (error) {
            console.error(error);
            return [];
        }
    
    }

    async sendProof(port, proposal, pres_ex_id) {
        try {
            await httpAsync({
                headers: {"Content-Type":"application/json"},
                hostname: hostname,
                port: port,
                path: `/present-proof/records/${pres_ex_id}/send-presentation`,
                method: 'POST'
            },proposal);
        } catch (error) {
            console.error(error);
        } finally {
            return;
        }
    }

    async getRevocCredential(port, credential_id) {
        try {
            const response = await httpAsync({
                hostname: hostname,
                port: port,
                path: `/credential/revoked/${credential_id}`,
                method: 'GET'
            });
            //console.log("response",response.results);
            return response;
            
        } catch (error) {
            console.error(error);
            return [];
        }
    
    }

    
}

export default new AgentService();