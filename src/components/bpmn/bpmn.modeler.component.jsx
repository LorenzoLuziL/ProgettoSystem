import React from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'chor-js/assets/styles/chor-js.css';
import { emptyBpmn } from '../../assets/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
// import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
// import propertiesProvider from '../../lib/properties-provider'

import propertiesProvider from '../../lib/properties-provider'

import "./bpmn.scss";
import $ from 'jquery';
import ChoreoModeler from 'chor-js/lib/Modeler';
import magicPropertiesProviderModule from '../../lib/property-panel/provider/magic';
import magicModdleDescriptor from '../../lib/property-panel/descriptors/magic';
// import chorpropertieProvider from '../../lib/properties-provider/index'
import { _agents, _mortgageSchema, _offerPropertySchema, _ownershipSchema } from "../../ssi/config";
import {createCurl} from "../../components/util/APIUtils";

import { createSchemaAPI, createCredDefAPI, connectAgents, receiveInvitation,getAgent } from "../util/APIUtils.js";
let arrayAgenti=[];
class BpmnModelerComponent extends React.Component {

  modeler = null;
  listaNomi = [];
  isValidating = false;
  isDirty = false;
  lastFile = null;
  uniqueNames = Array.from(new Set());
  active = Array.from(new Set());



  constructor(props) {
    super(props);
    this.state = {
      setPageOpen: props.setPageOpen, currentStatus: null, bpmn: props.xml,
      bpmnString: props.bpmnString, isLoaded: false, arrayWithDuplicates: localStorage.getItem("toColour")?.split(" ")
    }
    var isTrueSet = (localStorage.getItem("pageOpen") === 'true');
    this.state.setPageOpen(isTrueSet);

  }



  componentDidMount = () => {

    this.modeler = new ChoreoModeler({
      container: '#bpmnview',
      keyboard: {
        bindTo: window
      },
      propertiesPanel: {
        parent: '#propview'
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProvider,

        magicPropertiesProviderModule,
        // magicModdleDescriptor
      ],
      keyboard: {
        bindTo: document
      }
      ,
      moddleExtensions: {
        magic: magicModdleDescriptor
      }


    });
    const storedBpmnXml = localStorage.getItem('bpmnXml');

  if (storedBpmnXml) {
    console.log("prendo la roba dal local storage")
    // If BPMN XML is found, render the model with it
    this.renderModel(storedBpmnXml)
  }else{
    console.log(typeof(emptyBpmn))
    // Otherwise, render the model with the default empty BPMN
    this.renderModel(emptyBpmn);
  }

  }


  LoadParticipant = (participant) => {
    const agentService = require('../../ssi/AgentService');
    for (var i = 0; i < arrayAgenti.length; i++) {
      participant.forEach(part => {
        this.addParticipant(part.name.toLowerCase());
        if (part.name.toLowerCase() === arrayAgenti[i].name) {
          agentService.getStatus(arrayAgenti[i].port).then(response => {
            this.setState({
              //currentStatus: arrayAgenti[i].name + "up",
              currentStatus: response + " up"
            });
            this.addLabel(response);
          }).catch(error => {

            console.log("error", error);
          });
        }
      });
    }
  }

  addParticipant = (participant) => {
    if (!this.active.includes(participant)) {
      this.active.push(participant);
      localStorage.setItem("participant", this.active.reduce((acc, curr) => acc + ", " + curr));
    }



  }
  addLabel = (label) => {

    if (!this.uniqueNames.includes(label)) {
      this.uniqueNames.push(label);
      localStorage.setItem("status", this.uniqueNames.reduce((acc, curr) => acc + ", " + curr));
    }

  }


  ValidateReportDiagram = (modeler) => {
    document.addEventListener('DOMContentLoaded', () => {


      // download diagram as SVG
      //const downloadSvgLink = document.getElementById('js-download-svg');
      //downloadSvgLink.addEventListener('click', async e => {

    });



    // drag & drop file
    const dropZone = document.body;
    dropZone.addEventListener('dragover', e => {
      e.preventDefault();
      dropZone.classList.add('is-dragover');
    });
    dropZone.addEventListener('dragleave', e => {
      e.preventDefault();
      dropZone.classList.remove('is-dragover');
    });
    dropZone.addEventListener('drop', e => {
      e.preventDefault();
      dropZone.classList.remove('is-dragover');
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        this.lastFile = file;
        reader.addEventListener('load', () => {
          this.renderModel(reader.result);
        }, false);
        reader.readAsText(file);
      }
    });



  }



  diagramName = () => {
    if (this.lastFile) {
      console.log("name", this.lastFile.name);
      return this.lastFile.name;
    }
    return 'diagram.bpmn';
  }

  renderModel = (a) => {
    // console.log(a)
    // this.modeler.importXML(a)

    this.modeler.importXML(a, () => {
      //const elementRegistry = modeler.get('elementRegistry');
      this.startExecution();
      //const element = elementRegistry.get('New_activity_risk_audit ');

      // ...
    });
    this.isDirty = false;
  
  }

  openBpmnDiagram = (xml) => {
    this.modeler.importXML(xml, (error) => {
      if (error) {
         console.log('fail import xml');
      }else {
        console.log('BPMN XML imported successfully.');
        // Optionally, zoom or perform other actions after successful import
        // var canvas = this.modeler.get('canvas');
        // canvas.zoom('fit-viewport');
      }
    });
    
  }

  colorOverlay = (element) => {
    //await this.modeler.importXML(diagramXML);
    var overlays = this.modeler.get('overlays'),
      canvas = this.modeler.get('canvas'),
      elementRegistry = this.modeler.get('elementRegistry'),
      modeling = this.modeler.get('modeling');
    //var elementToColor = elementRegistry.get('Event_0bfb8ap');
    var elementToColor = elementRegistry.get(element);

    console.log("overlay", elementToColor)
    canvas.addMarker(element, 'highlight');


    /* modeling.setColor([elementToColor], {
      stroke: 'red',
      fill: 'rgb(152, 203, 152)'
    }); */
  }


  startExecution = () => {
    document.querySelector('[data-id="creaComandi"]').addEventListener('click',()=>getXml(this.modeler))
    document.querySelector('[data-id="saveModel"]').addEventListener('click',()=>saveModel(this.modeler))
    setAgentsPort(this.modeler)
    var canvas = this.modeler.get('canvas');
    var overlays = this.modeler.get('overlays');
    //var arrayWithDuplicates = localStorage.getItem("toColour").split(" ");
    var arrayWithDuplicates = this.state.arrayWithDuplicates;
    var uniqueArray = arrayWithDuplicates?.filter(function (elem, pos) {
      return arrayWithDuplicates.indexOf(elem) == pos;
    })
    console.log("startExecutionCOlor", uniqueArray.length);
    uniqueArray.forEach(el => {
      console.log("el", el)
      var shape = this.modeler.get('elementRegistry').get(el);
      if (shape != null) {
        console.log("attivooooo")
        //canvas.addMarker(shape, 'highlight');

        // todo qua
        // chiamata agli agenti
        var $overlayHtml =
          $('<div class="highlight-overlay">')
            .css({
              width: shape.width + 10,
              height: shape.height + 10
            });

        overlays.add(el, {
          position: {
            top: -5,
            left: -5
          },
          html: $overlayHtml
        });
      }
    });
    
  }

  getDataChild = (res) => {
    //elaborateDiagram(this.state.currentStatus);
    console.log("res", res);
    //this.state.currentStatus;
  }

  render = () => {

    return (

      <div id="bpmncontainer" style={{ width: '100%', height: '100%' }} >
        <link rel="stylesheet" type="text/html" href="styles/app.less" />

        <div id="propview" style={{ width: '25%', height: '100%', float: 'right', maxHeight: '100%', overflowX: 'auto' }}></div>
        <div id="bpmnview" style={{ width: '75%', height: '100%', float: 'left' }}></div>
        <div className="modelerBPMN">
          {/*          <Link to="/profile" className='link' style={{  textDecoration: 'none' }}>
          */}        {/*<button className="downloadButton" onClick={() => { localStorage.setItem("toColour", " ") }} >Reset Colours
          </button> 
          {/* <button className="downloadButton1" onClick={() => this.state.setPageOpen(this.isTrueSet)} >Status </button> */}
        </div>

      </div>
    )
  }
  
}
function getXml(modeler) {
  const elementRegistry = modeler.get('elementRegistry');
  // Get all elements
  const allElements = elementRegistry.getAll();

  // Filter only tasks in the choreography
  const choreographyTasks = allElements.filter(element => {
    const elementType = element.type;
    return elementType === 'bpmn:ChoreographyTask';
  });
  console.log(choreographyTasks);
  createCurl(choreographyTasks);
  console.log("eseguo funzione")
  retryFetch(10000, 50, 8041)  // todo numero porta prendere dal modello
  .then(()=>{
    callBack();
    setTimeout(()=>{readSchema(modeler)},1000);
    // createSchema();
  })
}
function readSchema(modeler){
  const elementRegistry = modeler.get('elementRegistry');
  // Get all elements
  const allElements = elementRegistry.getAll();
  const choreographyTasks = allElements.filter(element => {
    const elementType = element.type;
    return elementType === 'bpmn:ChoreographyTask';
  });
  console.log(choreographyTasks)
  choreographyTasks.forEach((task)=>{
    let temp=task.businessObject.messageFlowRef;
    temp.forEach((message)=>{
      if(message.messageRef.schemaAttr){
        const attributes = message.messageRef.schemaAttr.split(";");
      const credentialPreviewAttributes = attributes.map((attribute, index) => {
        return attribute
      });
      let nomeParticipant=message.sourceRef.name.toLowerCase();
      let schema={
        attributes: credentialPreviewAttributes,
        schema_name: getSchemaName(nomeParticipant),
        schema_version: "1.0",
      }
      createSchemaAPI(message.sourceRef.port+1,schema)
      .then(res=>{
        createCredDefAPI(message.sourceRef.port+1,res.schema.id)
        .then(cred=>{
          console.log("creadential",cred)
        })
      })
    }
    })
    
  })
}
function saveModel(model){
  
  return new Promise((resolve, reject) => {
    // Get the XML in string format
    model.saveXML({ format: true }).then(result => {
      const xml = result.xml;
      // Store BPMN XML in localStorage
      localStorage.setItem('bpmnXml', xml);
      resolve(xml);
    }).catch(err => {
      reject(err);
    });
  });
}
function setAgentsPort(model){
  console.log("setAgentsPort")
  const elementRegistry = model.get('elementRegistry');
  const allElements = elementRegistry.getAll();
  const choreographyTasks = allElements.filter(element => {
    const elementType = element.type;
    return elementType === 'bpmn:ChoreographyTask';
  });
  const senderRequestBody=[];
  choreographyTasks.forEach((element)=>{
            element.businessObject.participantRef.forEach((e)=>{
                if(! senderRequestBody.some(obj=>obj.id==e.id)){
                    senderRequestBody.push(e)
                }
            })
    })
    let port=8040;
    
    senderRequestBody.forEach((e)=>{
      e.port=port;
      port=port+10;
      let agente={
        id:e.id,
        name:e.name,
        port:e.port+1,
      }
      arrayAgenti.push(agente);
    })

    console.log(senderRequestBody)
}
function callBack() {
  try {
    var arr = Object.entries(arrayAgenti).map(item => item[1].port);

    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        // output.push(`${arr[i]} - ${arr[j]}`);
          connectAgents(arr[i])[0].then(res => {
          receiveInvitation(res, arr[j])
          console.log("invitator:" + arr[i] + "receiver:" + arr[j])
        })
      }
    }

    // console.log("output",output);
    //createSchema(_agents.registry.agentPort,_ownershipSchema);
    /* Object.entries(_agents).forEach(entry => {
      var port = entry[1].agentPort;
       connectAgents(port)[0].then(res => {
        receiveInvitation(res)

      }
      ) 
    }); */
  } catch (error) {
    console.log(error);
  }
}

function retryFetch(delay, maxRetries, port) {
  console.log("entro");
  let options={
    url:`http://https://friendly-couscous-r444p94p66qg354v4-${port}.app.github.dev`
  }
  return new Promise((resolve, reject) => {
    const fetchWithRetry = (currentRetry) => {

      getAgent()
      .then((response)=>{
        resolve(response)
      })
      .catch((error)=>{
        console.log("attempt error",currentRetry)
        if(currentRetry<maxRetries){
          setTimeout(()=>fetchWithRetry(currentRetry+1),delay)
        }else{
          reject(new Error("max retrives"))
        }
      }
      )
    };

    fetchWithRetry(0);
  });
}
export function getAgenti(){
  return arrayAgenti;
}

export function getPortByAgentName(name){
  let port="0000";
  arrayAgenti.forEach((element)=>{
    let nome=element.name.toLowerCase()
    if(nome==name){
      port=element.port;
    }
  })
  return port;
}

function getSchemaName(elementName){
  switch(elementName){
    case "registry":
      return "ownershipSchema";
    case "broker":
      return "offerPropertySchema";
    case "sellersbank":
      return "mortgageSchema"
  }
}
export default BpmnModelerComponent;
