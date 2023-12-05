import axios from 'axios';
import React, { useEffect, useState } from 'react'

const Attcopy = () => {
  const [studetRegister, setStudetRegister] = useState([]);
  const [studentGroup, setStudentGroup] = useState(true);
  const [markAllStudentPresents, setMarkAllStudentPresents] = useState(false);
  const [filteredStudetRegister, setfilteredStudetRegister] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    axios.get("http://localhost:3000/attendance").then((response) => {
      const updatedRegister = response.data.map((student) => ({
        isPresent: false,
        ...student,
      }));

      setStudetRegister(updatedRegister);
      setfilteredStudetRegister(
        response.data.filter((student) => student.group.includes("Samsung"))
      );
    });
  }, []);


  const addDateToStudent = (dateAttended, isPresent) => {
    const updatedData = filteredStudetRegister.date.map(person => {
        // Check if the date is already present
        const existingDateIndex = person.date.findIndex(
          dateEntry => dateEntry.dateAttended === dateAttended
        );
    
        if (existingDateIndex !== -1) {
          // Update the "isPresent" value for the existing date
          person.date[existingDateIndex].isPresent = isPresent;
        } else {
          // Add the date if it doesn't exist
          person.date.push({ dateAttended, isPresent });
        }
    
        return person;
      });
    
      setfilteredStudetRegister({ date: updatedData });
  };
  
  const changeSelectedGroup = () => {
    if (studentGroup) {
      const filteredStudents = studetRegister.filter((student) =>
        student.group.includes("Samsung")
      );
      setfilteredStudetRegister(filteredStudents);
    } else {
      const filteredStudents = studetRegister.filter((student) =>
        student.group.includes("MICSITA")
      );
      setfilteredStudetRegister(filteredStudents);
    }
  };

  useEffect(() => {
    changeSelectedGroup();
  }, [studentGroup]);

  useEffect(() => {
    changeAllStudentAttendance();
  }, [markAllStudentPresents]);

  const markAllPresent = () => {
    setMarkAllStudentPresents((prevState) => !prevState);
  };

  const changeAllStudentAttendance = () => {
    let selectedStudentGroup = "";
    if (studentGroup) {
      selectedStudentGroup = "Samsung";
    } else {
      selectedStudentGroup = "MICSITA";
    }

    setStudetRegister((prevRegister) =>
      prevRegister.map((student) =>
        student.group === selectedStudentGroup
          ? { ...student, isPresent: markAllStudentPresents }
          : student
      )
    );

    setfilteredStudetRegister((prevRegister) =>
      prevRegister.map((student) =>
        student.group === selectedStudentGroup
          ? { ...student, isPresent: markAllStudentPresents }
          : student
      )
    );
  };

  const handleTogglePresence = (id) => {
    // addDateToPerson(id, "2023-12-01", true);
    setStudetRegister((prevRegister) =>
      prevRegister.map((student) =>
        student.id === id
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );

    setfilteredStudetRegister((prevRegister) =>
      prevRegister.map((student) =>
        student.id === id
          ? { ...student, isPresent: !student.isPresent }
          : student
      )
    );

    

  };

   // Function to update the "date" array for a specific person
   const addDateToPerson = (personId, dateAttended, isPresent) => {
    setfilteredStudetRegister(prevData => ({
      ...prevData,
      date: prevData.map(person => {
        if (person.id === personId) {
          // Update the "date" array for the matching person
          person.date.push({ dateAttended, isPresent });
        }
        return person;
      })
    }));

    // setStudetRegister(prevData => ({
    //   ...prevData,
    //   attendance: prevData.attendance.map(person => {
    //     if (person.id === personId) {
    //       // Update the "date" array for the matching person
    //       person.date.push({ dateAttended, isPresent });
    //     }
    //     return person;
    //   })
    // }));

  };

  // Example of adding a date for a specific person (replace with your actual data)
  // addDateToPerson(1, "2023-12-01", true);

  const handleSubmit = () => {
    console.log(filteredStudetRegister);
    // axios.post("http://localhost:3000/attendance", { data: studetRegister })
    //   .then((response) => {
    //     console.log("Attendance submitted successfully!");
    //   })
    //   .catch((error) => {
    //     console.error("Error submitting attendance:", error);
    //   });
  };

  return (
    <div>
      <h1>Attendance</h1>

      <div className="content">
        <button
          onClick={() => {
            setStudentGroup(true);
            addDateToStudent(currentDate,false);

          }}
        >
          Samsung GROUP
        </button>
        <button
          onClick={() => {
            setStudentGroup(false);
            addDateToStudent(currentDate,false);
          }}
        >
          MICSITA GROUP
        </button>
      </div>
      <div className="showStudentRegister">
        {studentGroup ? <h2>Samsung GROUP</h2> : <h2>MICSITA GROUP</h2>}
        <button
          onClick={markAllPresent}
          style={{ color: !markAllStudentPresents ? "green" : "red" }}
        >
          MARK ALL {!markAllStudentPresents ? "PRESENT" : "ABSENT"}
        </button>
      </div>

      <br /><h3>Date: {currentDate.toDateString()}</h3>
      <hr />

      <div className="studentlist">
        {filteredStudetRegister.map((student) => (
          <div
            onClick={() => handleTogglePresence(student.id)}
            key={student.id}
            style={{
              border: student.isPresent ? "1px solid green" : "1px solid red",
              cursor: "pointer",
            }}
          >
            <p>{`${student.name} ${student.surname}`}</p>
            <p>{`Group: ${student.group}`}</p>
          </div>
        ))}
      </div>
      <br />
      <div className="submit_btn">
        <button onClick={handleSubmit}>SUBMIT</button>
      </div>
    </div>
  );
};

export default Attcopy

