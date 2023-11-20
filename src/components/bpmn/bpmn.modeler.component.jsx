import React from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-font/dist/css/bpmn-embedded.css';
import 'chor-js/assets/styles/chor-js.css';
import { emptyBpmn } from '../../assets/empty.bpmn';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';
import "./bpmn.scss";
import $ from 'jquery';
import ChoreoModeler from 'chor-js/lib/Modeler';
import magicPropertiesProviderModule from '../../lib/property-panel/provider/magic';
import magicModdleDescriptor from '../../lib/property-panel/descriptors/magic';
import { _agents, _mortgageSchema, _offerPropertySchema, _ownershipSchema } from "../../ssi/config";
import {createCurl} from "../../components/util/APIUtils";


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
      bpmnString: props.bpmnString, isLoaded: false, arrayWithDuplicates: localStorage.getItem("toColour").split(" ")
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
        //ChorPropertiesProvider,
        propertiesProviderModule,

        magicPropertiesProviderModule,
        // magicModdleDescriptor
      ],
      keyboard: {
        bindTo: document
      },
      moddleExtensions: {
        magic: magicModdleDescriptor
      }


    });
    this.renderModel(emptyBpmn);

  }


  LoadParticipant = (participant) => {
    const agentService = require('../../ssi/AgentService');
    for (var i = 0; i < _agents.length; i++) {
      participant.forEach(part => {
        this.addParticipant(part.name.toLowerCase());
        if (part.name.toLowerCase() === _agents[i].name) {
          agentService.getStatus(_agents[i].port).then(response => {
            this.setState({
              //currentStatus: _agents[i].name + "up",
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
        return console.log('fail import xml');
      }
      // var canvas = this.modeler.get('canvas');

      //canvas.zoom('fit-viewport');
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
    var canvas = this.modeler.get('canvas');
    var overlays = this.modeler.get('overlays');
    //var arrayWithDuplicates = localStorage.getItem("toColour").split(" ");
    var arrayWithDuplicates = this.state.arrayWithDuplicates;
    var uniqueArray = arrayWithDuplicates.filter(function (elem, pos) {
      return arrayWithDuplicates.indexOf(elem) == pos;
    })
    console.log("startExecutionCOlor", uniqueArray.length);
    uniqueArray.forEach(el => {
      console.log("el", el)
      var shape = this.modeler.get('elementRegistry').get(el);
      if (shape != null) {
        console.log("attivooooo")
        //canvas.addMarker(shape, 'highlight');

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
  console.log(choreographyTasks)
  // console.log(choreographyTasks);
  createCurl(choreographyTasks);

}
export default BpmnModelerComponent;
