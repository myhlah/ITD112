
import React from 'react';
import { Bar, Pie, Line, Scatter, Radar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, PointElement, LineElement, Filler, RadialLinearScale } from 'chart.js'; // Import RadialLinearScale
import './Graph.css'; // Import your CSS for styling

// Register Chart.js components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  RadialLinearScale // Register radialLinear scale
);

const Graph = () => {
  // Sample data from the database
  const students = [
    { Firstname: 'Jason', Lastname: 'Nemeno', Age: 10, sex: 'Male', Ethnic: 'Iliganon', academic_performance: 95, academic_description: 'Outstanding', IQ: 120, type_school: 'Public', socio_economic_status: 'On poverty line', Study_Habit: 'Excellent', NAT_Results: 92 },
    { Firstname: 'Andrew', Lastname: 'Nemeno', Age: 10, sex: 'Male', Ethnic: 'Iliganon', academic_performance: 90, academic_description: 'Satisfactory', IQ: 115, type_school: 'Public', socio_economic_status: 'On poverty line', Study_Habit: 'Excellent', NAT_Results: 96 },
    // Add more student data as needed...
  ];

  // 1. Variation of NAT results with academic performance
  const natVsAcademicPerformance = {
    labels: students.map(s => s.academic_performance),
    datasets: [
      {
        label: 'NAT Results',
        data: students.map(s => s.NAT_Results),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  // 2. Distribution of students across academic performance categories
  const academicPerformanceCategories = students.reduce((acc, s) => {
    acc[s.academic_description] = (acc[s.academic_description] || 0) + 1;
    return acc;
  }, {});

  const academicPerformanceData = {
    labels: Object.keys(academicPerformanceCategories),
    datasets: [
      {
        label: 'Students Count',
        data: Object.values(academicPerformanceCategories),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  // 3. Distribution of students by gender and academic description
  const genderDistribution = students.reduce((acc, s) => {
    const key = `${s.academic_description} - ${s.sex}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const genderData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        label: 'Students Count',
        data: Object.values(genderDistribution),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
    ],
  };

  // 4. Study habits impact on NAT results (Radar Chart)
  const studyHabitsImpact = students.reduce((acc, s) => {
    acc[s.Study_Habit] = acc[s.Study_Habit] || [];
    acc[s.Study_Habit].push(s.NAT_Results);
    return acc;
  }, {});

  const radarData = {
    labels: Object.keys(studyHabitsImpact),
    datasets: [
      {
        label: 'NAT Results by Study Habit',
        data: Object.values(studyHabitsImpact).map(arr => arr.reduce((sum, val) => sum + val, 0) / arr.length), // Average NAT Results
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // 5. Correlations between NAT results, academic performance, and IQ (Scatter Plot)
  // You may add this section later, similar to other charts if needed.

  // 6. Proportion of students attending public vs. private schools
  const schoolTypeDistribution = students.reduce((acc, s) => {
    acc[s.type_school] = (acc[s.type_school] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(schoolTypeDistribution),
    datasets: [
      {
        label: 'School Type Distribution',
        data: Object.values(schoolTypeDistribution),
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  // 7. Socio-economic status impact on NAT results
  const socioEconomicImpact = students.reduce((acc, s) => {
    acc[s.socio_economic_status] = acc[s.socio_economic_status] || [];
    acc[s.socio_economic_status].push(s.NAT_Results);
    return acc;
  }, {});

  const stackedBarData = {
    labels: Object.keys(socioEconomicImpact),
    datasets: [
      {
        label: 'Average NAT Results',
        data: Object.values(socioEconomicImpact).map(arr => arr.reduce((sum, val) => sum + val, 0) / arr.length), // Average NAT Results
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
    ],
  };

  // 8. Correlation between IQ and NAT results
  const iqVsNatResults = {
    labels: students.map(s => s.IQ),
    datasets: [
      {
        label: 'IQ vs NAT Results',
        data: students.map(s => s.NAT_Results),
        backgroundColor: 'rgba(255, 159, 64, 0.6)',
        pointBorderColor: 'rgba(255, 159, 64, 1)',
      },
    ],
  };

  return (
    <div className="charts-container">
      <div className="chart-column">
        <h2>NAT Results vs. Academic Performance</h2>
        <Scatter data={natVsAcademicPerformance} />
      </div>
      <div className="chart-column">
        <h2>Academic Performance Distribution</h2>
        <Bar data={academicPerformanceData} />
      </div>
      <div className="chart-column">
        <h2>Gender Distribution by Academic Description</h2>
        <Bar data={genderData} />
      </div>
      <div className="chart-column">
        <h2>Impact of Study Habits on NAT Results</h2>
        <Radar data={radarData} />
      </div>
      <div className="chart-column">
        <h2>School Type Distribution</h2>
        <Pie data={pieData} />
      </div>
      <div className="chart-column">
        <h2>NAT Results by Socio-Economic Status</h2>
        <Bar data={stackedBarData} />
      </div>
      <div className="chart-column">
        <h2>IQ vs NAT Results</h2>
        <Scatter data={iqVsNatResults} />
      </div>
    </div>
  );
};

export default Graph;
