import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AttendanceRegister = () => {
  const [attendance, setAttendanceData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  // const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split("T")[0]);

  const [inputDate, setInputDate] = useState(currentDate); 

  const navigate = useNavigate();

  const updateAttendance = (studentId, date) => {
    setAttendanceData((prevAttendance) =>
      prevAttendance.map((student) =>
        student.id === studentId
          ? {
              ...student,
              date: student.date.map((entry) =>
                entry.date === date
                  ? { ...entry, present: !entry.present }
                  : entry
              ),
            }
          : student
      )
    );
  };

  const markAllPresentOrAbsent = (isPresent) => {
    setAttendanceData((prevAttendance) =>
      prevAttendance.map((student) =>
        selectedGroup && student.group === selectedGroup
          ? {
              ...student,
              date: student.date.map((entry) => ({
                ...entry,
                present: isPresent,
              })),
            }
          : student
      )
    );
  };

  const filterByGroup = (group) => {
    setSelectedGroup(group);
  };

  const submitData = async () => {
    const filteredByDate = filteredData.filter((entry) =>
      entry.date.some((dateEntry) => dateEntry.date === inputDate)
    );

    const transformedData = filteredByDate.map((entry) => {
      const dateEntry = entry.date.find((date) => date.date === inputDate);

      return {
        id: entry.id,
        name: entry.name,
        surname: entry.surname,
        group: entry.group,
        present: dateEntry ? dateEntry.present : false,
        date: inputDate,
      };
    });

    try {
      const response = await axios.post("http://localhost:8080/students/capture-attendance", transformedData);
      console.log("Data submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/students");

        const updatedData = response.data.map((student) => {
          const hasCurrentDateEntry = student.date.some((entry) => entry.date === inputDate);

          return {
            ...student,
            date: hasCurrentDateEntry ? student.date : [...student.date, { date: inputDate, present: false }],
          };
        });

        setAttendanceData(updatedData);
        setSelectedGroup("Samsung");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [inputDate]);

  const filteredData = selectedGroup ? attendance.filter((student) => student.group === selectedGroup) : attendance;

  return (
    <div>
      <h1>Attendance </h1>
      <div>
        Filter by Group:{" "}
        {["Samsung", "MICSITA"].map((group) => (
          <button key={group} onClick={() => filterByGroup(group)}>
            {group}
          </button>
        ))}
      </div>
      <br/>

      <label className="dateLabel">Select Date:</label>
      <input
        type="date"
        className="dateInput"
        value={inputDate}
        onChange={(e) => setInputDate(e.target.value)}
      />

      <h1>{selectedGroup}</h1>

      <button onClick={() => markAllPresentOrAbsent(true)}>Mark All Present</button>
      <button onClick={() => markAllPresentOrAbsent(false)}>Mark All Absent</button>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
        {filteredData.map((student) => (
          <div key={student.id} className="card">
              {`${student.name} ${student.surname}, Group: ${student.group}`}
              <h4>
                {student.date.map(
                  (entry, index) =>
                    entry.date === inputDate && (
                      < span key={index} style={{ color: entry.present ? "green" : "red" }}>
                        {`${entry.date}: ${entry.present ? "Present" : "Absent"}`}
                        
                        <button
                          onClick={() => updateAttendance(student.id, entry.date)}
                          className="toggleButton"
                        >
                          Toggle Presence
                        </button>
                      </span>
                    )
                )}
              </h4>
            
          </div>
        ))}
      </div><br />
      <button onClick={submitData}>Submit Data</button>
    </div>
  );
};

export default AttendanceRegister;