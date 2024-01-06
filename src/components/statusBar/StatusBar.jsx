import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import CancelIcon from '@mui/icons-material/Cancel';
import { grey } from '@mui/material/colors';

import { event } from 'jquery';
import { getAgenti } from '../bpmn/bpmn.modeler.component';
function StatusBar({ onValue }) {

  var active = localStorage.getItem("status")?.split(", ");

  var allPart = JSON.parse(localStorage.getItem("agents"));
  //console.log("name :", name) : console.log("name :", 0) )
  const [value, setValue] = React.useState('one');
  const handleChange = (event, newValue) => {
    if (newValue === "one")
      window.location.reload(false);
    onValue(newValue);
    setValue(newValue)
  };

  return (
    <Box sx={{
      width: '100%', border: 2, borderColor: 'rgb(185, 250, 185)', display: 'flex', /* backgroundColor: 'rgb(244, 46, 85)' */backgroundColor: 'rgb(185, 250, 185)',
      justifyContent: 'center'
    }}>
      <Tabs
        sx={{
          '& .MuiTabs-indicator': { backgroundColor: 'rgb(240, 249, 237)' }, '& .MuiButtonBase-root': { borderColor: 'green' },
          '& .MuiButtonBase-root.Mui-selected': { backgroundColor: 'rgb(240, 249, 237)' }, '& .MuiButtonBase-root.MuiTab-textColorPrimary': { color: 'black', fontWeight: 'bold' }
          , '& .MuiButtonBase-root.MuiTab-textColorPrimary.Mui-selected': { color: 'black', fontWeight: 'bold', }
        }}
        value={value}
        onChange={handleChange}
        aria-label="wrapped label tabs example"
        //indicatorColor='secondary'
        centered
      >
        {allPart.map((agent) => (
        
          <Tab
            //sx={{'& .MuiButtonBase-root':{backgroundColor:'black'}}}
            icon={<VerifiedIcon style={{ color: "green" }} />}
            iconPosition="bottom"
            value={allPart.findIndex(e=>e.name==agent.name) === 0 ? "one" : agent.port}
            key={agent.name}
            //onClick={}
            label={agent.name}
            wrapped
          />
         
        ))}
      </Tabs>
    </Box>
  )
}

export default StatusBar;