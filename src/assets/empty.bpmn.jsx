export const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xs="http://www.w3.org/2001/XMLSchema" id="_tTv5YOycEeiHGOQ2NkJZNQ" targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn2:message id="Message_15dsyjt" />
  <bpmn2:message id="Message_1rnq4x3" name="pizza" />
  <bpmn2:message id="Message_1mi4idx" />
  <bpmn2:message id="Message_1pam53q" name="pizza order" />
  <bpmn2:choreography id="Choreography_1wp1o08" name="PropertyTransaction">
    <bpmn2:participant id="Participant_031en92" name="Seller" />
    <bpmn2:participant id="Participant_0vb4wl7" name="Registry" />

    <bpmn2:startEvent id="Event_0bfb8ap">
      <bpmn2:outgoing>Flow_0dffgha</bpmn2:outgoing>
    </bpmn2:startEvent>
    <bpmn2:endEvent id="Event_1wz8kvv">
      <bpmn2:incoming>Flow_1t183d5</bpmn2:incoming>
    </bpmn2:endEvent>
    <bpmn2:choreographyTask id="ChoreographyTask_0p0rqao" name="New Activity" initiatingParticipantRef="Participant_031en92">
      <bpmn2:incoming>Flow_0dffgha</bpmn2:incoming>
      <bpmn2:outgoing>Flow_1t183d5</bpmn2:outgoing>
      <bpmn2:participantRef>Participant_031en92</bpmn2:participantRef>
      <bpmn2:participantRef>Participant_0vb4wl7</bpmn2:participantRef>
      <bpmn2:messageFlowRef>MessageFlow_11vpws6</bpmn2:messageFlowRef>
    </bpmn2:choreographyTask>
    <bpmn2:sequenceFlow id="Flow_0dffgha" sourceRef="Event_0bfb8ap" targetRef="ChoreographyTask_0p0rqao" />
    <bpmn2:sequenceFlow id="Flow_1t183d5" sourceRef="ChoreographyTask_0p0rqao" targetRef="Event_1wz8kvv" />
  </bpmn2:choreography>
  <bpmndi:BPMNDiagram id="BPMNDiagram_141updn">
    <bpmndi:BPMNPlane id="BPMNPlane_0xkw46k" bpmnElement="Choreography_1wp1o08">
      <bpmndi:BPMNShape id="Event_0bfb8ap_di" bpmnElement="Event_0bfb8ap">
        <dc:Bounds x="262" y="292" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Event_1wz8kvv_di" bpmnElement="Event_1wz8kvv">
        <dc:Bounds x="522" y="292" width="36" height="36" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="ChoreographyTask_0p0rqao_di" bpmnElement="ChoreographyTask_0p0rqao">
        <dc:Bounds x="350" y="270" width="100" height="80" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_13mikgz" bpmnElement="Participant_031en92" isMessageVisible="false" participantBandKind="top_initiating" choreographyActivityShape="ChoreographyTask_0p0rqao_di">
        <dc:Bounds x="350" y="270" width="100" height="20" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="BPMNShape_0bkt79v" bpmnElement="Participant_0vb4wl7" isMessageVisible="false" participantBandKind="bottom_non_initiating" choreographyActivityShape="ChoreographyTask_0p0rqao_di">
        <dc:Bounds x="350" y="330" width="100" height="20" />
      </bpmndi:BPMNShape>
      <bpmndi:BPMNEdge id="Flow_0dffgha_di" bpmnElement="Flow_0dffgha">
        <di:waypoint x="298" y="310" />
        <di:waypoint x="349" y="310" />
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Flow_1t183d5_di" bpmnElement="Flow_1t183d5">
        <di:waypoint x="451" y="310" />
        <di:waypoint x="522" y="310" />
      </bpmndi:BPMNEdge>
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn2:definitions>



`;