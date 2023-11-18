import "./bpmn.scss";
import BpmnModelerComponent from "./bpmn.modeler.component";
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css';
import {Link, useLocation} from "react-router-dom";

function BpmnModeler({ setPageOpen }) {

  return (
    <div className="bpmn" id="bpmnModeler" >
      <div className="containers" style={{width:'100%'}}>
        <BpmnModelerComponent setPageOpen={setPageOpen} />
      </div>
    </div>
  );
}

export default BpmnModeler;
