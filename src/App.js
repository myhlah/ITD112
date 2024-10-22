import React, { useState } from 'react';
import AddNatData from './component/AddNatData';
import NatDataList from './component/StudentDataList';
import CsvUploader from './component/CsvUploader'; 

import './App.css'; // Add CSS for styling

function App() {
  const [view, setView] = useState('list','add'); // To toggle between views

  return (
    <div className="app-container">
      <div className="sidebar">
      <img src={`${process.env.PUBLIC_URL}/test.png`} alt="Logo" className="logo-img" />
        <h2>NAT</h2>
        <h4>Data Management</h4>
        <ul>
          {/*<li onClick={() => setView('dash')}>Dashboard</li>*/}
          <li onClick={() => setView('list')}>NAT Data List</li>
          <li onClick={() => setView('add')}>Add NAT Data</li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="centered-title">NAT Result Data Management</h2>


        {view === 'list' && 
          <NatDataList />
        }

        {view === 'add' && (
          <>
            <CsvUploader />
            <AddNatData />
          </>
        )}

        
      </div>
    </div>
  );
}

export default App;
