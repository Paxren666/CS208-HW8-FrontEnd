console.log('students.js is executing...');

// TODO: add your code here

const id_form_create_new_student = document.getElementById("id_form_create_new_student");
id_form_create_new_student.addEventListener("submit", handleCreateNewStudentEvent);

const div_create_new_student = document.getElementById("create_new_student");
const div_show_student_details = document.getElementById("show_student_details");
const div_update_student_details = document.getElementById("update_student_details");
const div_delete_student = document.getElementById("delete_student");
const div_list_of_students = document.getElementById("list_of_students");

// document.addEventListener("DOMContentLoaded", async function() {
//   await getAndDisplayAllStudents();
// });

// =====================================================================================================================
// Functions that interact with the API
// =====================================================================================================================

async function createNewStudent(studentData) {
    const API_URL = "http://localhost:8080/students";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentData)
        });

        console.log({ response });
        console.log(`response.status = ${response.status}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const createdStudent = await response.json();
            div_create_new_student.innerHTML = `<p class="success">Student created successfully. The new student id is ${createdStudent.id}</p>`;

            // Refresh the student list
            await getAndDisplayAllStudents();
        } else {
            div_create_new_student.innerHTML = `<p class="failure">ERROR: failed to create the new student</p>`;
        }
    } catch (error) {
        console.error(error);
        div_create_new_student.innerHTML = `<p class="failure">ERROR: failed to connect to the API to create the new student</p>`;
    }
}

async function getAndDisplayAllStudents() {
    console.log("getAndDisplayAllStudents - START");

    const API_URL = "http://localhost:8080/students";

    div_list_of_students.innerHTML = "Loading students...";  // use the top-level variable

    try {
        const response = await fetch(API_URL);
        console.log("Response status:", response.status);

        if (response.ok) {
            const studentsAsJSON = await response.json();
            console.log("Received students:", studentsAsJSON);

            displayStudents(studentsAsJSON);
        } else {
            div_list_of_students.innerHTML = "<p class='failure'>Failed to load students from server.</p>";
        }

    } catch (error) {
        console.error("Error fetching students:", error);
        div_list_of_students.innerHTML = "<p class='failure'> Error connecting to the API.</p>";
    }

    console.log("getAndDisplayAllStudents - END");
}

async function getStudent(studentId) {
    console.log(`getStudent(${studentId}) - START`);

    const API_URL = `http://localhost:8080/students/${studentId}`;

    try {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const studentAsJSON = await response.json();
            console.log({studentAsJSON});
            return studentAsJSON;
        } else {
            console.log(`ERROR: failed to retrieve the student with id ${studentId}`);
        }
    } catch (error) {
        console.error(error);
        console.log(`ERROR: failed to connect to the API to fetch the student with id ${studentId}`);
    }

    console.log(`getStudent(${studentId}) - END`);
    return null;
}

async function updateStudent(studentData) {
    const API_URL = `http://localhost:8080/students/${studentData.id}`;

    try {
        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(studentData)
        });

        console.log({ response });
        console.log(`response.status = ${response.status}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            div_update_student_details.innerHTML = '<p class="success">Student updated successfully</p>';
            await getAndDisplayAllStudents();
        } else {
            div_update_student_details.innerHTML = '<p class="failure">ERROR: failed to update the student</p>';
        }
    } catch (error) {
        console.error(error);
        div_update_student_details.innerHTML = `<p class="failure">ERROR: failed to update the student with id ${studentData.id}</p>`;
    }
}

async function deleteStudent(studentId) {
    const API_URL = `http://localhost:8080/students/${studentId}`;

    try {
        const response = await fetch(API_URL, { method: "DELETE" });
        console.log({ response });
        console.log(`response.status = ${response.status}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            div_delete_student.innerHTML = `<p class="success">Student with id ${studentId} deleted successfully</p>`;
            await getAndDisplayAllStudents();
        } else {
            div_delete_student.innerHTML = `<p class="failure">ERROR: failed to delete the student with id ${studentId}</p>`;
        }
    } catch (error) {
        console.error(error);
        div_delete_student.innerHTML = `<p class="failure">ERROR: failed to connect to the API to delete the student with id ${studentId}</p>`;
    }
}

// =====================================================================================================================
// Functions that update the HTML by manipulating the DOM
// =====================================================================================================================

async function handleCreateNewStudentEvent(event) {
    // Prevent the default form submission
    event.preventDefault();

    // Get form data
    const formData = new FormData(id_form_create_new_student);
    const studentData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        birthDate: formData.get("birthDate")
    };

    console.log({ studentData });

    // Call the function to create a new student
    await createNewStudent(studentData);
}

function displayStudents(studentsList) {
    div_list_of_students.innerHTML = "";

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
            <p><strong>First Name:</strong> ${student.firstName}</p>
            <p><strong>Last Name:</strong> ${student.lastName}</p>
            <p><strong>Birth Date:</strong> ${student.birthDate}</p>
            
            <button onclick="handleShowStudentDetailsEvent(event)">Show Student Details</button>
            <button onclick="handleUpdateStudentDetailsEvent(event)">Update Student Details</button>
            <button onclick="handleDeleteStudentEvent(event)">Delete Student</button>
        </div>`;
}

async function handleShowStudentDetailsEvent(event) {
    console.log('handleShowStudentDetailsEvent - START');
    const studentId = event.target.parentElement.getAttribute("data-id");
    console.log(`studentId = ${studentId}`);

    let studentAsJSON = await getStudent(studentId);
    console.log({studentAsJSON});

    if (studentAsJSON == null) {
        div_show_student_details.innerHTML = `<p class="failure">ERROR: failed to retrieve student with id ${studentId}</p>`;
    } else {
        displayStudentDetails(studentAsJSON);
    }

    console.log('handleShowStudentDetailsEvent - END');
}

function displayStudentDetails(studentAsJSON) {
    console.log({studentAsJSON});
    div_show_student_details.innerHTML = `
        <div class="show-student-details" data-id="${studentAsJSON.id}">
            <p><strong>ID:</strong> ${studentAsJSON.id}</p>
            <p><strong>Name:</strong> ${studentAsJSON.firstName} ${studentAsJSON.lastName}</p>
            <p><strong>Birth Date:</strong> ${studentAsJSON.birthDate}</p>
        </div>`;
}

async function handleUpdateStudentDetailsEvent(event) {
    console.log('handleUpdateStudentDetailsEvent - START');

    const studentId = event.target.parentElement.getAttribute("data-id");
    const studentAsJSON = await getStudent(studentId);
    console.log({ studentAsJSON });

    div_update_student_details.innerHTML = `
        <form id="id_form_update_student_details">
            <input type="hidden" name="id" value="${studentAsJSON.id}">

            <label for="update_firstName">First Name</label>
            <input type="text" name="firstName" id="update_firstName" value="${studentAsJSON.firstName}" required>
            <br>

            <label for="update_lastName">Last Name</label>
            <input type="text" name="lastName" id="update_lastName" value="${studentAsJSON.lastName}" required>
            <br>

            <label for="update_birthDate">Birth Date</label>
            <input type="date" name="birthDate" id="update_birthDate" value="${studentAsJSON.birthDate}" required>
            <br>

            <button type="submit">Update student details</button>
        </form>
    `;

    const idFormUpdateStudentElement = document.getElementById("id_form_update_student_details");
    idFormUpdateStudentElement.addEventListener("submit", function(event) {
        event.preventDefault();

        const formData = new FormData(idFormUpdateStudentElement);
        const studentData = {
            id: formData.get("id"),
            firstName: formData.get("firstName"),
            lastName: formData.get("lastName"),
            birthDate: formData.get("birthDate")
        };

        console.log({ studentData });
        updateStudent(studentData);
    });

    console.log('handleUpdateStudentDetailsEvent - END');
}

async function handleDeleteStudentEvent(event) {
    console.log('handleDeleteStudentEvent - START');

    const studentId = event.target.parentElement.getAttribute("data-id");
    console.log(`Deleting student with id = ${studentId}`);

    await deleteStudent(studentId);

    console.log('handleDeleteStudentEvent - END');
}
