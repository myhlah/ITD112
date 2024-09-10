import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import './DengueDataList.css'; // Import the CSS file

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
  const [rowsPerPage] = useState(15);

  const [sortConfig, setSortConfig] = useState({ key: "", direction: "" });
  const [filterField, setFilterField] = useState(""); // Field to filter by
  const [filterValue, setFilterValue] = useState(""); // Value to filter by

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

  // Apply filtering and sorting
  useEffect(() => {
    let filtered = dengueData.filter((data) => {
      if (!filterField || !filterValue) return true;
      return data[filterField].toString().toLowerCase().includes(filterValue.toLowerCase());
    });

    // Apply sorting if sortConfig is set
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
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      setDengueData(dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Sort column
  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="container">
      <h2 className="centered-title">Dengue Data List</h2>

      {/* Filter */}
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

      {editingId ? (
        <form onSubmit={handleUpdate}>
          {/* Form fields */}
          {/* ... */}
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

          {/* Pagination */}
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredData.length / rowsPerPage) }, (_, i) => (
              <button key={i + 1} onClick={() => paginate(i + 1)} className={i + 1 === currentPage ? "active" : ""}>
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DengueDataList;
