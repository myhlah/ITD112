// components/DengueCharts.js
import React from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

const Graphs = ({ dengueData }) => {
  // Prepare the data for the charts
  const locations = dengueData.map((data) => data.location);
  const cases = dengueData.map((data) => data.cases);
  const deaths = dengueData.map((data) => data.deaths);

  // Data for Line Chart (Cases over Locations)
  const lineChartData = {
    labels: locations,
    datasets: [
      {
        label: 'Cases',
        data: cases,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  // Data for Bar Chart (Deaths per Location)
  const barChartData = {
    labels: locations,
    datasets: [
      {
        label: 'Deaths',
        data: deaths,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Dengue Data Charts',
      },
    },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', margin: 'auto' }}>
      <h2>Dengue Data Charts</h2>

      <div style={{ width: '100%', height: '400px', marginBottom: '50px' }}>
        <h3>Cases per Location (Line Chart)</h3>
        <Line data={lineChartData} options={chartOptions} />
      </div>

      <div style={{ width: '100%', height: '400px' }}>
        <h3>Deaths per Location (Bar Chart)</h3>
        <Bar data={barChartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Graphs;
