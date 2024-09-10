import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './DengueDataList.css';
import { Bar, Line, Scatter } from 'react-chartjs-2';
import HeatMap from 'react-heatmap-grid';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);
const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
      setFilteredData(dataList);
    };

    fetchData();
  }, []);

  useEffect(() => {
    let filtered = dengueData.filter((data) => {
      if (!filterField || !filterValue) return true;
      return data[filterField].toString().toLowerCase().includes(filterValue.toLowerCase());
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [filterField, filterValue, sortConfig, dengueData]);

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!editingId) return;

    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });

      setDengueData((prevData) =>
        prevData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        )
      );

      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const paginateNext = () => {
    if (currentPage < Math.ceil(filteredData.length / rowsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginatePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  //  bar chart
  const barChartData = {
    labels: filteredData.map(data => data.location),
    datasets: [
      {
        label: 'Cases',
        data: filteredData.map(data => data.cases),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Deaths',
        data: filteredData.map(data => data.deaths),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Location', // X-axis label
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count', // Y-axis label
        },
      },
    },
  };

  // line chart
  const lineChartData = {
    labels: filteredData.map(data => data.date), // Dates on x-axis
    datasets: [
      {
        label: 'Cases',
        data: filteredData.map(data => data.cases),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
      },
      {
        label: 'Deaths',
        data: filteredData.map(data => data.deaths),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Date', // X-axis label
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count', // Y-axis label
        },
      },
    },
  };
  //  heatmap 
  const locations = Array.from(new Set(filteredData.map(data => data.location)));
  const dates = Array.from(new Set(filteredData.map(data => data.date)));

  const heatmapData = dates.map(date => 
    locations.map(location => {
      const entry = filteredData.find(d => d.date === date && d.location === location);
      return entry ? entry.cases : 0; // Or `entry.deaths` if you prefer deaths
    })
  );

  // cards
const [totalDataEntries, setTotalDataEntries] = useState(0);
const [totalCases, setTotalCases] = useState(0);
const [totalDeaths, setTotalDeaths] = useState(0);

useEffect(() => {
  const fetchData = async () => {
    const dengueCollection = collection(db, "dengueData");
    const dengueSnapshot = await getDocs(dengueCollection);
    const dataList = dengueSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    
    setDengueData(dataList);
    setFilteredData(dataList);

    // Calculate totals
    setTotalDataEntries(dataList.length);
    setTotalCases(dataList.reduce((acc, data) => acc + data.cases, 0));
    setTotalDeaths(dataList.reduce((acc, data) => acc + data.deaths, 0));
  };

  fetchData();
}, []);

// Scatter plot data
const scatterPlotData = {
  datasets: [
    {
      label: 'Cases vs Deaths',
      data: filteredData.map(data => ({
        x: data.cases,
        y: data.deaths
      })),
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
      pointRadius: 5
    }
  ]
};

// Scatter plot options
const scatterPlotOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `Cases: ${context.raw.x}, Deaths: ${context.raw.y}`;
        }
      }
    }
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Cases'
      }
    },
    y: {
      title: {
        display: true,
        text: 'Deaths'
      }
    }
  }
};
  return (
    <div className="container">
      <div className="card-container">
        <div className="card card-total-data">
          <h3>Total Data Entries</h3>
          <p>{totalDataEntries}</p>
        </div>
        <div className="card card-total-cases">
          <h3>Total Cases</h3>
          <p>{totalCases}</p>
        </div>
        <div className="card card-total-deaths">
          <h3>Total Deaths</h3>
          <p>{totalDeaths}</p>
        </div>
      </div>


      {/* Bar Chart */}
      <div className="chart-container">
      <h2 className="centered-title">Dengue Cases Bar Chart</h2>
        <Bar data={barChartData} options={barChartOptions} />
      </div>

      {/* Line Chart */}
      <div className="chart-container">
      <h2 className="centered-title">Dengue Cases Line Chart</h2>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
      {/* Heatmap 
      <div className="heatmap-container">
        <h2 className="centered-title">Dengue Cases Heatmap</h2>
        <HeatMap
          xLabels={locations}
          yLabels={dates}
          data={heatmapData}
          xLabelWidth={60}
          yLabelWidth={60}
          squares
          cellStyle={(background, value, min, max, fraction) => ({
            background: `rgba(255, 99, 132, ${fraction})`,
            fontSize: "11px",
            color: "white",
          })}
          cellRender={value => value && `${value}`}
        />
      </div>*/}
      {/* Scatter plot */}
      <div className="chart-container">
      <h2 className="centered-title">Dengue Cases Line Chart</h2>
        <Scatter data={scatterPlotData} options={scatterPlotOptions} />
      </div>

      {!editingId && (
        <>
          <h2 className="centered-title">Dengue Data List</h2>

          <div className="filter-section">
            <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
              <option value="">Filter by...</option>
              <option value="location">Location</option>
              <option value="regions">Regions</option>
              <option value="date">Date</option>
            </select>
            <input
              type="text"
              placeholder="Enter value to filter"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              disabled={!filterField}
            />
          </div>
        </>
      )}

      {editingId ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <h3>Edit Dengue Data</h3>

          <label>
            Location:
            <input
              type="text"
              value={editForm.location}
              onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
              required
            />
          </label>

          <label>
            Cases:
            <input
              type="number"
              value={editForm.cases}
              onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
              required
            />
          </label>

          <label>
            Deaths:
            <input
              type="number"
              value={editForm.deaths}
              onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
              required
            />
          </label>

          <label>
            Date:
            <input
              type="date"
              value={editForm.date}
              onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required
            />
          </label>

          <label>
            Regions:
            <input
              type="text"
              value={editForm.regions}
              onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
              required
            />
          </label>

          <button type="submit">Update</button>
          <button type="button" className="cancel-button" onClick={() => setEditingId(null)}>Cancel</button>
        </form>
      ) : (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("location")}>
                  Location {sortConfig.key === "location" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th>Cases</th>
                <th>Deaths</th>
                <th onClick={() => handleSort("date")}>
                  Date {sortConfig.key === "date" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th onClick={() => handleSort("regions")}>
                  Regions {sortConfig.key === "regions" && (sortConfig.direction === "ascending" ? "↑" : "↓")}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.map((data) => (
                <tr key={data.id}>
                  <td>{data.location}</td>
                  <td>{data.cases}</td>
                  <td>{data.deaths}</td>
                  <td>{data.date}</td>
                  <td>{data.regions}</td>
                  <td>
                    <div className="buttons">
                      <button className="edit-button" onClick={() => handleEdit(data)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDelete(data.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button onClick={paginatePrev} disabled={currentPage === 1}>Previous</button>
            <button onClick={paginateNext} disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default DengueDataList;
