import React, { } from 'react';
import { getPortByAgentName } from '../bpmn/bpmn.modeler.component';
import Form from 'react-bootstrap/Form';
import "./SSIPage.css";
//import Popper from "popper.js";
import 'bootstrap/dist/js/bootstrap.bundle'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { _registryOffer, _proofRequest, _offerPropertySchema, _propertyOffer, _ownershipSchema, _mortgageSchema, _mortgageOffer, _mortgageRequest, _proofPresentation } from '../../ssi/config';
import {
  getConnections, sendOfferAPI, getCredDefIdAPI, getCredDefExchangedAPI,
  acceptOfferAPI, sendProofRequestAPI, getPresExchangeAPI, getValidCredentialAPI, sendPresentationAPI
} from '../util/APIUtils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTextArea,
  MDBTable,
  MDBTableBody
}
  from 'mdb-react-ui-kit';

let counter=0;
let counterTwo=0;
class SSIPage extends React.Component {

  constructor(props) {
    counter=0;
    counterTwo=0;
    super(props);
    this.state = {
      agentConnections: null, connId: null, credDefId: null, bodyOffer: null, credDefExId: null,
      credDefExIdText: null, credPresExId: null, credPresExIdText: null, validCred: null, validCredText: null,
      createOwnershipbool: false, createPropertybool: false, createMortgagebool: false
    }

  }
  componentDidMount = () => {
    console.log(this.state.shouldTriggerFunction)
    setTimeout(() => {
      this.getConnections();
      this.getCredentialDefinitions();
      this.getPresExchange();
      this.getCredDefExchange();
      this.callCredDef();
    }, 500)
  }

  handleConnIdChange = (e) => {
    console.log(e.target.value)
    this.setState({ connId: e.target.value })
    _registryOffer.connection_id = e.target.value;
    _proofRequest.connection_id = e.target.value;
    _mortgageRequest.connection_id = e.target.value;
    _registryOffer.cred_def_id = document.querySelector('#selectCredDef').textContent.replace(/ /g, '');
    _propertyOffer.connection_id = e.target.value;
    _propertyOffer.cred_def_id = document.querySelector('#selectCredDef').textContent.replace(/ /g, '');
    _mortgageOffer.connection_id = e.target.value;
    _mortgageOffer.cred_def_id = document.querySelector('#selectCredDef').textContent.replace(/ /g, '');
    // _proofRequest.cred_def_id = document.querySelector('#selectCredDef').textContent.replace(/ /g, '');

  }


  handleCredDefIdChange = (e) => {
    this.setState({ credDefId: e.target.value })
    _registryOffer.cred_def_id = e.target.value;
  }

  handleCredDefExIdChange = (e) => {
    this.setState({ credDefExIdText: this.state.credDefExId.filter(cred => cred.credential_exchange_id === e.target.value) })
    // this.setState({credDefExId : e.target.value})
    //document.querySelector("#selectCredEx").textContent = this.state.credDefExId.filter(cred => cred.credential_exchange_id === e.target.value)
    //  
  }
  handleCredDefExIdChangeTemp = () => {
    if(counter<15){
      // console.log("asdsadadsad")
      this.setState({ credDefExIdText: this.state.credDefExId.filter(cred => cred.credential_exchange_id === document.querySelector('#selectCredEx').textContent) })
      // this.setState({credDefExId : e.target.value})
      //document.querySelector("#selectCredEx").textContent = this.state.credDefExId.filter(cred => cred.credential_exchange_id === e.target.value)
      counter++;  
    }
  }
  handlePresExIdChange = (e) => {
    /*  this.setState({
       credPresExId: e.target.value
     }) */
    this.getValidCredential();
    console.log(this.state.validCred)
    this.setState({
      credPresExIdText: this.state.credPresExId.filter(cred =>
        cred.presentation_exchange_id === e.target.value)
    })

  }

  handleValidCred = (e) => {

    this.setState({
      validCredText: this.state.validCred.filter(cred =>
        cred.cred_info.referent === e.target.value)
    })
  }

  acceptOffer = () => {
    acceptOfferAPI(getPortByAgentName(localStorage.getItem("pageOpen")), document.querySelector("#selectCredEx").value.replace(/ /g, '')).then(res => {
      console.log("acceptOffer", res);
      window.localStorage.setItem("toColour", localStorage.getItem("toColour") + " " + localStorage.getItem("request").split("+")[1])
      window.localStorage.setItem("split", '');
      window.dispatchEvent(new Event("storage"));
      window.location.reload(false);
    }
    );
  }

  sendOffer = () => {
    const schemaAttr = localStorage.getItem("schemaAttr");
    if (!schemaAttr) {
      console.error("Schema attributes not found.");
      return;
    }

    const attributes = schemaAttr.split(";");
    const credentialPreviewAttributes = attributes.map((attribute, index) => {
      const value = document.querySelector(`#textArea_${index}`).value;
      return {
        "mime-type": "plain/text",
        "name": attribute,
        "value": value,
      };
    });

    const offerData = {
      auto_remove: false,
      auto_issue: true,
      auto_offer: true,
      support_revocation: true,
      cred_def_id: this.state.credDefId[0], // Replace with the actual cred_def_id
      connection_id: this.state.agentConnections[0].connection_id, // Use the connection_id from the state or another source
      credential_preview: {
        "@type": "did:sov:BzCbsNYhMrjHiqZDTUASHg;spec/issue-credential/1.0/credential-preview",
        attributes: credentialPreviewAttributes,
        predicates: [],
      },
      trace: true,
    };
    // console.log(document.querySelector("#textAreaExample").textContent);
    console.log(JSON.stringify(offerData, null, 2));
    sendOfferAPI(getPortByAgentName(localStorage.getItem("pageOpen")), JSON.stringify(offerData, null, 2)).then(offer => {
      console.log("offer", offer);
      window.localStorage.setItem("toColour", localStorage.getItem("toColour") + " " + localStorage.getItem("request").split("+")[1])
      window.localStorage.setItem("split", '');
      window.dispatchEvent(new Event("storage"));
      window.location.reload(false);
    }
    );

  }

  sendProofRequest = () => {
    _proofRequest.connection_id=this.state.agentConnections[0].connection_id
    sendProofRequestAPI(getPortByAgentName(localStorage.getItem("pageOpen")), JSON.stringify(_proofRequest).replace(/\s/g, '')).then(req => {
      console.log("Request Proof", req);
      window.localStorage.setItem("toColour", localStorage.getItem("toColour") + " " + localStorage.getItem("request").split("+")[1])
      window.localStorage.setItem("split", '');
      window.dispatchEvent(new Event("storage"));
      window.location.reload(false);
    });
  }

  sendPresentation = () => {
    sendPresentationAPI(getPortByAgentName(localStorage.getItem("pageOpen")), document.querySelector('#selectPresEx').value.replace(/ /g, ''), document.querySelector('#selectValidCred').value.replace(/ /g, '')).then(req => {
      console.log("Verified Credential", req);
      window.localStorage.setItem("toColour", localStorage.getItem("toColour") + " " + localStorage.getItem("request").split("+")[1])
      window.localStorage.setItem("split", '');
      window.dispatchEvent(new Event("storage"));
      window.location.reload(false);

    });
  }

  getConnections = () => {
    console.log(getPortByAgentName(localStorage.getItem("pageOpen")))
    getConnections(getPortByAgentName(localStorage.getItem("pageOpen"))).then(response =>
      this.setState({
        agentConnections: response.results.filter(connection => connection.state === 'active').filter(connection => connection.their_label.toLowerCase() == localStorage.getItem("pageReceiver"))
      })
    )

  }

  callCredDef() {
    /*  if (localStorage.getItem("request").split("+")[0] === 'offercredential') {
       if (this.state.createOwnershipbool === false) {
         createSchemaAPI(_agents.broker.agentPort, _ownershipSchema).then(res => {
           console.log("schemaa", res)
           createCredDefAPI(_agents.registry.agentPort, res.schema_id)
         }
         ).then(this.getCredentialDefinitions());
         this.setState({ createOwnershipbool: true })
       };
 
     }
     if (localStorage.getItem("request").split("+")[0] === 'propertyoffer') {
       if (this.state.createPropertybool === false) {
         createSchemaAPI(_agents.broker.agentPort, _offerPropertySchema).then(res => {
           console.log("schemaa", res)
           createCredDefAPI(_agents.broker.agentPort, res.schema_id)
         }
         ).then(this.getCredentialDefinitions());
         this.setState({ createPropertybool: true })
       };
     }
     if (localStorage.getItem("request").split("+")[0] === 'mortgagedeedsoffer') {
       if (this.state.createMortgagebool === false) {
         createSchemaAPI(_agents.sellersbank.agentPort, _mortgageSchema).then(res => {
           console.log("schemaa", res)
           createCredDefAPI(_agents.sellersbank.agentPort, res.schema_id)
 
         }
         ).then(this.getCredentialDefinitions());
         this.setState({ createMortgagebool: true })
       };
     } */

  }

  getCredentialDefinitions = () => {

    getCredDefIdAPI(getPortByAgentName(localStorage.getItem("pageOpen"))).then(response =>
      this.setState({
        credDefId: response.credential_definition_ids
      })
    )
    this.getCredDefExchange();
  }

  getCredDefExchange = () => {
    getCredDefExchangedAPI(getPortByAgentName(localStorage.getItem("pageOpen"))).then(response => {
      // console.log("response",response)

      this.setState({
        credDefExId: response.results
      })
    }
    )

  }

  getPresExchange = () => {
    getPresExchangeAPI(getPortByAgentName(localStorage.getItem("pageOpen"))).then(response => {
      console.log("response", response)

      this.setState({
        credPresExId: response.results
      })
    }
    )
  }

  getValidCredential = () => {
    console.log("getValidCredential")
    getValidCredentialAPI(getPortByAgentName(localStorage.getItem("pageOpen")), document.querySelector('#selectPresEx').value.replace(/ /g, '')).then(response => {
      console.log("validCred", getPortByAgentName(localStorage.getItem("pageOpen")))

      this.setState({
        validCred: response
      })
    }
    )

  }
  handlePresExIdChangeTemp = () => {
    /*  this.setState({
       credPresExId: e.target.value
     }) */
     if(counter<15){
      console.log("sono qui")
      this.getValidCredential();
      console.log(this.state.validCred)
      this.setState({
        credPresExIdText: this.state.credPresExId.filter(cred =>
          cred.presentation_exchange_id === document.querySelector('#selectPresEx').textContent)
      })
      counter++;
    }
  }
  handleValidCredTemp = () => {
    if(counterTwo<15){
      console.log("sono qui 2")
      this.setState({
        validCredText: this.state.validCred.filter(cred =>
          cred.cred_info.referent === document.querySelector('#selectValidCred').textContent)
      })
      counterTwo++;
    }
  }
  renderTableForAttributes = () => {
    const schemaAttr = localStorage.getItem("schemaAttr");
    if (!schemaAttr) {
      return null;
    }

    const attributes = schemaAttr.split(";");
    return (
      <div style={{ marginBottom: "20px" }}>
        {/* <MDBRow>
          <MDBCol md="6" className="bg-indigo p-3">
            <MDBTable striped bordered>
              <MDBTableBody>
                <tr>
                  <td>Value:</td>
                  <td>
                    <MDBTextArea
                      label={`Enter ${attribute}`}
                      size="lg"
                      id={`textArea_${index}`}
                      style={{ backgroundColor: 'white', marginTop: '5px', width: '100%' }}
                      rows={3}
                    />
                  </td>
                </tr>
              </MDBTableBody>
            </MDBTable>
          </MDBCol>
        </MDBRow> */}
        <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableBody>
          {attributes.map((attribute, index) => (
            <TableRow
              key={attribute}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {attribute}
              </TableCell>
              <TableCell align="right">
                <MDBTextArea
                      size="lg"
                      id={`textArea_${index}`}
                      style={{ backgroundColor: 'white'}}
                      rows={3}
                    /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </div>
    );
  };

  //({ pageOpen, setPageOpen })
  //const [page, setPage] = useState();

  /*  useEffect(() => {
       setPage(localStorage.getItem("pageOpen"));
 
     },[page]) */

  //var showMe = pageOpen;
  //showMe= false;
  //pageOpen = localStorage.getItem("pageOpen");
  //console.log("pageOpen",pageOpen);

  //setPage(localStorage.getItem("pageOpen"));
  //localStorage.setItem("toColour", localStorage.getItem("toColour") + " " + localStorage.getItem("request").split("+")[1]);
  render = () => {
    { this.state.credDefExId != null ? console.log("this.state.credDefExId", this.state.credDefExId) : console.log("nullo") }

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></link>
    switch (localStorage.getItem("typeOfMessage")) {
      case "offerMessage":
        return (
          <MDBContainer fluid className='h-custom' style={{ width: '100%', marginTop: '50px' }} >
            <MDBRow className='d-flex justify-content-center align-items-center h-100' style={{ width: '110%' }}>
              <MDBCol col='12' className='' style={{ width: '100%', height: '100%', }}>

                <MDBCard className='card-registration card-registration-2' style={{ borderRadius: '15px', width: '100%', height: '100%' }}>

                  <MDBCardBody className='p-0' style={{ width: '100%', height: '100%' }}>

                    <MDBRow style={{ width: '100%', height: '100%' }}>

                      <MDBCol md='6' className='bg-indigo p-5' style={{ width: '100%', height: '100%', }}>

                        <h3 className="fw-normal mb-5 text-body" style={{ color: '#4835d4', width: '100%' }}>
                          {localStorage.getItem("pageOpen").toUpperCase() + ": " + localStorage.getItem("request").split("+")[0]}</h3>
                        <div>
                          <FloatingLabel controlId="floatingSelect" label="Select a Connection ID" style={{}}>
                            <Form.Select aria-label='mcj' size="lg" value={this.state.connId != null ? this.state.connId : " "} onChange={this.handleConnIdChange} style={{}}>
                              
                              {this.state.agentConnections != null ?
                                (this.state.agentConnections.length >= 1 ?
                                  <option key={this.state.agentConnections[0].connection_id} value={this.state.agentConnections[0].connection_id}>
                                    {this.state.agentConnections[0].their_label + "    " + this.state.agentConnections[0].connection_id}
                                  </option> :
                                  <option value="1">One</option>) :
                                null
                              }
                            </Form.Select>
                          </FloatingLabel>
                        </div>
                        <div style={{ marginTop: "5px" }}>
                          <FloatingLabel controlId="floatingSelect" label="Select a Credential Definition ID" style={{}}>
                            <Form.Select aria-label='mcj' size="lg" id="selectCredDef" value={this.state.credDefId != null ? this.state.credDefId : " "} onSelect={this.handleCredDefIdChange} onChange={this.handleCredDefIdChange} style={{}} >
                              <option value="" hidden> </option>
                              {this.state.credDefId != null ? this.state.credDefId >= 1 ? this.state.credDefId.map((entry) =>
                                <option key={this.state.credDefId[0]} value={this.state.credDefId[0]}>
                                  {entry}</option>) : <option value={this.state.credDefId[0]}>{this.state.credDefId[0]}</option> : <option value=' '> </option>}
                            </Form.Select>
                          </FloatingLabel>
                        </div>
                        <div style={{ width: '100%' }}>
                          {/*  { Object.entries(_agents).map(item => item).forEach(entry => entry[0] === localStorage.getItem("pageOpen").trim(" ") ?    
                           <div style={{ width: '100%' }}> <MDBTextArea label='Credential to offer' size='lg' value={JSON.stringify(entry[1].offer,null,4)} id='textAreaExample' 
                            style={{ backgroundColor: 'white', marginTop: '5px', width: '100%' }} rows={18} /> {console.log("uguali",entry[0] )} </div> : 
                            <div style={{ width: '100%' }}></div>)}  */}

                          {/* <MDBTextArea label='Credential to offer' size='lg' defaultValue={
                          JSON.stringify(localStorage.getItem("request").split("+")[0] === "offercredential" ? _registryOffer
                            : localStorage.getItem("request").split("+")[0] === "propertyoffer" ? _propertyOffer : _mortgageOffer, null, 4)}
                          id='textAreaExample' style={{ backgroundColor: 'white', marginTop: '5px', width: '100%' }} rows={18} /> 
                        </div>
                        <div style={{ marginTop: "40px" }}> */}
                          {this.renderTableForAttributes()}
                          <MDBBtn color='light' size='lg' type='submit' onClick={this.sendOffer}>Register</MDBBtn>
                        </div>
                      </MDBCol>
                    </MDBRow>

                  </MDBCardBody>

                </MDBCard>

              </MDBCol>
            </MDBRow>

          </MDBContainer>);
      case "acceptMessage":
        // setTimeout(()=>{
        //   this.shouldTriggerFunction=false;
        // },5000)
        setTimeout(()=>{this.handleCredDefExIdChangeTemp()},1200)
        return (

          <MDBContainer fluid className='h-custom' style={{ width: '100%', marginTop: '50px' }} >

            <MDBRow className='d-flex justify-content-center align-items-center h-100' style={{ width: '110%' }}>
              <MDBCol col='12' className='' style={{ width: '100%', height: '100%', }}>

                <MDBCard className='card-registration card-registration-2' style={{ borderRadius: '15px', width: '100%', height: '100%' }}>

                  <MDBCardBody className='p-0' style={{ width: '100%', height: '100%' }}>

                    <MDBRow style={{ width: '100%', height: '100%' }}>

                      <MDBCol md='6' className='bg-indigo p-5' style={{ width: '100%', height: '100%', }}>

                        <h3 className="fw-normal mb-5 text-body" style={{ color: '#4835d4', width: '100%' }}>
                          {localStorage.getItem("pageOpen").toUpperCase() + ": " + localStorage.getItem("request").split("+")[0]}</h3>


                        <div style={{ marginTop: "5px" }}>
                          <FloatingLabel controlId="floatingSelect" label="Select a Credential Exchange ID" style={{}}>
                            <Form.Select aria-label='mcj' size="lg" id="selectCredEx" onSelect={this.handleCredDefExIdChange} onChange={this.handleCredDefExIdChange} style={{}} >
                              {this.state.credDefExId != null ? this.state.credDefExId.length >= 1 ? this.state.credDefExId.filter(cred => cred.state === "offer_received").map((entry) =>
                                <option key={entry.credential_exchange_id} value={entry.credential_exchange_id}>
                                  {entry.credential_exchange_id}</option>) : <option value={this.state.credDefExId.length >= 1 ? this.state.credDefExId[0].credential_exchange_id : " "}>
                                {this.state.credDefExId >= 1 ? this.state.credDefExId[0].credential_exchange_id : " "}</option> : <option value=' '>nada </option>}
                            </Form.Select>
                          </FloatingLabel>
                        </div>
                        <div style={{ width: '100%' }}>
                          <MDBTextArea readonly label='Offered Credential' size='lg' value={this.state.credDefExIdText != null ? JSON.stringify(this.state.credDefExIdText, null, 4) : ""} id='textAreaCredDefEx' style={{ backgroundColor: 'white', marginTop: '5px', width: '100%' }} rows={18} />
                        </div>
                        <div style={{ marginTop: "40px" }}>
                          <MDBBtn color='light' size='lg' onClick={this.acceptOffer}>Accept</MDBBtn>
                        </div>
                      </MDBCol>
                    </MDBRow>

                  </MDBCardBody>

                </MDBCard>

              </MDBCol>
            </MDBRow>

          </MDBContainer>
        )
      case "proofrequestMessage":
        _proofRequest.proof_request.requested_attributes.additionalProp1.name = localStorage.getItem('schemaAttr').split(';')[0];
        _mortgageRequest.proof_request.requested_attributes.additionalProp1.name = localStorage.getItem('schemaAttr').split(';')[0];
        return (
          <MDBContainer fluid className='h-custom' style={{ width: '100%', marginTop: '50px' }} >

            <MDBRow className='d-flex justify-content-center align-items-center h-100' style={{ width: '110%' }}>
              <MDBCol col='12' className='' style={{ width: '100%', height: '100%', }}>

                <MDBCard className='card-registration card-registration-2' style={{ borderRadius: '15px', width: '100%', height: '100%' }}>

                  <MDBCardBody className='p-0' style={{ width: '100%', height: '100%' }}>

                    <MDBRow style={{ width: '100%', height: '100%' }}>

                      <MDBCol md='6' className='bg-indigo p-5' style={{ width: '100%', height: '100%', }}>

                        <h3 className="fw-normal mb-5 text-body" style={{ color: '#4835d4', width: '100%' }}>
                          {localStorage.getItem("pageOpen").toUpperCase() + ": " + localStorage.getItem("request").split("+")[0]}</h3>


                        <div>
                          <FloatingLabel controlId="floatingSelect" label="Select a Connection ID" style={{}}>
                            <Form.Select aria-label='mcj' size="lg" id="selectCredEx" value={this.state.connId != null ? this.state.connId : " "} onChange={this.handleConnIdChange} style={{}} >
                            {this.state.agentConnections != null ?
                                (this.state.agentConnections.length >= 1 ?
                                  <option key={this.state.agentConnections[0].connection_id} value={this.state.agentConnections[0].connection_id}>
                                    {this.state.agentConnections[0].their_label + "    " + this.state.agentConnections[0].connection_id}
                                  </option> :
                                  <option value="1">One</option>) :
                                null
                              }
                            </Form.Select>
                          </FloatingLabel>
                        </div>
                        <div style={{ width: '100%' }}>
                          <MDBTextArea label='Request proof' size='lg' defaultValue={JSON.stringify(localStorage.getItem("pageOpen").toLowerCase() === "broker" ? _proofRequest : _mortgageRequest, null, 4)} id='textAreaCredDefEx' style={{ backgroundColor: 'white', marginTop: '5px', width: '100%' }} rows={18} />
                        </div>
                        <div style={{ marginTop: "40px" }}>
                          <MDBBtn color='light' size='lg' onClick={this.sendProofRequest}>Request</MDBBtn>
                        </div>
                      </MDBCol>
                    </MDBRow>

                  </MDBCardBody>

                </MDBCard>

              </MDBCol>
            </MDBRow>

          </MDBContainer>
        );
      case "presentProofMessage":

        setTimeout(()=>{
          this.handlePresExIdChangeTemp()
        },1200);
        setTimeout(()=>{
          this.handleValidCredTemp();
        },1200);
        return (
          <MDBContainer fluid className='h-custom' style={{ width: '100%', marginTop: '50px' }} >

            <MDBRow className='d-flex justify-content-center align-items-center h-100' style={{ width: '110%' }}>
              <MDBCol col='12' className='' style={{ width: '100%', height: '100%', }}>

                <MDBCard className='card-registration card-registration-2' style={{ borderRadius: '15px', width: '100%', height: '100%' }}>

                  <MDBCardBody className='p-0' style={{ width: '100%', height: '100%' }}>

                    <MDBRow style={{ width: '100%', height: '100%' }}>

                      <MDBCol md='6' className='bg-indigo p-5' style={{ width: '100%', height: '100%', }}>

                        <h3 className="fw-normal mb-5 text-white" style={{ color: '#4835d4', width: '100%' }}>
                          {localStorage.getItem("pageOpen").toUpperCase() + ": " + localStorage.getItem("request").split("+")[0]}</h3>


                        <div>
                          <FloatingLabel controlId="floatingSelect" label="Select a Presentation Exchange ID" style={{}}>
                            <Form.Select aria-label='mcj' id="selectPresEx" size="lg" onChange={this.handlePresExIdChange} style={{}} >
                             
                              {this.state.credPresExId !== null ? this.state.credPresExId.length >= 1 ? this.state.credPresExId.filter(cred => cred.state === "request_received").map((entry) =>
                                <option key={entry.presentation_exchange_id} value={entry.presentation_exchange_id}>
                                  {entry.presentation_exchange_id}</option>) : <option value={this.state.credPresExId.length >= 1 ? this.state.credPresExId[0].presentation_exchange_id : " "}>
                                {this.state.credPresExId.length >= 1 ? this.state.credPresExId[0].presentation_exchange_id : " "}</option> : <option value=' '>null </option>}
                            </Form.Select>
                          </FloatingLabel>
                        </div>
                        <div style={{ width: '100%' }}>
                          <MDBTextArea readonly label='Request received' size='lg' value={JSON.stringify(this.state.credPresExIdText, null, 4)} id='textAreaPresEx' style={{ backgroundColor: 'white', marginTop: '5px', width: '100%' }} rows={8} />
                        </div>
                        <div style={{ width: '100%', marginTop: "5px" }}>
                          <FloatingLabel controlId="floatingSelect" label="Select a valid Credential" style={{}}>
                            <Form.Select aria-label='mcj' id="selectValidCred" size="lg" onChange={this.handleValidCred} style={{}} >
                              {console.log("askdnaskjf ", this.state.validCred)}       
                              {this.state.validCred != null ? this.state.validCred.length >= 1 ? this.state.validCred.map((entry) =>
                                <option key={entry.cred_info.referent} value={entry.cred_info.referent}>
                                  {entry.cred_info.referent}</option>) : <option value={this.state.validCred != null ? this.state.validCred[0].cred_info.referent : " "}>
                                {this.state.validCred != null ? this.state.validCred[0].cred_info.referent : " "}</option> : <option value=' '>nada </option>}
                            </Form.Select>
                          </FloatingLabel>
                        </div>
                        <div style={{ width: '100%' }}>
                          <MDBTextArea readonly label='Credential' size='lg' value={JSON.stringify(this.state.validCredText, null, 4)} id='textAreaPresEx' style={{ backgroundColor: 'white', marginTop: '5px', width: '100%' }} rows={8} />
                        </div>

                        <div style={{ marginTop: "40px" }}>
                          <MDBBtn color='light' size='lg' onClick={this.sendPresentation}>Request</MDBBtn>
                        </div>
                      </MDBCol>
                    </MDBRow>

                  </MDBCardBody>

                </MDBCard>

              </MDBCol>
            </MDBRow>

          </MDBContainer>
        );
      default: return (
        <MDBContainer fluid className='h-custom' style={{ width: '100%', marginTop: '50px', backgroundColor: '#e4443f' }} >
          <h3 className="fw-normal mb-5 text-white" style={{ color: '#4835d4', width: '100%' }}>Click a Message to start the workflow </h3>
        </MDBContainer>
      )
    }
  }
}

export default SSIPage;