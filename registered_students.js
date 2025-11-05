console.log('registered_students.js is executing...');

addEventListener('DOMContentLoaded', getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown);

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById("btnLoadRegisteredStudents");
    btn.addEventListener('click', getAndDisplayAllRegisteredStudents);
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
            // TODO: update the HTML with information that we failed to retrieve the classes
        }
    }
    catch (error)
    {
        console.error(error);
        // TODO: update the HTML with information that we failed to connect to the API to fetch the classes data
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}


function refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON)
{
    const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");

    // delete all existing options (i.e., children) of the selectClassForEnrollment
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
        option.value = classAsJSON.id;                              // this is the value that will be sent to the server
        option.text = classAsJSON.code + ": " + classAsJSON.title;  // this is the value the user chooses from the dropdown

        selectClassForEnrollment.appendChild(option);
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
            } else {
                console.warn(`Failed to fetch student with ID ${entry.studentId}`);
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
            ${i < list.length - 1 ? '<hr>' : ''}
        `;

        divRegisteredStudents.appendChild(div);
    }
}