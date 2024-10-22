import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './StudentDataList.css';

const AddNatData = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState(""); 
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [ethnic, setEthnic] = useState("");
  const [academicPerformance, setAcademicPerformance] = useState("");
  const [academicDescription, setAcademicDescription] = useState("");
  const [iq, setIq] = useState("");
  const [typeOfSchool, setTypeOfSchool] = useState("");
  const [socioEconomicStatus, setSocioEconomicStatus] = useState("");
  const [studyHabit, setStudyHabit] = useState("");
  const [natResults, setNatResults] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({
      firstName, // Added first name field
      lastName,  // Added last name field
      age,
      sex,
      ethnic,
      academicPerformance,
      academicDescription,
      iq,
      typeOfSchool,
      socioEconomicStatus,
      studyHabit,
      natResults,
    }); // Check if the values are correct before submitting
    try {
      await addDoc(collection(db, "studentData"), {
        firstName, // Added first name field
        lastName,  // Added last name field
        age: Number(age),
        sex,
        ethnic,
        academicPerformance: Number(academicPerformance),
        academicDescription,
        iq,
        typeOfSchool,
        socioEconomicStatus,
        studyHabit,
        natResults: Number(natResults),
      });

      // Clear the form fields after submission
      setFirstName("");
      setLastName(""); // Clear last name field
      setAge("");
      setSex("");
      setEthnic("");
      setAcademicPerformance("");
      setAcademicDescription("");
      setIq("");
      setTypeOfSchool("");
      setSocioEconomicStatus("");
      setStudyHabit("");
      setNatResults("");
      alert("Student data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <h3 className="form-title">Add New Student Data</h3>
      <div className="form-container">
        <form onSubmit={handleSubmit} class="form-grid">
          <div className="form-left">
                <input
                  type="text"
                  placeholder="Firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />  
                <input
                  type="text"
                  placeholder="Lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
                
               <div class="input-container">
                  <input
                    type="number"
                    placeholder="Age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                  />
                  <select
                    value={sex}
                    onChange={(e) => setSex(e.target.value)}
                    required
                  >
                    <option value="" disabled>Select Sex</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <input
                  type="text"
                  placeholder="Ethnicity"
                  value={ethnic}
                  onChange={(e) => setEthnic(e.target.value)}
                  required
                />
                <input
                type="text"
                placeholder="Academic Performance"
                value={academicPerformance}
                onChange={(e) => setAcademicPerformance(e.target.value)}
                required
              />
               <select
                value={academicDescription}
                onChange={(e) => setAcademicDescription(e.target.value)}
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
                value={iq}
                onChange={(e) => setIq(e.target.value)}
                required
              >
                <option value="" disabled>Select IQ Level</option>
                <option value="High">High</option>
                <option value="Average">Average</option>
                <option value="Low">Low</option>
              </select>
              <select
                value={typeOfSchool}
                onChange={(e) => setTypeOfSchool(e.target.value)}
                required
              >
                <option value="" disabled>Select Type of School</option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
              </select>
              <select
                value={socioEconomicStatus}
                onChange={(e) => setSocioEconomicStatus(e.target.value)}
                required
              >
                <option value="" disabled>Select Socio-economic Status</option>
                <option value="Above poverty line">Above poverty line</option>
                <option value="On poverty line">On poverty line</option>
                <option value="Below poverty line">Below poverty line</option>
              </select>
              <select
                value={studyHabit}
                onChange={(e) => setStudyHabit(e.target.value)}
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
                value={natResults}
                onChange={(e) => setNatResults(e.target.value)}
                required
              />
              <button type="submit">Add Data</button>
            </div>  
            
          </form>
        </div>
      </div>  
  );
};

export default AddNatData;
