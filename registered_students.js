console.log('registered_students.js is executing...');

addEventListener('DOMContentLoaded', () => {
    getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown();
    getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown();
});

async function getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown() {
    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/classes";

    try {
        const response = await fetch(API_URL);
        console.log({ response });
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok) {
            const listOfClassesAsJSON = await response.json();
            console.log({ listOfClassesAsJSON });

            refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON);
        } else {
            // TODO: update the HTML with information that we failed to retrieve the classes
            const divError = document.getElementById("class_error_message");
            if (divError) {
                divError.innerHTML = `<p class="failure">Failed to retrieve classes from the server. Status: ${response.status}</p>`;
            }
            console.error("Failed to fetch classes from API");
        }
    } catch (error) {
        console.error(error);
        // TODO: update the HTML with information that we failed to connect to the API to fetch the classes data
        const divError = document.getElementById("class_error_message");
        if (divError) {
            divError.innerHTML = `<p class="failure">Failed to connect to the API to fetch classes. Error: ${error}</p>`;
        }
    }

    console.log('getAllClassesAndRefreshTheSelectClassForEnrollmentDropdown - END');
}

function refreshTheSelectClassForEnrollmentDropdown(listOfClassesAsJSON) {
    const selectClassForEnrollment = document.getElementById("selectClassForEnrollment");

    // delete all existing options (i.e., children)
    while (selectClassForEnrollment.firstChild) {
        selectClassForEnrollment.removeChild(selectClassForEnrollment.firstChild);
    }

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select a class";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectClassForEnrollment.appendChild(placeholderOption);

    for (const classAsJSON of listOfClassesAsJSON) {
        const option = document.createElement("option");
        option.value = classAsJSON.id;                              // value sent to server
        option.text = classAsJSON.code + ": " + classAsJSON.title;  // user sees this
        selectClassForEnrollment.appendChild(option);
    }
}

async function getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown() {
    console.log('getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - START');

    const API_URL = "http://localhost:8080/students";

    try {
        const response = await fetch(API_URL);
        console.log({ response });

        if (response.ok) {
            const listOfStudentsAsJSON = await response.json();
            console.log({ listOfStudentsAsJSON });

            refreshTheSelectStudentForEnrollmentDropdown(listOfStudentsAsJSON);
        } else {
            const divError = document.getElementById("student_error_message");
            if (divError) {
                divError.innerHTML = `<p class="failure">Failed to retrieve students from the server. Status: ${response.status}</p>`;
            }
            console.error("Failed to fetch students from API");
        }
    } catch (error) {
        console.error(error);
        const divError = document.getElementById("student_error_message");
        if (divError) {
            divError.innerHTML = `<p class="failure">Failed to connect to the API to fetch students. Error: ${error}</p>`;
        }
    }

    console.log('getAllStudentsAndRefreshTheSelectStudentForEnrollmentDropdown - END');
}

function refreshTheSelectStudentForEnrollmentDropdown(listOfStudentsAsJSON) {
    const selectStudentForEnrollment = document.getElementById("selectStudentForEnrollment");

    // delete all existing options
    while (selectStudentForEnrollment.firstChild) {
        selectStudentForEnrollment.removeChild(selectStudentForEnrollment.firstChild);
    }

    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.text = "Select a student";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectStudentForEnrollment.appendChild(placeholderOption);

    for (const student of listOfStudentsAsJSON) {
        const option = document.createElement("option");
        option.value = student.id;   // value sent to server
        option.text = `${student.firstName} ${student.lastName}`;  // combine firstName + lastName
        selectStudentForEnrollment.appendChild(option);
    }
}
