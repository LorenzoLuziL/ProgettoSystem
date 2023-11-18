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
    entries: [
      entryFactory.textField(translate, {
      id: "spell",
      description: "Apply a black magic spell",
      label: "Spell",
      modelProperty: "spell",
    }),
    entryFactory.textField(translate, {
      id: "altroCampo",
      description: "Apply a black magic spell",
      label: "campo",
      //modelProperty è quello che vado a mettere ne xml
      modelProperty: "altroCampo",
    }),
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

MagicPropertiesProvider.$inject = ["propertiesPanel", "translate"];
