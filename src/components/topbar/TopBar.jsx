import "./topbar.scss";
import { Person, Mail } from "@mui/icons-material";
import React from "react";
import { Link } from "react-router-dom";

function TopBar({ menuOpen, setMenuOpen }) {
  return (
    <div className={"topbar " + (menuOpen && "active")}>
      <div className="wrapper">
        <div className="left">
          <Link to="/" className='logo'>
            <span>Choreography SSI</span>
          </Link>

          {/* <div className="itemContainer">
            <Person className='icon' />
            <span>MTV</span>
          </div>
          <div className="itemContainer">
            <Mail className='icon' />
            <span>mtv@unicam.com</span>
  </div> */}

        </div>

        <div className="right">
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <span className='line1'></span>
            <span className='line2'></span>
            <span className='line3'></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TopBar;