export const emptyBpmn = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" xmlns:di="http://www.omg.org/spec/DD/20100524/DI" xmlns:xs="http://www.w3.org/2001/XMLSchema" id="_tTv5YOycEeiHGOQ2NkJZNQ" targetNamespace="http://bpmn.io/schema/bpmn">
    <bpmn2:choreography id="Choreography_1wp1o08" name="PropertyTransaction">
        <bpmn2:participant id="Participant_031en92" name="Seller" />
        <bpmn2:participant id="Participant_1u1zdeg" name="Broker" />
        <bpmn2:startEvent id="Event_0bfb8ap">
            <bpmn2:outgoing>Flow_1qulg2g</bpmn2:outgoing>
        </bpmn2:startEvent>
        <bpmn2:choreographyTask id="ChoreographyTask_0axlrdi" name="Get ownership credential" initiatingParticipantRef="Participant_031en92">
            <bpmn2:incoming>Flow_1qulg2g</bpmn2:incoming>
            <bpmn2:outgoing>Flow_0j5jqry</bpmn2:outgoing>
            <bpmn2:participantRef>Participant_1u1zdeg</bpmn2:participantRef>
        </bpmn2:choreographyTask>
        <bpmn2:sequenceFlow id="Flow_1qulg2g" sourceRef="Event_0bfb8ap" targetRef="ChoreographyTask_0axlrdi" />
        <bpmn2:endEvent id="Event_1wz8kvv">
            <bpmn2:incoming>Flow_1ru34ta</bpmn2:incoming>
        </bpmn2:endEvent>
        <bpmn2:sequenceFlow id="Flow_1ru34ta" sourceRef="ChoreographyTask_0axlrdi" targetRef="Event_1wz8kvv" />
    </bpmn2:choreography>
    <bpmndi:BPMNDiagram id="BPMNDiagram_141updn">
        <bpmndi:BPMNPlane id="BPMNPlane_0xkw46k" bpmnElement="Choreography_1wp1o08">
            <bpmndi:BPMNShape id="Event_0bfb8ap_di" bpmnElement="Event_0bfb8ap">
                <dc:Bounds x="262" y="292" width="36" height="36" />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="ChoreographyTask_0axlrdi_di" bpmnElement="ChoreographyTask_0axlrdi">
                <dc:Bounds x="350" y="270" width="100" height="80" />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNShape id="BPMNShape_0wy0k62" bpmnElement="Participant_031en92" isMessageVisible="true" participantBandKind="bottom_initiating" choreographyActivityShape="ChoreographyTask_0axlrdi_di">
                <dc:Bounds x="350" y="330" width="100" height="20" />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge id="Flow_1qulg2g_di" bpmnElement="Flow_1qulg2g">
                <di:waypoint x="298" y="310" />
                <di:waypoint x="349" y="310" />
            </bpmndi:BPMNEdge>
            <bpmndi:BPMNShape id="Event_1wz8kvv_di" bpmnElement="Event_1wz8kvv">
                <dc:Bounds x="1149" y="292" width="36" height="36" />
            </bpmndi:BPMNShape>
            <bpmndi:BPMNEdge id="Flow_1ru34ta_di" bpmnElement="Flow_1ru34ta">
                <di:waypoint x="1088" y="310" />
                <di:waypoint x="1149" y="310" />
            </bpmndi:BPMNEdge>
        </bpmndi:BPMNPlane>
    </bpmndi:BPMNDiagram>
</bpmn2:definitions>



`;