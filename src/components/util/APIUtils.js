import { _agents, _proofPresentation } from "../../ssi/config";

const request = (options) => {
    const headers = new Headers({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'accept': 'application/json',
    })


    const defaults = { headers: headers };
    options = Object.assign({}, defaults, options);

    return fetch(options.url, options)
        .then(response =>
            response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            })
        );
};

function createInvitation(port) {
    return request({
        url: "http://localhost:" + port + "/connections/create-invitation?auto_accept=true&multi_use=true",
        method: 'POST',
        /* body:{"@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/connections/1.0/invitation",
            "@id": "f833c237-71a4-4566-b77f-ca09075c051e",
            "label": "**********seller",
            "recipientKeys": [
                "9uoQv1r4r4W3U8ywRMUrVrYTsSKgtDEU6LgfQKHGX8jL"
            ],
            "serviceEndpoint": "http://dockerLocalIP:"+ entry[1].agentPort-1 
        }  */
        // });
    })
}

export function getConnections(port) {
    return request({
        url: "http://localhost:" + port + "/connections",
        method: 'GET',

    })
}


export function getIssuedCredentialAPI(port) {
    return request({
        url: "http://localhost:" + port + "/issue-credential/records",
        method: 'GET',

    })
}

export function getCredentialWalletAPI(port) {
    return request({
        url: "http://localhost:" + port + "/credentials",
        method: 'GET',

    })
}

export function getPresentationsAPI(port) {
    return request({
        url: "http://localhost:" + port + "/present-proof/records",
        method: 'GET',

    })
}

export function getSchemaIdAPI(port) {
    return request({
        url: "http://localhost:" + port + "/schemas/created",
        method: 'GET',

    })
}

export function getSchemaDetailsAPI(port, credId) {
    return request({
        url: "http://localhost:" + port + "/schemas/" + credId,
        method: 'GET',

    })
}

export function getCredDefIdAPI(port) {
    return request({
        url: "http://localhost:" + port + "/credential-definitions/created",
        method: 'GET',

    })
}

export function getCredDefIdDetailsAPI(port, credId) {
    return request({
        url: "http://localhost:" + port + "/credential-definitions/" + credId,
        method: 'GET',

    })
}

export function getValidCredentialAPI(port, cred) {
    return request({
        url: "http://localhost:" + port + "/present-proof/records/" + cred + "/credentials",
        method: 'GET',

    })
}


export function getCredDefExchangedAPI(port) {
    return request({
        url: "http://localhost:" + port + "/issue-credential/records",
        method: 'GET',

    })
}

export function getPresExchangeAPI(port) {
    return request({
        url: "http://localhost:" + port + "/present-proof/records",
        method: 'GET',

    })
}




export function connectAgents(port) {
    var invitationList = [];

    //Object.entries(_agents).forEach(entry => {
    var call = createInvitation(port);
    invitationList.push(call);
    return invitationList;
}

export function receiveInvitation(invitation, receiver) {

    //TODO: da qui ciclo nei vari agent presenti nella coreografi 
    // mettere codice per fare in modo prima di creare i vari agent e poi di connetterli
    var arr = Object.entries(_agents).map(item => item[1].agentPort);
    //console.log("provaaa", Object.entries(_agents)[i][1].agentPort)

/*      if (entry[0] !== invitation.invitation.label) {
 */        return request({
        url: "http://localhost:" + receiver + "/connections/receive-invitation?auto_accept=true&multi_use=true",
        method: 'POST',
        body: JSON.stringify(invitation.invitation)
    });
    // } 
}



export function sendOfferAPI(port, body) {
    return request({
        url: "http://localhost:" + port + "/issue-credential/send-offer",
        method: 'POST',
        body: body
    })
}


export function sendProofRequestAPI(port, body) {
    return request({
        url: "http://localhost:" + port + "/present-proof/send-request",
        method: 'POST',
        body: body
    })
}

export function sendPresentationAPI(port, presEx, credential) {
    _proofPresentation.requested_attributes.additionalProp1.cred_id = credential;
    console.log("body", _proofPresentation);
    try {
        return request({
            url: "http://localhost:" + port + "/present-proof/records/" + presEx + "/send-presentation",
            method: 'POST',
            body: JSON.stringify(_proofPresentation, null, 4)
        })
    } catch (error) {
        console.error("errorr:", error);
        return [];
    }
}



export function createSchemaAPI(port, body) {
    try {
        return request({
            url: "http://localhost:" + port + "/schemas",
            method: 'POST',
            body: JSON.stringify(body, null, 4)
        })
    } catch (error) {
        console.error("errorschema:", error);
        return [];
    }

}

export function acceptOfferAPI(port, credDefExId) {
    console.log("credDefExId", credDefExId)
    return request({
        url: "http://localhost:" + port + "/issue-credential/records/" + credDefExId + "/send-request",
        method: 'POST'
    })
}

export function createCredDefAPI(port, schemaId) {
    var credDefId = {
        "revocation_registry_size": 1000,
        "schema_id": schemaId,
        "support_revocation": true,
        "tag": "default",
        "version": "1.0"
    }
    return request({
        url: "http://localhost:" + port + "/credential-definitions",
        method: 'POST',
        body: JSON.stringify(credDefId)
    })
}

export function revokeCredAPI(port, cred, conn) {
    var body = {
        "comment": "string",
        "connection_id": conn,
        "cred_ex_id": cred,
        "notify": true,
        "publish": true,
        "thread_id": "string"
    }
    return request({
        url: "http://localhost:" + port + "/revocation/revoke",
        method: 'POST',
        body: JSON.stringify(body)
    })
}

export function checkRevocationAPI(port, credId) {
    return request({
        url: "http://localhost:" + port + "/credential/revoked/" + credId,
        method: 'GET',

    })
}

export function createCurl(body){
    const senderRequestBody=[];
    body.forEach((element)=>{
            element.businessObject.participantRef.forEach((e)=>{
                if(! senderRequestBody.some(obj=>obj.id==e.id)){
                    senderRequestBody.push(e)
                }
            })
    })
    sender(senderRequestBody)
    .then(response => {
        console.log('Sender: Request sent successfully', response);
    })
    .catch(error => {
        console.error('Sender: Error sending request', error);
    });
}
export function sender(body){

    const url = `http://localhost:9001/utenti`;
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        throw error.message || 'An error occurred while processing the request.';
    });
}
export function sendCurl(body){
    body.forEach((seedAgents)=>{
        excuteCurl(seedAgents.seed)
    })
    
    
}
export function excuteCurl(seedAgents){
    console.log("mando le curl al server")
    const url=`http://localhost:9001/curl`
    let tempString="00000000000000000000000000000000"
    tempString = tempString.slice(0, -1) + seedAgents;
    const seedString=`{"seed": "${tempString}"}`;
    return fetch(url,{
        method:'POST',
        headers:{
            'Content-Type': 'text/plain',
        },
        body:seedString
    }).then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        throw error.message || 'An error occurred while processing the request.';
    });
}