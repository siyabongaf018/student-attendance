import axios from "axios";
import React, { useEffect, useState } from "react";

const Attendace = () => {
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

  const handleSubmit = () => {
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
          }}
        >
          Samsung GROUP
        </button>
        <button
          onClick={() => {
            setStudentGroup(false);
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

export default Attendace;
