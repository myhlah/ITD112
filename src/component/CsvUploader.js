import React, { useState } from 'react';
import { db } from './firebase'; // Import Firebase configuration
import { collection, addDoc } from 'firebase/firestore';
import './StudentDataList.css'; // Import the CSS file
import './CsvUploader.css'; // Import CSS for styling

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      // Parse CSV rows assuming columns: Respondent, Age, Sex, Ethnic, Academic Performance, Academic Description, IQ, Type of School, Socio-Economic Status, Study Habit, NAT Results
      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 12 && index > 0) { // Skip header row
          data.push({
            firstName: columns[1].trim(),
            lastName: columns[0].trim(),
            age: Number(columns[2].trim()),
            sex: columns[3].trim(),
            ethnic: columns[4].trim(),
            academicPerformance: Number(columns[5].trim()),
            academicDescription: columns[6].trim(),
            iq: columns[7].trim(),
            typeOfSchool: columns[8].trim(),
            socioEconomicStatus: columns[9].trim(),
            studyHabit: columns[10].trim(),
            natResults: Number(columns[11].trim()),
          });
        }
      });

      try {
        const batch = data.map(async (item) => {
          await addDoc(collection(db, 'studentData'), item); // Update the Firestore collection to 'studentData'
        });

        await Promise.all(batch);
        alert('CSV data uploaded successfully!');
      } catch (error) {
        console.error('Error uploading CSV data:', error);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="csv-uploader">
      <input type="file" accept=".csv" onChange={handleFileChange} className="file-input" />
      <button className="upload-csv-button" onClick={handleFileUpload}>Upload CSV</button>
    </div>

  );
}

export default CsvUploader;