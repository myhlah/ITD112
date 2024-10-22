// React imports
import React, { useState, useEffect, useMemo } from "react";

// Firebase Firestore imports
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase"; 
import { getFirestore } from "firebase/firestore";

// CSS imports
import './StudentDataList.css';
import './StudentDataList1.css';

// Chart.js imports
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, PointElement, LineElement, Filler, RadialLinearScale } from 'chart.js';
import { Bar, Radar, Scatter, Doughnut, Pie } from 'react-chartjs-2';

// Register chart components (including PointElement and RadialLinearScale for radar and scatter charts)
Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip, Title, ArcElement, PointElement, LineElement, Filler, RadialLinearScale);

// Chart rendering logic
const renderChart = (canvasRef, chartData, chartOptions) => {
    // Destroy previous chart instance if it exists to avoid canvas reuse issue
    if (canvasRef.current) {
        const existingChart = Chart.getChart(canvasRef.current); // Get the chart associated with the canvas
        if (existingChart) {
            existingChart.destroy(); // Destroy the existing chart before creating a new one
        }
    }

    // Create a new chart instance
    new Chart(canvasRef.current, {
        type: 'bar', // Specify your chart type (e.g., bar, radar, etc.)
        data: chartData,
        options: chartOptions,
    });
};

const StudentDataList = () => {
    const [studentData, setStudentData] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
      firstName: "", // Separate first name field
      lastName: "",  // Separate last name field (where respondent data will go)
      age: "",
      sex: "",
      ethnic: "",
      academicPerformance: "",
      academicDescription: "",
      iq: "",
      typeOfSchool: "",
      socioEconomicStatus: "",
      studyHabit: "",
      natResults: "",
    });

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [nameFilter, setNameFilter] = useState("");
    const [ageFilter, setAgeFilter] = useState("");
    const [age, setAge] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [natData, setNatData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [filterField, setFilterField] = useState("");
    const [filterValue, setFilterValue] = useState("");

    const filteredStudentData = studentData.filter((data) => {
      const fieldValue = data[filterField]?.toString().toLowerCase();
      return (
        (nameFilter === "" || `${data.firstName} ${data.lastName}`.toLowerCase().includes(nameFilter.toLowerCase())) &&
        (ageFilter === "" || String(data.age) === ageFilter) &&
        (filterField === "" || fieldValue?.includes(filterValue.toLowerCase()))
      );
    });
    

    const totalPages = Math.ceil(filteredStudentData.length / ITEMS_PER_PAGE); // Calculate total pages

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return filteredStudentData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [filteredStudentData, currentPage]);

    const currentRows = paginatedData;

    const handlePageChange = (direction) => {
      if (direction === "next" && currentPage < totalPages) {
        setCurrentPage(currentPage + 1);
      } else if (direction === "prev" && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const paginatePrev = () => handlePageChange("prev");
    const paginateNext = () => handlePageChange("next");

    useEffect(() => {
      const fetchData = async () => {
        const studentCollection = collection(db, "studentData");
        const studentSnapshot = await getDocs(studentCollection);
        const dataList = studentSnapshot.docs.map((doc) => {
          const data = doc.data();
          if (!data.lastName && data.respondent) {
            data.lastName = data.respondent;
          }
          return {
            id: doc.id,
            ...data,
          };
        });
        setStudentData(dataList);
      };

      fetchData();
    }, []);
    const handleDelete = async (id) => {
      const studentDocRef = doc(db, "studentData", id);
      try {
        await deleteDoc(studentDocRef);
        setStudentData(studentData.filter((data) => data.id !== id));
        alert("Data deleted successfully!");
      } catch (error) {
        console.error("Error deleting document: ", error);
      }
    };

    const handleEdit = (data) => {
      setEditingId(data.id);
      setEditForm({
        firstName: data.firstName || "", 
        lastName: data.lastName || data.respondent || "",  
        age: data.age,
        sex: data.sex,
        ethnic: data.ethnic,
        academicPerformance: data.academicPerformance,
        academicDescription: data.academicDescription,
        iq: data.iq,
        typeOfSchool: data.typeOfSchool,
        socioEconomicStatus: data.socioEconomicStatus,
        studyHabit: data.studyHabit,
        natResults: data.natResults,
      });
    };

    const handleUpdate = async (e) => {
      e.preventDefault();
      const studentDocRef = doc(db, "studentData", editingId);
      try {
        await updateDoc(studentDocRef, {
          firstName: editForm.firstName,
          lastName: editForm.lastName,
          age: Number(editForm.age),
          sex: editForm.sex,
          ethnic: editForm.ethnic,
          academicPerformance: Number(editForm.academicPerformance),
          academicDescription: editForm.academicDescription,
          iq: editForm.iq,
          typeOfSchool: editForm.typeOfSchool,
          socioEconomicStatus: editForm.socioEconomicStatus,
          studyHabit: editForm.studyHabit,
          natResults: Number(editForm.natResults),
        });
        setStudentData(studentData.map((data) =>
          data.id === editingId ? { id: editingId, ...editForm } : data
        ));
        setEditingId(null);
        alert("Data updated successfully!");
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    };

    const handleSort = (key) => {
      let direction = "ascending";
      if (sortConfig.key === key && sortConfig.direction === "ascending") {
        direction = "descending";
      }
      setSortConfig({ key, direction });
    
      const sortedData = [...studentData].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
      setStudentData(sortedData);
    };
  

  // cards
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalFemaleStudents, setTotalFemaleStudents] = useState(0);
  const [totalMaleStudents, setTotalMaleStudents] = useState(0);
  const [averageAcademicPerformance, setAverageAcademicPerformance] = useState(0);
  const [excellentCount, setExcellentCount] = useState(0);
  const [outstandingCount, setOutstandingCount] = useState(0);
  const [verySatisfactoryCount, setVerySatisfactoryCount] = useState(0);
  const [satisfactoryCount, setSatisfactoryCount] = useState(0);
  const [fairlySatisfactoryCount, setFairlySatisfactoryCount] = useState(0);
  const [didNotMeetExpectationsCount, setDidNotMeetExpectationsCount] = useState(0);
  const [abovePovertyLineCount, setAbovePovertyLineCount] = useState(0);
  const [onPovertyLineCount, setOnPovertyLineCount] = useState(0);
  const [belowPovertyLineCount, setBelowPovertyLineCount] = useState(0);
  const studyHabits = [...new Set(studentData.map(student => student.studyHabit))];
  useEffect(() => {
    if (studentData && studentData.length > 0) {
      console.log("Student Data:", studentData);  // Debugging
  
      // Calculate total students
      setTotalStudents(studentData.length);
  
      // Calculate total female and male students
      const femaleStudents = studentData.filter(student => student.sex === 'Female').length;
      const maleStudents = studentData.filter(student => student.sex === 'Male').length;
      setTotalFemaleStudents(femaleStudents);
      setTotalMaleStudents(maleStudents);
  
      // Calculate average academic performance
      const totalPerformance = studentData.reduce((acc, student) => acc + student.academicPerformance, 0);
      setAverageAcademicPerformance(totalPerformance / studentData.length);
  
      // Count academic descriptions
      setExcellentCount(studentData.filter(student => student.academicDescription === 'Excellent').length);
      setOutstandingCount(studentData.filter(student => student.academicDescription === 'Outstanding').length);
      setVerySatisfactoryCount(studentData.filter(student => student.academicDescription === 'Very Satisfactory').length);
      setSatisfactoryCount(studentData.filter(student => student.academicDescription === 'Satisfactory').length);
      setFairlySatisfactoryCount(studentData.filter(student => student.academicDescription === 'Fairly Satisfactory').length);
      setDidNotMeetExpectationsCount(studentData.filter(student => student.academicDescription === 'Did not meet expectations').length);
  
      // Count socio-economic status
      setAbovePovertyLineCount(studentData.filter(student => student.socioEconomicStatus === 'Above poverty line').length);
      setOnPovertyLineCount(studentData.filter(student => student.socioEconomicStatus === 'On poverty line').length);
      setBelowPovertyLineCount(studentData.filter(student => student.socioEconomicStatus === 'Below poverty line').length);
    }
  }, [studentData]);
  //graphs
  // scater
  const scatterData = {
    datasets: [
      {
        label: 'NAT Results vs Academic Performance',
        data: studentData.map(student => ({
          x: student.academicPerformance, // Make sure to reference the correct property
          y: student.natResults, // Make sure to reference the correct property
        })),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };  

  const option1 = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Academic Performance',
        },
      },
      y: {
        title: {
          display: true,
          text: 'NAT Results',
        },
      },
    },
  };
  
//---- grouped bar
const iqLevels = [...new Set(studentData.map(student => student.iq))];
  const typeOfSchools = [...new Set(studentData.map(student => student.typeOfSchool))];
  const socioEconomicStatusLevels = [...new Set(studentData.map(student => student.socioEconomicStatus))];

  // Prepare datasets for each category
  const datasets = [];

  // Iterate through the different categories and create datasets
  const createDataset = (label, condition) => {
    const data = iqLevels.map(iqLevel =>
      studentData.filter(student => student.iq === iqLevel && condition(student)).map(student => student.academicPerformance)
    ).flat(); // Flatten the array

    datasets.push({
      label,
      data,
      backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.6)`, // Random color for each dataset
    });
  };

  // Create datasets for each type of school
  typeOfSchools.forEach(typeOfSchool => {
    createDataset(`Type of School: ${typeOfSchool}`, student => student.typeOfSchool === typeOfSchool);
  });

  // Create datasets for socio-economic status
  socioEconomicStatusLevels.forEach(status => {
    createDataset(`Socio-Economic Status: ${status}`, student => student.socioEconomicStatus === status);
  });

  // Create datasets for study habits
  studyHabits.forEach(habit => {
    createDataset(`Study Habit: ${habit}`, student => student.studyHabit === habit);
  });

  const data = {
    labels: iqLevels, // X-axis categories
    datasets,
  };

  const option2 = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Academic Performance',
        },
      },
      x: {
        title: {
          display: true,
          text: 'IQ Levels',
        },
      },
    },
  };

// doughnut
  const categories = ['Excellent', 'Outstanding', 'Very Satisfactory', 'Satisfactory', 'Fairly Satisfactory', 'Did not meet expectations'];
  const distributionData = categories.map(category => 
    studentData.filter(student => student.academicDescription === category).length
  );

  const radialBarData = {
    labels: ['Excellent', 'Outstanding', 'Very Satisfactory', 'Satisfactory', 'Fairly Satisfactory', 'Did not meet expectations'],
    datasets: [
      {
        label: 'Distribution of Academic Performance Categories',
        data: distributionData,
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options3 = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          boxWidth: 20, // Adjust box width
          padding: 15,  // Space between legend items
        },
      },
      
    },
  };

// radar
  // Prepare datasets for various metrics
  const academicPerformanceScores = studyHabits.map(habit =>
    studentData
      .filter(student => student.studyHabit === habit)
      .reduce((sum, student) => sum + student.academicPerformance, 0) /
    (studentData.filter(student => student.studyHabit === habit).length || 1)
  );

  const natResults = studyHabits.map(habit =>
    studentData
      .filter(student => student.studyHabit === habit)
      .reduce((sum, student) => sum + student.natResults, 0) /
    (studentData.filter(student => student.studyHabit === habit).length || 1)
  );

  const radarData = {
    labels: ['Excellent', 'Poor', 'Good'],
    datasets: [
      {
        label: 'Academic Performance',
        data: academicPerformanceScores,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        borderWidth: 1,
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(255, 99, 132)'
      },
      {
        label: 'NAT Results',
        data: natResults,
        borderWidth: 1,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(54, 162, 235)'
      }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 20, // Adjust box width
          padding: 15,  // Space between legend items
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: (value, context) => {
          return value; // Display value on top of each bar
        },
      },
      title: {
        display: true,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        ticks: {
          backdropColor: 'rgba(255, 255, 255, 0.5)', // Optional: background color for tick labels
        },
      },
    },
    options: {
      elements: {
        line: {
          borderWidth: 3
        }
      }
    },

  };

//pie
const [ethnicDistribution, setEthnicDistribution] = useState({
  labels: [],
  datasets: [{
    data: [],
    backgroundColor: [],
    hoverOffset: 4,
  }],
});

useEffect(() => {
  if (studentData && studentData.length > 0) {
    // Get all unique ethnic categories
    const ethnicCategories = [...new Set(studentData.map(student => student.ethnic))];
    
    // Count the number of students in each ethnic category
    const ethnicCounts = ethnicCategories.map(category =>
      studentData.filter(student => student.ethnic === category).length
    );

    // Update state with chart data
    setEthnicDistribution({
      labels: ethnicCategories, // X-axis: ethnic categories
      datasets: [
        {
          label: 'Ethnic Categories',
          data: ethnicCounts, // Y-axis: student counts for each ethnic group
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#4BC0C0',
            '#9966FF',
            '#FF9F40',
            '#C9CBCF'
          ],
          hoverOffset: 4,
        },
      ],
    });
  }
}, [studentData]);
const optionpie = {
  plugins: {
    legend: {
      display: true, // Display the legend
      position: 'right', // You can set 'top', 'bottom', 'left', or 'right'
      labels: {
        boxWidth: 20, // Width of the color box in the legend
        padding: 15,  // Spacing between the legend items
      },
    },
  },
};
//histogram
const natResultsData = {
  labels: studentData.map((_, index) => `Bin ${index + 1}`), // Replace with actual bins or ranges
  datasets: [
      {
          label: 'NAT Results',
          data: studentData.map(item => item.natResults), // Replace with appropriate bin counts
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
  ],
};

// Prepare data for Academic Performance histogram
const academicPerformanceData = {
  labels: studentData.map((_, index) => `Bin ${index + 1}`), // Replace with actual bins or ranges
  datasets: [
      {
          label: 'Academic Performance',
          data: studentData.map(item => item.academicPerformance), // Replace with appropriate bin counts
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
  ],
};

// Prepare data for Age histogram
const ageData = {
  labels: studentData.map((_, index) => `Bin ${index + 1}`), // Replace with actual bins or ranges
  datasets: [
      {
          label: 'Age',
          data: studentData.map(item => item.age), // Replace with appropriate bin counts
          backgroundColor: 'rgba(255, 159, 64, 0.6)',
      },
  ],
};
// histogram2
// Prepare data for the histogram
const labels = ['Excellent', 'Good', 'Poor'];
const natResultsExcellent = studentData.filter(item => item.studyHabit === 'Excellent').map(item => item.natResults);
const natResultsGood = studentData.filter(item => item.studyHabit === 'Good').map(item => item.natResults);
const natResultsPoor = studentData.filter(item => item.studyHabit === 'Poor').map(item => item.natResults);

const histogramData = {
    labels: labels,
    datasets: [
        {
            label: 'NAT Results (Excellent)',
            data: natResultsExcellent,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        },
        {
            label: 'NAT Results (Good)',
            data: natResultsGood,
            backgroundColor: 'rgba(153, 102, 255, 0.6)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 1,
        },
        {
            label: 'NAT Results (Poor)',
            data: natResultsPoor,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
        },
    ],
};

const optionhist = {
    scales: {
        x: {
            stacked: true,
            title: {
              display: true,
              text: 'Study Habits',
            },
        },
        y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Nat Results',
            },
        },
    },
    plugins: {
        legend: {
            display: true,
            position: 'top',
        },
    },
};

//highest score
const topStudents = studentData
  .sort((a, b) => b.natResults - a.natResults) 
  .slice(0, 5); 

  return (
    <div className="container">
      {editingId ? (
     <div>
     <h3 className="form-title">Edit Student Data</h3>
     <div className="form-container1">
       <form onSubmit={handleUpdate}  class="form-grid">
         <div className="form-left">
               <input
                  type="text"
                  placeholder="First Name"
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  required
                />
               <input
                  type="text"
                  placeholder="Last Name"
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  required
                />
              <div class="input-container">
                 <input
                   type="number"
                   placeholder="Age"
                   value={editForm.age}
                   onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                 />
                 <select
                    value={editForm.sex}
                    onChange={(e) => setEditForm({ ...editForm, sex: e.target.value })}
                    required
                  >
                    <option value="" disabled>Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
               </div>
               <input
                 type="text"
                 placeholder="Ethnic"
                 value={editForm.ethnic}
                 onChange={(e) => setEditForm({ ...editForm, ethnic: e.target.value })}
                 required
               />
               <input
               type="number"
               placeholder="Academic Performance"
               value={editForm.academicPerformance}
               onChange={(e) => setEditForm({ ...editForm, academicPerformance: e.target.value })}
               required
             />
              <select
                type="text"
                placeholder="Academic Description"
                value={editForm.academicDescription}
                onChange={(e) => setEditForm({ ...editForm, academicDescription: e.target.value })}
                required
             >
               <option value="" disabled>Select Academic Description</option>
               <option value="Excellent">Excellent</option>
               <option value="Outstanding">Outstanding</option>
               <option value="Very Satisfactory">Very Satisfactory</option>
               <option value="Satisfactory">Satisfactory</option>
               <option value="Fairly Satisfactory">Fairly Satisfactory</option>
               <option value="Did not meet expectation">Did not meet expectation</option>
             </select>
         </div>
        
         <div className="form-right">
             
         <select
               placeholder="IQ"
               value={editForm.iq}
               onChange={(e) => setEditForm({ ...editForm, iq: e.target.value })}
               required
             >
               <option value="" disabled>Select IQ Level</option>
               <option value="High">High</option>
               <option value="Average">Average</option>
               <option value="Low">Low</option>
             </select>
             <select
               value={editForm.typeOfSchool}
               onChange={(e) => setEditForm({ ...editForm, typeOfSchool: e.target.value })}
               required
             >
               <option value="" disabled>Select Type of School</option>
               <option value="Public">Public</option>
               <option value="Private">Private</option>
             </select>
             <select
               value={editForm.socioEconomicStatus}
               onChange={(e) => setEditForm({ ...editForm, socioEconomicStatus: e.target.value })}
               required
             >
               <option value="" disabled>Select Socio-economic Status</option>
               <option value="Above poverty line">Above poverty line</option>
               <option value="On poverty line">On poverty line</option>
               <option value="Below poverty line">Below poverty line</option>
             </select>
             <select
               type="text"
               placeholder="Study Habit"
               value={editForm.studyHabit}
               onChange={(e) => setEditForm({ ...editForm, studyHabit: e.target.value })}
               required
             >
               <option value="" disabled>Select Study Habit</option>
               <option value="Excellent">Excellent</option>
               <option value="Good">Good</option>
               <option value="Poor">Poor</option>
             </select>
             <input
               type="number"
               placeholder="NAT Results"
               value={editForm.natResults}
               onChange={(e) => setEditForm({ ...editForm, natResults: e.target.value })}
               required
             />
            <button type="submit" className="update-button" >Update</button>
            <button type="button" className="cancel-button" onClick={() => setEditingId(null)}>Cancel</button>
           </div>  
           
         </form>
       </div>
     </div>  
      ) : (
        <>
        <div className="card-container">
        {/* Card 1: Total Students */}
        <div className="card card-total-students">
          <h3>Total Students</h3>
          <p>Total: {totalStudents}</p>
          <p>Female: {totalFemaleStudents}</p>
          <p>Male: {totalMaleStudents}</p>
        </div>

        {/* Card 2: Average Academic Performance */}
        <div className="card card-average-academic-performance">
          <h3>Average Academic Performance</h3>
          <p>{averageAcademicPerformance.toFixed(2)}</p>
        </div>

        {/* Card 3: Academic Description */}
        <div className="card card-academic-description">
          <h3>Academic Description</h3>
          <p>Excellent: {excellentCount}</p>
          <p>Outstanding: {outstandingCount}</p>
          <p>Very Satisfactory: {verySatisfactoryCount}</p>
          <p>Satisfactory: {satisfactoryCount}</p>
          <p>Fairly Satisfactory: {fairlySatisfactoryCount}</p>
          <p>Did Not Meet Expectations: {didNotMeetExpectationsCount}</p>
        </div>

        {/* Card 4: Socio-economic Status */}
        <div className="card card-socio-economic-status">
          <h3>Socio-economic Status</h3>
          <p>Above Poverty Line: {abovePovertyLineCount}</p>
          <p>On Poverty Line: {onPovertyLineCount}</p>
          <p>Below Poverty Line: {belowPovertyLineCount}</p>
        </div>
      </div>

          <div className="chart-column2">
            <h3 style={{ padding:'10px', textAlign:'cemter', backgroundColor:' #2c3e50', color:'white', borderRadius:'4px 4px 0px 0px', marginBottom:'-20px'}} >Top 5 with Highest Score </h3>
              <ul>
                {topStudents.map((student, index) => (
                  <li key={index}>
                    {student.firstName} {student.lastName}: {student.natResults}
                  </li>
                ))}
              </ul>
          </div>
        
        <div className="top">
          <h3 className="form-title">Student Data List</h3>
  
          <div className="filter-section">
            <select value={filterField} onChange={(e) => setFilterField(e.target.value)}>
              <option value="">Filter by...</option>
              <option value="firstName">First Name</option>
              <option value="lastName">Last Name</option>
              <option value="age">Age</option>
              <option value="sex">Sex</option>
              <option value="ethnic">Ethnic</option>
              <option value="academicPerformance">Academic Performance</option>
              <option value="academicDescription">Academic Description</option>
              <option value="iq">IQ</option>
              <option value="typeOfSchool">Type of School</option>
              <option value="socioEconomicStatus">Socio-Economic Status</option>
              <option value="studyHabit">Study Habit</option>
              <option value="natResults"> Nat Result</option>
              
            </select>
            <input
              type="text"
              placeholder="Search.."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              disabled={!filterField}
            />
          </div>
        </div>  
          <table className="data-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("firstName")}>First Name</th>
                <th onClick={() => handleSort("lastName")}>Last Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Ethnic</th>
                <th>Academic Performance</th>
                <th>Academic Description</th>
                <th>IQ</th>
                <th>Type School</th>
                <th>Socio-economic Status</th>
                <th>Study Habit</th>
                <th>Nat Result</th> {/* add sa sort sii */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((data) => (
                  <tr key={data.id}>
                    <td>{data.firstName}</td>
                    <td>{data.lastName}</td>
                    <td>{data.age}</td>
                    <td>{data.sex}</td>
                    <td>{data.ethnic}</td>
                    <td>{data.academicPerformance}</td>
                    <td>{data.academicDescription}</td>
                    <td>{data.iq}</td>
                    <td>{data.typeOfSchool}</td>
                    <td>{data.socioEconomicStatus}</td>
                    <td>{data.studyHabit}</td>
                    <td>{data.natResults}</td>
                    <td>
                      <div className="buttons">
                        <button className="edit-button" onClick={() => handleEdit(data)}>Edit</button>
                        <button className="delete-button" onClick={() => handleDelete(data.id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="13" style={{ textAlign: 'center', color:'gray', fontSize:'25px', fontWeight:'lighter', fontStyle:'oblique' }}>Empty</td>
                </tr>
              )}
            </tbody>

          </table>
  
          <div className="pagination">
            <button onClick={paginatePrev} disabled={currentPage === 1}>Previous</button>
            <button onClick={paginateNext} disabled={currentPage === totalPages}>Next</button>
          </div>

        
       <div className="charts-container">
        
          <div className="chart-column">
            <h3 style={{ padding:'10px'}} >NAT Results Distribution by Study Habit</h3>
            <Bar data={histogramData} options={optionhist} />
          </div>
          <div className="chart-column">
            <h3 style={{ padding:'10px'}} >Average NAT Results by Type of School and Socio-economic Status</h3>
            <Bar data={data} options={option2} />
          </div>
          <div className="chart-column">
            <h3 style={{ padding:'10px'}} >NAT Results vs. Academic Performance</h3>
            <Scatter data={scatterData} options={option1} />
          </div>
          <div className="chart-column">
            <h3 style={{ padding:'10px'}} >NAT Results Histogram</h3>
            <Bar data={natResultsData} options={{ responsive: true }} />
          </div>
          <div className="chart-column">
            <h3 style={{ padding:'10px'}} >Academic Performance Histogram</h3>
            <Bar data={academicPerformanceData} options={{ responsive: true }} />
          </div>
          <div className="chart-column">
            <h3 style={{ padding:'10px'}} >Age Histogram</h3>
            <Bar data={ageData} options={{ responsive: true }} />
          </div>

          <div className="chart-column1">
            <div className="chart-column2 chart-container1">
              <h3 style={{ padding: '10px' }}>Distribution of Academic Performance Categories</h3>
              <Doughnut
                data={radialBarData}
                options={options3}
                className="chart" // Use the chart class
                style={{ height: '280px', width: '80%'}} 
              />
            </div>
            <div className="chart-column2">
              <h3 style={{ padding: '10px' }}>Study Habits vs Academic Performance and NAT Results</h3>
              <Radar
                data={radarData}
                options={options}
                className="chart" // Use the chart class
                style={{ height: '100%', width: '100%', marginTop:'-6px' }} 
              />
            </div>
            <div className="chart-column2 chart-container1">
              <h3 style={{ padding: '10px' }}>Students Ethnic Distribution</h3>
              <Pie
                data={ethnicDistribution}
                options={optionpie}
                className="chart" // Use the chart class
                style={{ height: '280px', width: '75%', marginTop:'36px' }} 
              />
            </div>
          </div>

        </div>
        </>
      )}
    </div>
  );  
};

export default StudentDataList;
