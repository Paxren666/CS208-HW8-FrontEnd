console.log('registered_students.js is executing...');

document.addEventListener('DOMContentLoaded', () => {
    getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown();

    getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown();

    const btn = document.getElementById("btnLoadRegisteredStudents");
    btn.addEventListener('click', getAndDisplayAllRegisteredStudents);

    const form = document.getElementById("id_form_add_new_student_to_a_class");
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const studentId = document.getElementById("selectStudentForEnrollment").value;
        const classId = document.getElementById("selectClassForEnrollment").value;

        if (!studentId || !classId) {
            alert("Please select both a student and a class.");
            return;
        }

        const params = new URLSearchParams();
        params.append("studentId", studentId);
        params.append("classId", classId);

        try {
            const response = await fetch(form.action, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString()
            });

            if (response.ok) {
                const result = await response.json();
                alert(result.message);
                form.reset();
                getAndDisplayAllRegisteredStudents();
            } else {
                const errorResult = await response.json();
                alert("Error: " + errorResult.error);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to connect to the server.");
        }
    });
});

async function getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown()
{
    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/classes";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const listOfClassesAsJSON = await response.json();
            console.log({listOfClassesAsJSON});

            refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON);
        }
        else
        {
            const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");
            selectClassForEnrollment.innerHTML = "<option disabled selected>Failed to load classes</option>";
        }
    }
    catch (error)
    {
        console.error(error);
        const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");
        selectClassForEnrollment.innerHTML = "<option disabled selected>Error connecting to API</option>";
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}

async function getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown()
{
    console.log('getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/students";

    try
    {
        const response = await fetch(API_URL);

        if (response.ok)
        {
            const listOfStudents = await response.json();
            console.log({listOfStudents});
            refreshTheSelectStudentForEnrollmentDropdown(listOfStudents);
        }
        else
        {
            const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");
            selectStudentForEnrollment.innerHTML = "<option disabled selected>Failed to load students</option>";
        }
    }
    catch (error)
    {
        console.error(error);
        const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");
        selectStudentForEnrollment.innerHTML = "<option disabled selected>Error connecting to API</option>";
    }

    console.log('getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - END');
}

function refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON)
{
    const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");

    while (selectClassForEnrollment.firstChild)
    {
        selectClassForEnrollment.removeChild(selectClassForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a class";
    option.disabled = true;
    option.selected = true;
    selectClassForEnrollment.appendChild(option);

    for (const classAsJSON of listOfClassesAsJSON)
    {
        const option = document.createElement("option");
        option.value = classAsJSON.id;
        option.text = classAsJSON.code + ": " + classAsJSON.title;

        selectClassForEnrollment.appendChild(option);
    }
}

function refreshTheSelectStudentForEnrollmentDropdown(listOfStudents)
{
    const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");

    while (selectStudentForEnrollment.firstChild)
    {
        selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
    }

    const option = document.createElement("option");
    option.value = "";
    option.text = "Select a student";
    option.disabled = true;
    option.selected = true;
    selectStudentForEnrollment.appendChild(option);

    for (const student of listOfStudents)
    {
        const option = document.createElement("option");
        option.value = student.id;
        option.text = student.firstName + " " + student.lastName;

        selectStudentForEnrollment.appendChild(option);
    }
}

async function getAndDisplayAllRegisteredStudents() {
    console.log("getAndDisplayAllRegisteredStudents - START");

    const API_URL = "http://localhost:8080/registered_students";
    const divRegisteredStudents = document.getElementById("list_of_registered_students");
    divRegisteredStudents.innerHTML = "Loading registered students...";

    try {
        const response = await fetch(API_URL);

        if (response.ok) {
            const registeredStudents = await response.json();
            displayRegisteredStudents(registeredStudents);
        } else {
            divRegisteredStudents.innerHTML = "<p class='failure'>Failed to load registered students from server.</p>";
        }
    } catch (error) {
        console.error(error);
        divRegisteredStudents.innerHTML = "<p class='failure'>Error connecting to the API.</p>";
    }

    console.log("getAndDisplayAllRegisteredStudents - END");
}

async function dropStudentFromClass(studentId, classCode) {
    let classId;
    try {
        const classesResponse = await fetch("http://localhost:8080/classes");
        if (classesResponse.ok) {
            const classesList = await classesResponse.json();
            const classObj = classesList.find(c => c.code === classCode);
            if (!classObj) {
                alert(`Error: class with code ${classCode} not found`);
                return;
            }
            classId = classObj.id;
        } else {
            alert("Failed to fetch classes from server.");
            return;
        }
    } catch (err) {
        console.error(err);
        alert("Failed to connect to server to get class information.");
        return;
    }

    const API_URL = "http://localhost:8080/drop_student_from_class";
    const params = new URLSearchParams();
    params.append("studentId", studentId);
    params.append("classId", classId);

    try {
        const response = await fetch(API_URL, {
            method: "DELETE",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString()
        });

        console.log({ response });
        console.log(`response.status = ${response.status}`);
        console.log(`response.ok = ${response.ok}`);

        const divRegisteredStudents = document.getElementById("list_of_registered_students");

        if (response.status === 204) {
            divRegisteredStudents.innerHTML = `<p class="success">Student with ID ${studentId} successfully dropped from class ${classCode}</p>`;
            await getAndDisplayAllRegisteredStudents();
        } else {
            const errorResult = await response.json();
            divRegisteredStudents.innerHTML = `<p class="failure">ERROR: ${errorResult.error}</p>`;
        }
    } catch (error) {
        console.error(error);
        const divRegisteredStudents = document.getElementById("list_of_registered_students");
        divRegisteredStudents.innerHTML = `<p class="failure">ERROR: Failed to connect to the API to drop student from class</p>`;
    }
}

// =====================================================================================================================
// Add a "Drop" button for each registered student entry
// =====================================================================================================================

async function displayRegisteredStudents(list) {
    const divRegisteredStudents = document.getElementById("list_of_registered_students");
    divRegisteredStudents.innerHTML = "";

    if (!list || list.length === 0) {
        divRegisteredStudents.innerHTML = "<p>No registered students found.</p>";
        return;
    }

    for (let i = 0; i < list.length; i++) {
        const entry = list[i];
        let firstName = "Unknown";
        let lastName = "Unknown";

        try {
            const studentResponse = await fetch(`http://localhost:8080/students/${entry.studentId}`);
            if (studentResponse.ok) {
                const studentData = await studentResponse.json();
                firstName = studentData.firstName;
                lastName = studentData.lastName;
            }
        } catch (err) {
            console.error(`Error fetching student ${entry.studentId}:`, err);
        }

        const div = document.createElement("div");
        div.className = "registered-student-entry";

        div.innerHTML = `
            <p><strong>Student ID:</strong> ${entry.studentId}</p>
            <p><strong>Student Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Class:</strong> ${entry.code} - ${entry.title}</p>
            <button class="btnDropStudent" data-student-id="${entry.studentId}" data-class-code="${entry.code}">Drop Student from Class</button>
            ${i < list.length - 1 ? '<hr>' : ''}
        `;

        divRegisteredStudents.appendChild(div);
    }

    const dropButtons = document.querySelectorAll(".btnDropStudent");
    dropButtons.forEach(btn => {
        btn.addEventListener("click", async (event) => {
            const studentId = event.target.getAttribute("data-student-id");
            const classCode = event.target.getAttribute("data-class-code");

            await dropStudentFromClass(studentId, classCode);
        });
    });
}
