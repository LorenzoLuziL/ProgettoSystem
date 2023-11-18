import TopBar from "./components/topbar/TopBar";
import Profile from "./components/profile/Profile";

import "./App.scss";
import React, { useEffect, useState } from "react";
import Menu from "./components/menu/Menu";
import BpmnModeler from './components/bpmn/BpmnModeler';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SSIPage from "./components/SSIPage/SSIPage";

function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  const [pageOpen, setPageOpen] = useState(true);

 // localStorage.setItem("pageOpen","seller");



  // console.log('token', localStorage.getItem("accessToken"))

  /* return (
    <div className="app">
      <TopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <div className="sections">
        <Intro />
        <Profile />
        <Portfolio />
        <Works />
        <Bpmn />
      </div>
    </div>
  ); */

  //window.localStorage.setItem("split", '');

  return (
    <Router>
      {/* <div className="app">
        <TopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className="sections" style={{ display:'flex', flexDirection: 'row', }}>
          <div style={{ width: '65%', marginTop: '70px' }}>
            <Routes>
              <Route path="/" element={<BpmnModeler setPageOpen={setPageOpen}/>} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/bpmn/:d" element={<Bpmn />} />
              <Route path="/bpmnModeler" element={<BpmnModeler setPageOpen={setPageOpen}/>} />
            </Routes>
          </div>
          <div style={{ width: '34%', marginTop:'70px' }}>
            <SSIPage pageOpen={pageOpen} setPageOpen={window.localStorage.getItem("pageOpen")} key={window.localStorage.getItem("pageOpen")}/>
          </div>
        </div>
      </div> */}
      <div className="app" style={{  display:'flex', flexDirection: 'row', }}>
        <TopBar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <Menu menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className={"sections " + (window.localStorage.getItem("split"))} >
            <Routes>
              <Route path="/" element={<BpmnModeler setPageOpen={setPageOpen}/>} />
              <Route path="/profile" element={<Profile />} />
             <Route path="/bpmnModeler" element={<BpmnModeler setPageOpen={setPageOpen}/>} />
            </Routes>
        </div>
        {localStorage.getItem("split") === "active" ? <div style={{ width: '34%', marginTop:'10px' }}>
            <SSIPage pageOpen={pageOpen} setPageOpen={window.localStorage.getItem("pageOpen")} key={window.localStorage.getItem("pageOpen")}/>
          </div> : <div style={{ width: '0%', marginTop:'70px' }}></div>}
      </div>
    </Router>
  );
}

export default App;
