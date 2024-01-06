// Require your custom property entries.
//import { isButtonElement } from "react-router-dom/dist/dom";
import spellProps from "./parts/SpellProps";
import entryFactory from "bpmn-js-properties-panel/lib/factory/EntryFactory";
var LOW_PRIORITY = 500;



// Create the custom magic tab.
// The properties are organized in groups.
function createMagicTabGroups(element, translate) {
  // Create a group called "Black Magic".
  var blackMagicGroup = {
    id: "black",
    label: "Self Sovereign Identity",
    entries: [/*
    entryFactory.selectBox(translate,{
      id:"tipoAgente",
      description:"Tipologia di agente in SSI",
      selectOptions: [
            { value: "", name: "" },
            { value: "--auto-verify-presentation", name: "--auto-verify-presentation" },
            { value: "--auto-store-credential --debug-credentials", name: "--auto-store-credential --debug-credentials" },
            { value: "--auto-verify-presentation --auto-store-credential --debug-credentials", name: "--auto-verify-presentation --auto-store-credential --debug-credentials" },
            {value:"--auto-store-credential --debug-credentials", name:"--auto-store-credential --debug-credentials"}
        // Add more options as needed
      ],
      modelProperty:"tipoAgente"
    }),*/
    entryFactory.textField(translate,{
      id:"schemaAttr",
      description:"schema description",
      modelProperty:"schemaAttr"
    }),
    entryFactory.textField(translate,{
      id:"port",
      description:"DO NOT INSERT VALUE",
      modelProperty:"port",
      hidden:function() {
        return true;
      }
    }),
    // entryFactory.checkbox(translate,{
    //   id: '--auto-verify-presentation',
    //   label: translate('--auto-verify-presentation'),
    //   modelProperty: 'autoVerifyPresentation'
    // }),
    // entryFactory.checkbox(translate,{
    //   id: '--auto-store-credential',
    //   label: translate('--auto-store-credential'),
    //   modelProperty: 'autoStoreCredential'
    // }),
    // entryFactory.checkbox(translate,{
    //   id: '--debug-credentials',
    //   label: translate('--debug-credentials'),
    //   modelProperty: 'debugCredentials'
    // })
    ]/*  {
      id:"magicButton",
      label: translate("Playground properties"),
      entries: spellProps(element)
     // isButton: true
    } */
  };

  // Add the spell props to the black magic group.
  spellProps(blackMagicGroup, element, translate);

  return [blackMagicGroup];
}

export default function MagicPropertiesProvider(propertiesPanel, translate, bpmnfactory, elementRegistry) {
  // Register our custom magic properties provider.
  // Use a lower priority to ensure it is loaded after the basic BPMN properties.
  propertiesPanel.registerProvider(LOW_PRIORITY, this);
  this.getTabs = function (element) {
  
    return function (entries) {
    
      // Add the "magic" tab
      var magicTab = {
        id: "magic",
        label: "SSI",
        groups: createMagicTabGroups(element, translate)
      };
      entries.push(magicTab);

      // Show general + "magic" tab
      return entries;
    };
  };
}
var checkedValue = document.querySelector('.blackMagicGroup'); //.entryFactory.checkbox:checked');
console.log("checkboxSelected: " +checkedValue);
MagicPropertiesProvider.$inject = ["propertiesPanel", "translate"];
