import React, { useState } from 'react';
import AddDengueData from './components/AddDengueData';
import DengueDataList from './components/DengueDataList';
import CsvUploader from './components/CsvUploader'; 
import './App.css'; // Add CSS for styling
import Graph from './components/graph'; 

function App() {
  const [view, setView] = useState('list'); // To toggle between views

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Menu</h2>
        <ul>
          <li onClick={() => setView('visual')}>Visualization</li>
          <li onClick={() => setView('list')}>Dengue Data List</li>
          <li onClick={() => setView('add')}>Add Dengue Data</li>
        </ul>
      </div>

      <div className="main-content">
        <h1 className="centered-title">Dengue Data Management</h1>
        
        {view === 'add' && (
          <>
            <CsvUploader />
            <AddDengueData />
          </>
        )}

        {view === 'list' && <DengueDataList />}
        {view === 'visual' && <Graph />}
      </div>
    </div>
  );
}

export default App;
