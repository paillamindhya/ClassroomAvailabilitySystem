
import { useState } from "react";
import FacultyLogin from "./FacultyLogin";
import StudentLogin from "./StudentLogin";

const API = "https://classroom-availability-backend-rwso.onrender.com";

function App() {
  const [role, setRole] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [student, setStudent] = useState(null);
  const [faculty, setFaculty] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [subject, setSubject] = useState("Artificial Intelligence");

  const [classrooms, setClassrooms] = useState([]);
  const [error, setError] = useState("");
  const [allocations, setAllocations] = useState([]);
  const [allocationLoading, setAllocationLoading] = useState(false);
  const [allocationError, setAllocationError] = useState("");
  const [bookingMessage, setBookingMessage] = useState("");

  const findClassrooms = async () => {
    setError("");
    setClassrooms([]);
    setBookingMessage("");

    if (!date || !time || !capacity) {
      setError("Please select date, time and required capacity.");
      return;
    }

    try {
      const response = await fetch(
        `${API}/availability?date=${encodeURIComponent(date)}&time=${encodeURIComponent(time)}&capacity=${encodeURIComponent(capacity)}`
      );

      if (!response.ok) {
        throw new Error(`Availability request failed (${response.status})`);
      }

      setClassrooms(await response.json());
    } catch (err) {
      console.error("Availability error:", err);
      setError("Unable to load available classrooms. Please try again.");
    }
  };

  const bookRoom = async (room) => {
    setError("");
    setBookingMessage("");

    if (!date || !time || !subject.trim()) {
      setError("Please select date, time and subject before booking.");
      return;
    }

    const [hour, minute] = time.split(":").map(Number);
    const startMinutes = hour * 60 + minute;
    const endMinutes = startMinutes + 60;

    if (endMinutes > 24 * 60) {
      setError("Choose a start time that allows a one-hour booking before midnight.");
      return;
    }

    const formatTime = (minutes) =>
      `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}:00`;

    const bookingData = {
      facultyId: faculty?.id ?? 1,
      roomId: room.id,
      subject: subject.trim(),
      allocationDate: date,
      startTime: formatTime(startMinutes),
      endTime: formatTime(endMinutes),
    };

    try {
      const response = await fetch(`${API}/api/faculty/allocate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const details = await response.text();
        throw new Error(details || `Booking failed (${response.status})`);
      }

      setBookingMessage(`You booked Room ${room.room_name}.`);
      setClassrooms((previous) => previous.filter((r) => r.id !== room.id));
    } catch (err) {
      console.error("Booking error:", err);
      setError(`Unable to book classroom. ${err.message}`);
    }
  };

  const getFacultyAllocation = async () => {
    setAllocationLoading(true);
    setAllocationError("");

    try {
      const response = await fetch(`${API}/api/faculty/1/allocations`);

      if (!response.ok) {
        throw new Error(`Allocation request failed (${response.status})`);
      }

      const data = await response.json();
      setAllocations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Faculty allocation error:", err);
      setAllocationError("Unable to load faculty room allocations.");
    } finally {
      setAllocationLoading(false);
    }
  };

  const handleStudentLogin = (studentData) => {
    setStudent(studentData);
    setLoggedIn(true);
    getFacultyAllocation();
  };

  const handleFacultyLogin = (facultyData) => {
    setFaculty(facultyData);
    setLoggedIn(true);
  };

  const logout = () => {
    setRole("");
    setLoggedIn(false);
    setStudent(null);
    setFaculty(null);
    setDate("");
    setTime("");
    setCapacity("");
    setClassrooms([]);
    setAllocations([]);
    setError("");
    setAllocationError("");
    setBookingMessage("");
    localStorage.removeItem("student");
    localStorage.removeItem("faculty");
  };

  if (!role) {
    return (
      <div style={styles.page}>
        <div style={styles.roleBox}>
          <h1>Classroom Availability System</h1>
          <p>Select your role</p>
          <button style={styles.roleButton} onClick={() => setRole("student")}>
            Student
          </button>
          <button style={styles.roleButton} onClick={() => setRole("faculty")}>
            Faculty
          </button>
        </div>
      </div>
    );
  }

  if (role === "student" && !loggedIn) {
    return <StudentLogin onLogin={handleStudentLogin} />;
  }

  if (role === "faculty" && !loggedIn) {
    return <FacultyLogin onLogin={handleFacultyLogin} />;
  }

  if (role === "faculty" && loggedIn) {
    return (
      <div style={styles.dashboard}>
        <div style={styles.header}>
          <h1>Faculty Dashboard</h1>
          <button style={styles.logoutButton} onClick={logout}>Logout</button>
        </div>

        <p>Find available classrooms and book a room.</p>

        <div style={styles.searchBox}>
          <div style={styles.field}>
            <label>Select Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div style={styles.field}>
            <label>Select Time</label>
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>

          <div style={styles.field}>
            <label>Required Capacity</label>
            <input type="number" min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          </div>

          <div style={styles.field}>
            <label>Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} />
          </div>

          <button style={styles.searchButton} onClick={findClassrooms}>
            Find Available Classrooms
          </button>
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {bookingMessage && <p style={styles.successMessage}>✅ {bookingMessage}</p>}

        <div style={styles.classroomContainer}>
          {classrooms.map((room) => (
            <div key={room.id} style={styles.classroomCard}>
              <h2>{room.room_name}</h2>
              <p>Capacity: {room.capacity}</p>
              <button style={styles.bookButton} onClick={() => bookRoom(room)}>
                Book Room
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.dashboard}>
      <div style={styles.header}>
        <h1>Student Dashboard</h1>
        <button style={styles.logoutButton} onClick={logout}>Logout</button>
      </div>

      <p>Welcome {student?.name || student?.email || "Student"}</p>

      <div style={styles.allocationSection}>
        <h2>Faculty Room Allocations</h2>

        <button style={styles.searchButton} onClick={getFacultyAllocation}>
          Refresh Allocations
        </button>

        {allocationLoading && <p>Loading faculty allocations...</p>}
        {allocationError && <p style={styles.error}>{allocationError}</p>}

        {!allocationLoading && !allocationError && allocations.length === 0 && (
          <div style={styles.noBooking}>
            <h3>No Room Booked</h3>
            <p>No faculty room allocations were found.</p>
          </div>
        )}

        {allocations.map((allocation) => (
          <div key={allocation.id} style={styles.allocationCard}>
            <h2 style={styles.bookedTitle}>Your Faculty Booked</h2>
            <div style={styles.roomDisplay}>Room {allocation.roomId}</div>
            <p><strong>Faculty:</strong> {allocation.facultyName || "Faculty"}</p>
            <p><strong>Subject:</strong> {allocation.subject}</p>
            <p><strong>Date:</strong> {allocation.allocationDate}</p>
            <p><strong>Time:</strong> {allocation.startTime} - {allocation.endTime}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fa",
  },
  roleBox: {
    width: "min(450px, 85%)",
    padding: "40px",
    background: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  roleButton: {
    width: "100%",
    padding: "14px",
    marginBottom: "15px",
    border: "none",
    borderRadius: "6px",
    background: "#2563eb",
    color: "white",
    fontSize: "17px",
    cursor: "pointer",
  },
  dashboard: { minHeight: "100vh", background: "#f5f7fa", padding: "30px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logoutButton: {
    padding: "10px 18px",
    background: "#dc2626",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  searchBox: {
    background: "white",
    padding: "25px",
    borderRadius: "10px",
    display: "flex",
    gap: "20px",
    alignItems: "end",
    flexWrap: "wrap",
  },
  field: { display: "flex", flexDirection: "column", gap: "8px" },
  searchButton: {
    padding: "11px 18px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: { color: "red", marginTop: "20px" },
  successMessage: {
    marginTop: "20px",
    padding: "15px",
    background: "#dcfce7",
    color: "#166534",
    borderRadius: "8px",
  },
  classroomContainer: { display: "flex", gap: "20px", flexWrap: "wrap", marginTop: "30px" },
  classroomCard: {
    background: "white",
    width: "220px",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },
  bookButton: {
    padding: "10px 15px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  allocationSection: { marginTop: "30px", maxWidth: "650px" },
  allocationCard: {
    background: "white",
    padding: "25px",
    marginTop: "20px",
    borderRadius: "10px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
  },
  bookedTitle: { color: "#166534" },
  roomDisplay: {
    marginTop: "20px",
    marginBottom: "20px",
    padding: "18px",
    background: "#2563eb",
    color: "white",
    textAlign: "center",
    fontSize: "28px",
    fontWeight: "bold",
    borderRadius: "8px",
  },
  noBooking: { background: "white", padding: "25px", borderRadius: "10px", marginTop: "20px" },
};

export default App;
