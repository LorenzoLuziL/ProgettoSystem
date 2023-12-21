import entryFactory from "bpmn-js-properties-panel/lib/factory/EntryFactory";
import { is } from "bpmn-js/lib/util/ModelUtil";

import properties from 'bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Properties';
import elementHelper from 'bpmn-js-properties-panel/lib/helper/ElementHelper';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';
import { _agents, _offerPropertySchema, _ownershipSchema, _mortgageSchema } from '../../../../../ssi/config';
import './bootstrap.css';
import { connectAgents, receiveInvitation, createSchemaAPI, createCredDefAPI,getAgent } from "../../../../../components/util/APIUtils";
import SSIPage from "../../../../../components/SSIPage/SSIPage";
import { LocalConvenienceStoreOutlined } from "@mui/icons-material";

var domify = require('min-dom').domify;

const [schema, setSchema] = ([]);

function html(name, messageName, id) {

  //const agentService = require('../../../../../ssi/AgentService');
  //const allConnections = await agentService.getConnections();

  var parsedName = name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '');
  var parsedMessageName = messageName?.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, '');
  window.localStorage.setItem("request", parsedMessageName + "+" + id);
  console.log("item", localStorage.getItem("request").split("+")[0])
  window.localStorage.setItem("pageOpen", parsedName);

  window.dispatchEvent(new Event("storage"));
  window.location.reload(false);

  /*  if(parsedMessageName === 'propertyoffer'){
     createSchema(_agents.broker.agentPort, _offerPropertySchema);
   } */

  console.log(name.toLowerCase().replace(/[^a-zA-Z0-9 ]/g, '').replace(/ /g, ''));
  var url = "http://localhost:" + _agents[parsedName].intPort;

  return domify('<div class="bpp-field-getCurrentUser(_agents[parsedName].agentPort);wrapper"' +
    '<div class="bpp-properties-entry" ' + 'data-show="show"' + '>' +
    '<label for="tortellini">' + "click to perform SSI operation" + '</label>' +
    '<a id="tortellini" href=' + url + ' target="_blank"  add" data-action="addElement"><button type="button" class="btn btn-outline-primary" data-action="addElement" ><span>Execute</span></button></a>' +
    '</div>' +
    "</div>");
  //console.log("_agents",_agents[name.toLowerCase()]);

};


function callBack(name) {
  try {
    var arr = Object.entries(_agents).map(item => item[1].agentPort);

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
    window.localStorage.setItem("toColour", name);
  } catch (error) {
    console.log(error);
  }
}

function createDef(port, schema) {
  createCredDefAPI(port, schema).then(cred => {
    window.localStorage.setItem("credDefId", cred.credential_definition_id)
    console.log("cred", cred.credential_definition_id)
  });
}

function createSchema() {
  console.log(getAgent());
  return getAgent();
  var arr = Object.entries(_agents).map(item => item[1]);
  arr.forEach(entry =>{
    if(entry.schema != undefined){
      createSchemaAPI(entry.agentPort, entry.schema).then(res => {
        createCredDefAPI(entry.agentPort, res.schema_id).then( cred => console.log("credential",cred));
      });
    }
  }
  );

}

function connectParticipants() {

  return domify('<div class="bpp-field-wrapper" style="flex-direction:column;">' +
    '<div class="bpp-properties-entry" ' + 'data-show="show"' + ' >' +
    '<label for="tortellini">' + "Click to connect all the involved participants and create their credentials" + '</label>' +
    '</div>' +
    '<button type="button"  class="btn btn-outline-primary" data-action="connectElement" ><span>Connect </span></button>' +

    "</div>");
}

export default function (group, element, translate, bpmnFactory) {
  // Only return an entry, if the currently selected
  // element is a start event.
  //var properties = require('bpmn-js-properties-panel/lib/provider/camunda/parts/implementation/Properties'),
  // = require('bpmn-js-properties-panel/lib/helper/ElementHelper'),
  //cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');


  if (is(element, "bpmn:StartEvent")) {

    window.localStorage.setItem("split", '');
    window.localStorage.setItem("request", "null");
    console.log(group.entries)
    group.entries.push(
      {
        id: "tortellini",
        html: connectParticipants(),
        modelProperty: "tortellini",
        connectElement: function () {
          // callBack(element.businessObject.id);
          return createSchema()
        }
      }
      /* entryFactory.textField(translate, {
        id: "spell",
        description: "Apply a black magic spell",
        label: "Spell",
        modelProperty: "spell",

      }) */
    );

  }

  if (is(element, "bpmn:Participant")) {
    //console.log("element", element.businessObject.name);
    //fdomify(element.businessObject.name);
    group.entries.push(
      {
        id: "tortellini",
        html: "port"+element.businessObject.port,
        modelProperty: "tortellini",

        //html: fdomify(element.businessObject.name)
      }
    );
  }

  if (is(element, "bpmn:Message")) {

     group.entries.push(
      {
        id: "messaggio",
        html: domify('<div class="bpp-field-wrapper" style="flex-direction:column;">' +
        '<div class="bpp-properties-entry" ' + 'data-show="show"' + ' >' +
        '<label for="messaggio">' + "Click to connect all the involved participants and create their credentials" + '</label>' +
        '</div>' +
        '<button type="button"  class="btn btn-outline-primary" data-action="doneMessage" ><span>Message Done </span></button>' +
    
        "</div>"),
        modelProperty: "messaggio",
        doneMessage: function () {
          return tempFunction()
        }
      }
    );
    
  }
function tempFunction(){
  let port=element.parent.businessObject.port;
  let schemaAttr=element.businessObject.schemaAttr;
  if (!schemaAttr) {
    console.error("Schema attributes not found.");
    return;
  }

  const attributes = schemaAttr.split(";");
  const credentialPreviewAttributes = attributes.map((attribute, index) => {
    return '"'+attribute+'"'
  });
  let temp={
    attributes: [credentialPreviewAttributes],
    schema_name: `ownershipSchema`,
    schema_version: "1.0",
  }
  console.log(temp)
  //  window.localStorage.setItem("split", 'active');

  //console.log("element", element.businessObject.name);
  //fdomify(element.businessObject.name);
  // window.localStorage.setItem('schemaAttr',element.businessObject.schemaAttr)
  // group.entries.push(
  //   {
  //     id: "tortellini",
  //     html: html(element.parent.businessObject.name, element.businessObject.name, element.businessObject.id),
  //     modelProperty: "tortellini",

  //     //html: fdomify(element.businessObject.name)
  //   }
  // );
  
}



}
