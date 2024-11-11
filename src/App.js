import React, { useState } from 'react';
import AddDengueData from './components/AddDengueData';
import DengueDataList from './components/DengueDataList';
import CsvUploader from './components/CsvUploader'; 
import './App.css'; 
import MapData from './components/MapData';  
import denguephoto from './dengue.png';

function App() {
  const [view, setView] = useState('list','add');  // To toggle between views

  return (
    <div className="app-container">
      <div className="sidebar">
        <img src={denguephoto} alt="Logo" className="logo-img" />
        <h2>Dengue</h2>
        <h4>Data Management</h4>
        <ul>
          {/*<li onClick={() => setView('dash')}>Dashboard</li>*/}
          <li onClick={() => setView('list')}>Dengue Data List</li>
          <li onClick={() => setView('add')}>Add Dengue Data</li>
        </ul>
      </div>

      <div className="main-content">
        <h2 className="centered-title">Dengue Data Management</h2>
        
        {view === 'add' && (
          <>
            <CsvUploader />
            <AddDengueData />
          </>
        )}

        {view === 'list' && 
        (
          <>
            <CsvUploader />
            <DengueDataList />
          </>
         
        )}
      </div>
    </div>
  );
}

export default App;
