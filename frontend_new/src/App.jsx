import { useState } from "react";
import FacultyLogin from "./FacultyLogin";
import StudentLogin from "./StudentLogin";

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

    // -----------------------------------------
    // FIND AVAILABLE CLASSROOMS
    // -----------------------------------------

    const findClassrooms = async () => {

        setError("");
        setClassrooms([]);
        setBookingMessage("");

        if (!date || !time || !capacity) {
            setError(
                "Please select date, time and required capacity."
            );
            return;
        }

        try {

            const response = await fetch(
                `http://https://classroom-availability-backend-rwso.onrender.com/availability?date=${date}&time=${time}&capacity=${capacity}`
            );

            if (!response.ok) {
                throw new Error("Backend returned an error");
            }

            const data = await response.json();

            setClassrooms(data);

        } catch (error) {

            console.error("Availability error:", error);

            setError(
                "Unable to connect to Java backend."
            );
        }
    };


    // -----------------------------------------
    // BOOK ROOM
    // -----------------------------------------

    const bookRoom = async (room) => {

        setError("");
        setBookingMessage("");

        if (!date || !time) {
            setError(
                "Please select date and time before booking."
            );
            return;
        }

        try {

            const startTime = time + ":00";

            // Booking for 1 hour
            const [hour, minute] = time.split(":");

            const start = new Date();
            start.setHours(
                Number(hour),
                Number(minute),
                0,
                0
            );

            start.setHours(
                start.getHours() + 1
            );

            const endHour = String(
                start.getHours()
            ).padStart(2, "0");

            const endMinute = String(
                start.getMinutes()
            ).padStart(2, "0");

            const endTime =
                `${endHour}:${endMinute}:00`;

            const bookingData = {

                // Current Faculty One
                facultyId: 1,

                // Selected classroom
                roomId: room.id,

                subject: subject,

                allocationDate: date,

                startTime: startTime,

                endTime: endTime
            };

            const response = await fetch(
                "http://https://classroom-availability-backend-rwso.onrender.com/api/faculty/allocate",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(bookingData)
                }
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to book classroom"
                );
            }

            const data = await response.json();

            console.log(
                "Booking successful:",
                data
            );

            setBookingMessage(
                `You booked Room ${room.room_name}`
            );

            // Remove booked room from available rooms
            setClassrooms((previousRooms) =>
                previousRooms.filter(
                    (r) => r.id !== room.id
                )
            );

        } catch (error) {

            console.error(
                "Booking error:",
                error
            );

            setError(
                "Unable to book classroom."
            );
        }
    };


    // -----------------------------------------
    // GET FACULTY ALLOCATION
    // -----------------------------------------

    const getFacultyAllocation = async () => {

        setAllocationLoading(true);
        setAllocationError("");

        try {

            const response = await fetch(
                "http://https://classroom-availability-backend-rwso.onrender.com/api/faculty/1/allocations"
            );

            if (!response.ok) {
                throw new Error(
                    "Unable to get faculty allocation"
                );
            }

            const data = await response.json();

            setAllocations(data);

        } catch (error) {

            console.error(
                "Faculty allocation error:",
                error
            );

            setAllocationError(
                "Unable to load faculty room allocation."
            );

        } finally {

            setAllocationLoading(false);
        }
    };


    // -----------------------------------------
    // STUDENT LOGIN
    // -----------------------------------------

    const handleStudentLogin = (studentData) => {

        setStudent(studentData);

        setLoggedIn(true);

        getFacultyAllocation();
    };


    // -----------------------------------------
    // FACULTY LOGIN
    // -----------------------------------------

    const handleFacultyLogin = (facultyData) => {

        setFaculty(facultyData);

        setLoggedIn(true);
    };


    // -----------------------------------------
    // LOGOUT
    // -----------------------------------------

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
    };


    // -----------------------------------------
    // ROLE SELECTION
    // -----------------------------------------

    if (!role) {

        return (
            <div style={styles.page}>

                <div style={styles.roleBox}>

                    <h1 style={styles.title}>
                        Classroom Availability System
                    </h1>

                    <p style={styles.subtitle}>
                        Select your role
                    </p>

                    <button
                        style={styles.roleButton}
                        onClick={() =>
                            setRole("student")
                        }
                    >
                        Student
                    </button>

                    <button
                        style={styles.roleButton}
                        onClick={() =>
                            setRole("faculty")
                        }
                    >
                        Faculty
                    </button>

                </div>

            </div>
        );
    }


    // -----------------------------------------
    // STUDENT LOGIN
    // -----------------------------------------

    if (role === "student" && !loggedIn) {

        return (
            <StudentLogin
                onLogin={handleStudentLogin}
            />
        );
    }


    // -----------------------------------------
    // FACULTY LOGIN
    // -----------------------------------------

    if (role === "faculty" && !loggedIn) {

        return (
            <FacultyLogin
                onLogin={handleFacultyLogin}
            />
        );
    }


    // -----------------------------------------
    // FACULTY DASHBOARD
    // -----------------------------------------

    if (role === "faculty" && loggedIn) {

        return (
            <div style={styles.dashboard}>

                <div style={styles.header}>

                    <h1>
                        Faculty Dashboard
                    </h1>

                    <button
                        onClick={logout}
                        style={styles.logoutButton}
                    >
                        Logout
                    </button>

                </div>


                <p style={styles.description}>
                    Find available classrooms and book one room.
                </p>


                <div style={styles.searchBox}>

                    <div style={styles.field}>

                        <label>
                            Select Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                        />

                    </div>


                    <div style={styles.field}>

                        <label>
                            Select Time
                        </label>

                        <input
                            type="time"
                            value={time}
                            onChange={(e) =>
                                setTime(e.target.value)
                            }
                        />

                    </div>


                    <div style={styles.field}>

                        <label>
                            Required Capacity
                        </label>

                        <input
                            type="number"
                            placeholder="Enter capacity"
                            value={capacity}
                            onChange={(e) =>
                                setCapacity(e.target.value)
                            }
                        />

                    </div>


                    <div style={styles.field}>

                        <label>
                            Subject
                        </label>

                        <input
                            type="text"
                            value={subject}
                            onChange={(e) =>
                                setSubject(e.target.value)
                            }
                        />

                    </div>


                    <button
                        onClick={findClassrooms}
                        style={styles.searchButton}
                    >
                        Find Available Classrooms
                    </button>

                </div>


                {error && (

                    <p style={styles.error}>
                        {error}
                    </p>

                )}


                {bookingMessage && (

                    <div style={styles.successMessage}>
                        ✅ {bookingMessage}
                    </div>

                )}


                <div style={styles.classroomContainer}>

                    {classrooms.map((room) => (

                        <div
                            key={room.id}
                            style={styles.classroomCard}
                        >

                            <h2>
                                {room.room_name}
                            </h2>

                            <p>
                                Capacity: {room.capacity}
                            </p>

                            <button
                                onClick={() =>
                                    bookRoom(room)
                                }
                                style={styles.bookButton}
                            >
                                Book Room
                            </button>

                        </div>

                    ))}

                </div>

            </div>
        );
    }


    // -----------------------------------------
    // STUDENT DASHBOARD
    // -----------------------------------------

    return (

        <div style={styles.dashboard}>

            <div style={styles.header}>

                <h1>
                    Student Dashboard
                </h1>

                <button
                    onClick={logout}
                    style={styles.logoutButton}
                >
                    Logout
                </button>

            </div>


            <p style={styles.description}>

                Welcome{" "}
                {student?.name || "Student"}

            </p>


            <div style={styles.allocationSection}>

                <h2>
                    Faculty Room Allocation
                </h2>


                {allocationLoading && (

                    <p>
                        Loading faculty allocation...
                    </p>

                )}


                {allocationError && (

                    <p style={styles.error}>
                        {allocationError}
                    </p>

                )}


                {!allocationLoading &&
                    !allocationError &&
                    allocations.length === 0 && (

                        <div style={styles.noBooking}>

                            <h3>
                                No Room Booked
                            </h3>

                            <p>
                                Your faculty has not booked
                                a classroom yet.
                            </p>

                        </div>
                    )}


                {allocations.map((allocation) => (

                    <div
                        key={allocation.id}
                        style={styles.allocationCard}
                    >

                        <h2 style={styles.bookedTitle}>
                            🧑‍🏫 Your Faculty Booked
                        </h2>


                        <div style={styles.roomDisplay}>

                            Room {allocation.roomId}

                        </div>


                        <p>
                            <strong>
                                Faculty:
                            </strong>{" "}
                            Faculty One
                        </p>


                        <p>
                            <strong>
                                Subject:
                            </strong>{" "}
                            {allocation.subject}
                        </p>


                        <p>
                            <strong>
                                Date:
                            </strong>{" "}
                            {allocation.allocationDate}
                        </p>


                        <p>
                            <strong>
                                Time:
                            </strong>{" "}
                            {allocation.startTime}
                            {" - "}
                            {allocation.endTime}
                        </p>


                        <p style={styles.messageText}>
                            Your faculty has booked
                            <strong>
                                {" "}Room {allocation.roomId}
                            </strong>
                            {" "}for this class.
                        </p>

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
        background: "#f5f7fa"
    },

    roleBox: {
        width: "450px",
        padding: "40px",
        background: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        textAlign: "center"
    },

    title: {
        marginBottom: "10px"
    },

    subtitle: {
        color: "#666",
        marginBottom: "30px"
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
        cursor: "pointer"
    },

    dashboard: {
        minHeight: "100vh",
        background: "#f5f7fa",
        padding: "30px"
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px"
    },

    description: {
        color: "#555",
        marginBottom: "25px"
    },

    logoutButton: {
        padding: "10px 18px",
        background: "#dc2626",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },

    searchBox: {
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
        display: "flex",
        gap: "20px",
        alignItems: "end",
        flexWrap: "wrap"
    },

    field: {
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },

    searchButton: {
        padding: "11px 18px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },

    error: {
        color: "red",
        marginTop: "20px"
    },

    successMessage: {
        marginTop: "20px",
        padding: "15px",
        background: "#dcfce7",
        color: "#166534",
        borderRadius: "8px",
        fontWeight: "bold"
    },

    classroomContainer: {
        display: "flex",
        gap: "20px",
        flexWrap: "wrap",
        marginTop: "30px"
    },

    classroomCard: {
        background: "white",
        width: "220px",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
    },

    bookButton: {
        padding: "10px 15px",
        background: "#16a34a",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer"
    },

    allocationSection: {
        marginTop: "30px",
        maxWidth: "650px"
    },

    allocationCard: {
        background: "white",
        padding: "25px",
        marginTop: "20px",
        borderRadius: "10px",
        boxShadow: "0 3px 10px rgba(0,0,0,0.08)"
    },

    bookedTitle: {
        color: "#166534"
    },

    roomDisplay: {
        marginTop: "20px",
        marginBottom: "20px",
        padding: "18px",
        background: "#2563eb",
        color: "white",
        textAlign: "center",
        fontSize: "28px",
        fontWeight: "bold",
        borderRadius: "8px"
    },

    messageText: {
        marginTop: "20px",
        padding: "12px",
        background: "#eff6ff",
        borderRadius: "6px"
    },

    noBooking: {
        background: "white",
        padding: "25px",
        borderRadius: "10px",
        marginTop: "20px"
    }
};

export default App;