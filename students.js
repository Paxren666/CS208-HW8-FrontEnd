console.log('students.js is executing...');

// TODO: add your code here

// =====================================================================================================================
// Functions that interact with the API
// =====================================================================================================================

async function getAndDisplayAllStudents() {
    console.log("getAndDisplayAllStudents - START");

    const API_URL = "http://localhost:8080/students";
    const div_list_of_students = document.getElementById("list_of_students");

    // Show a temporary message while loading
    div_list_of_students.innerHTML = "Loading students...";

    try {
        // Send GET request to the backend
        const response = await fetch(API_URL);
        console.log("Response status:", response.status);

        if (response.ok) {
            // Convert JSON data to JS object
            const studentsAsJSON = await response.json();
            console.log("Received students:", studentsAsJSON);

            // Show students on the page
            displayStudents(studentsAsJSON);
        } else {
            div_list_of_students.innerHTML = "<p class='failure'>❌ Failed to load students from server.</p>";
        }

    } catch (error) {
        console.error("Error fetching students:", error);
        div_list_of_students.innerHTML = "<p class='failure'>⚠️ Error connecting to the API.</p>";
    }

    console.log("getAndDisplayAllStudents - END");
}

// =====================================================================================================================
// Functions that update the HTML by manipulating the DOM
// =====================================================================================================================

function displayStudents(studentsList) {
    const div_list_of_students = document.getElementById("list_of_students");
    div_list_of_students.innerHTML = ""; // clear old data

    if (studentsList.length === 0) {
        div_list_of_students.innerHTML = "<p>No students found.</p>";
        return;
    }

    for (const student of studentsList) {
        div_list_of_students.innerHTML += renderStudentAsHTML(student);
    }
}

function renderStudentAsHTML(student) {
    return `
        <div class="show-student-in-list" data-id="${student.id}">
            <p><strong>ID:</strong> ${student.id}</p>
            <p><strong>Name:</strong> ${student.firstName} ${student.lastName}</p>
            <p><strong>Birth Date:</strong> ${student.birthDate}</p>
            <hr>
        </div>
    `;
}
