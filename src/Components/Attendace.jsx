import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Attendace = () => {
  const [attendance, setAttendanceData] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // const currentDate = new Date().toISOString().split("T")[0];
  //  const currentDate="2023-12-06";

  const updateAttendance = (studentId, date) => {
    setAttendanceData((prevAttendance) =>
      prevAttendance.map((student) =>
        student.id === studentId
          ? {
              ...student,
              date: student.date.map((entry) =>
                entry.date === date
                  ? { ...entry, isPresent: !entry.isPresent }
                  : entry
              ),
            }
          : student
      )
    );
  };

  const markAllPresent = () => {
    setAttendanceData((prevAttendance) =>
      prevAttendance.map((student) =>
        selectedGroup && student.group === selectedGroup
          ? {
              ...student,
              date: student.date.map((entry) => ({
                ...entry,
                isPresent: true,
              })),
            }
          : student
      )
    );
  };

  const markAllAbsent = () => {
    setAttendanceData((prevAttendance) =>
      prevAttendance.map((student) =>
        selectedGroup && student.group === selectedGroup
          ? {
              ...student,
              date: student.date.map((entry) => ({
                ...entry,
                isPresent: false,
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
    const MAX_CONCURRENT_REQUESTS = 6;

    await Promise.all(
      Array.from(
        { length: Math.ceil(attendance.length / MAX_CONCURRENT_REQUESTS) },
        async (_, index) => {
          const start = index * MAX_CONCURRENT_REQUESTS;
          const end = start + MAX_CONCURRENT_REQUESTS;
          const batch = attendance.slice(start, end);

          await Promise.all(
            batch.map(async (student) => {
              try {
                const currentDate2 = new Date().toISOString().split("T")[0];
                const response = await axios.put(
                  `http://localhost:3000/attendance/${student.id}`,
                  {
                    id: student.id,
                    name: student.name,
                    surname: student.surname,
                    group: student.group,
                    date: student.date.map((entry) =>
                      entry.date === currentDate2
                        ? { ...entry, isPresent: entry.isPresent }
                        : entry
                    ),
                  }
                );

                console.log(
                  `Data for student ${student.id} updated successfully:`,
                  response.data
                );
              } catch (studentError) {
                console.error(
                  `Error updating data for student ${student.id}:`,
                  studentError
                );
              }
            })
          );
        }
      )
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/attendance");

        // Check if the current date entry already exists
        const updatedData = response.data.map((student) => {
          const hasCurrentDateEntry = student.date.some(
            (entry) => entry.date === currentDate
          );

          return {
            ...student,
            date: hasCurrentDateEntry
              ? student.date
              : [...student.date, { date: currentDate, isPresent: false }],
          };
        });

        setAttendanceData(updatedData);
        setSelectedGroup("Samsung");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const filteredData = selectedGroup
    ? attendance.filter((student) => student.group === selectedGroup)
    : attendance;

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

      <h1>{selectedGroup}</h1>

      <button onClick={markAllPresent}>Mark All Present</button>
      <button onClick={markAllAbsent}>Mark All Absent</button>
      <ul>
        {filteredData.map((student) => (
          <div key={student.id}>
            <li key={student.id}>
              {`${student.name} ${student.surname}, Group: ${student.group}`}
              <ul>
                {student.date.map(
                  (entry, index) =>
                    entry.date === currentDate && (
                      <li
                        key={index}
                        style={{ color: entry.isPresent ? "green" : "red" }}
                      >
                        {`${entry.date}: ${
                          entry.isPresent ? "Present" : "Absent"
                        }`}
                        <button
                          onClick={() =>
                            updateAttendance(student.id, entry.date)
                          }
                        >
                          Toggle Presence
                        </button>
                      </li>
                    )
                )}
              </ul>
            </li>
            <br />
          </div>
        ))}
      </ul>
      <button onClick={submitData}>Submit Data</button>
    </div>
  );
};

export default Attendace;
