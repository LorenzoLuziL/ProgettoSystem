import eventDefinitionReference from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/EventDefinitionReference';
import elementReferenceProperty from 'bpmn-js-properties-panel/lib/provider/bpmn/parts/implementation/ElementReferenceProperty';
import entryFactory from 'bpmn-js-properties-panel/lib/factory/EntryFactory';
import cmdHelper from 'bpmn-js-properties-panel/lib/helper/CmdHelper';

export default function MessageDefinition(group, element, bpmnFactory, messageEventDefinition,translate) {
  console.log(messageEventDefinition)
  let o={
    label: 'Item Definition',
    elementName: 'item-def',
    elementType: 'bpmn:ItemDefinition',
    referenceProperty: 'itemRef',
    newElementIdPrefix: 'ItemDef_'
  }
  // Technically, the eventDefinitionReference function is only meant for events, however, it works well for our purpose, too.
  // I currently see no reason to duplicate ~100 lines of code, however, it might break in future versions of the panel-provider
  group.entries = group.entries.concat(eventDefinitionReference(element, messageEventDefinition, bpmnFactory, o));
let b={
  id: 'Item-Def-element-name',
  label: 'Item Definition Name',
  referenceProperty: 'itemRef',
  modelProperty: 'name',
  shouldValidate: false
}
console.log(b.id)
  group.entries = group.entries.concat(elementReferenceProperty(element, messageEventDefinition, bpmnFactory, translate,b));
console.log(group)
  // group.entries = group.entries.concat(createStructureRefTextField(translate));

}

function createStructureRefTextField(translate) {
  const modelProperty = 'structureRef';
  let entry = entryFactory.textField(translate,{
    id: 'structure-ref',
    label: 'Data Structure',
    modelProperty: modelProperty,

    get: function(element, node) {
      var reference = element.businessObject.itemRef;
      var props = {};
      props[modelProperty] = reference && reference.get(modelProperty);
      return props;
    },

    set: function(element, values, node) {
      var reference = element.businessObject.itemRef;
      var props = {};
      props[modelProperty] = values[modelProperty] || undefined;
      return cmdHelper.updateBusinessObject(element, reference, props);
    },

    hidden: function(element, node) {
      return !element.businessObject.itemRef;
    }
  });
  return [ entry ];
}


