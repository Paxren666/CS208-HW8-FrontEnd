console.log('classes.js is executing...');

const id_form_create_new_class = document.getElementById("id_form_create_new_class");
id_form_create_new_class.addEventListener('submit', handleCreateNewClassEvent);

const div_create_new_class = document.getElementById("create_new_class");
const div_show_class_details = document.getElementById("show_class_details");
const div_update_class_details = document.getElementById("update_class_details");
const div_delete_class = document.getElementById("delete_class");
const div_list_of_classes = document.getElementById("list_of_classes");


// // TODO: uncomment the following code to fetch and display the classes after the page loads
document.addEventListener("DOMContentLoaded", async function()
{
     await getAndDisplayAllClasses();
});


// =====================================================================================================================
// Functions that interact with the API
// =====================================================================================================================

async function createNewClass(classData)
{
    const API_URL = 'http://localhost:8080/classes';

    try
    {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(classData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            const createdClass = await response.json();
            div_create_new_class.innerHTML = `<p class="success">Class created successfully. The new class id is ${createdClass.id}</p>`;
            await getAndDisplayAllClasses();
        }
        else
        {
            div_create_new_class.innerHTML = '<p class="failure">ERROR: failed to create the new class</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_create_new_class.innerHTML = `<p class="failure">ERROR: failed to connect to the API to create the new class</p>`;
    }
}


async function getAndDisplayAllClasses()
{
    console.log('getAndDisplayAllClasses - START');

    const API_URL = "http://localhost:8080/classes";

    div_list_of_classes.innerHTML = "Calling the API to get the list of classes...";

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_list_of_classes.innerHTML = "Retrieved the classes successfully, now we just need to process them...";

            const listOfClassesAsJSON = await response.json();
            console.log({listOfClasses: listOfClassesAsJSON});

            displayClasses(listOfClassesAsJSON);
        }
        else
        {
            div_list_of_classes.innerHTML = '<p class="failure">ERROR: failed to retrieve the classes.</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_list_of_classes.innerHTML = '<p class="failure">ERROR: failed to connect to the API to fetch the classes data.</p>';
    }

    console.log('getAndDisplayAllClasses - END');
}


/**
 * @return the class with id = classId as JSON or null if the class could not be retrieved from the API
 */
async function getClass(classId)
{
    console.log(`getClass(${classId}) - START`);
    console.log("classId = " + classId);

    const API_URL = "http://localhost:8080/classes/" + classId;

    console.log("Calling the API to get the class with id ${classId}...");

    try
    {
        const response = await fetch(API_URL);
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            console.log("Retrieved the class successfully, now we just need to process it...");

            const classAsJSON = await response.json();
            console.log({classAsJSON});

            return classAsJSON;
        }
        else
        {
            console.log(`ERROR: failed to retrieve the class with id ${classId}`);
        }
    }
    catch (error)
    {
        console.error(error);
        console.log(`ERROR: failed to connect to the API to fetch the class with id ${classId}`);
    }

    console.log(`getClass(${classId}) - END`);

    // if this code is reached, it means that an error occurred and the class could not be retrieved
    return null;
}


async function updateClass(classData)
{
    const API_URL = `http://localhost:8080/classes/${classData.id}`;

    try
    {
        const response = await fetch(API_URL, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams(classData)
        });
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_update_class_details.innerHTML = '<p class="success">Class updated successfully</p>';
            await getAndDisplayAllClasses();
        }
        else
        {
            div_update_class_details.innerHTML = '<p class="failure">ERROR: failed to update the class</p>';
        }
    }
    catch (error)
    {
        console.error(error);
        div_update_class_details.innerHTML = `<p class="failure">ERROR: failed to update the class with id ${classData.id}</p>`;
    }
}

async function deleteClass(classId)
{
    const API_URL = `http://localhost:8080/classes/${classId}`;

    try
    {
        const response = await fetch(API_URL, {method: "DELETE"});
        console.log({response});
        console.log(`response.status = ${response.status}`);
        console.log(`response.statusText = ${response.statusText}`);
        console.log(`response.ok = ${response.ok}`);

        if (response.ok)
        {
            div_delete_class.innerHTML = `<p class="success">Class with id ${classId} deleted successfully</p>`;
            await getAndDisplayAllClasses();
        }
        else
        {
            div_delete_class.innerHTML = `<p class="failure">ERROR: failed to delete the class with id ${classId}</p>`;
        }
    }
    catch (error)
    {
        console.error(error);
        div_delete_class.innerHTML = `<p class="failure">ERROR: failed to connect to the API to delete the class with id ${classId}</p>`;
    }
}


// =====================================================================================================================
// Functions that update the HTML by manipulating the DOM
// =====================================================================================================================

async function handleCreateNewClassEvent(event)
{
    // Prevent the default form submission behavior which will cause the page to be redirected to the action URL
    event.preventDefault();

    const formData = new FormData(id_form_create_new_class);
    const classData =
        {
            code: formData.get("code"),
            title: formData.get("title"),
            description: formData.get("description"),
            maxStudents: formData.get("maxStudents")
        };
    console.log({classData});
    await createNewClass(classData);
}


function displayClasses(listOfClassesAsJSON)
{
    div_list_of_classes.innerHTML = '';

    for (const classAsJSON of listOfClassesAsJSON)
    {
        console.log({classAsJSON});
        div_list_of_classes.innerHTML += renderClassAsHTML(classAsJSON);
    }
}


function renderClassAsHTML(classAsJSON)
{
    // data-id is a custom attribute that we use to store the id of the class, so that we can retrieve it later
    // when the user clicks on the "Show Class Details" button, or the "Update Class Details" button, or the "Delete Class" button

    return `<div class="show-class-in-list" data-id="${classAsJSON.id}">
        <p>Class ID (this is just for debugging): ${classAsJSON.id}</p>
        <p>Class code: ${classAsJSON.code}</p>
        <p>Class title: ${classAsJSON.title}</p>
        <p>Class description: ${classAsJSON.description}</p>
        <p>Max students: ${classAsJSON.maxStudents}</p>
        <p>
            <!-- TODO: this is for extra credit -->
            <a href="classes.show.html?class_id=${classAsJSON.id}">Show this class</a>
        </p>
        <button onclick="handleShowClassDetailsEvent(event)">Show Class Details</button>
        <button onclick="handleUpdateClassDetailsEvent(event)">Update Class Details</button>
        <button onclick="handleDeleteClassEvent(event)">Delete Class</button>
    </div>`;
}


async function handleShowClassDetailsEvent(event)
{
    console.log('handleShowClassDetailsEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const classId = event.target.parentElement.getAttribute("data-id");
    let classAsJSON = await getClass(classId);
    console.log({classAsJSON});
    if (classAsJSON == null)
    {
        div_show_class_details.innerHTML = `<p class="failure">ERROR: failed to retrieve the class with id ${classId}</p>`;
    }
    else
    {
        displayClassDetails(classAsJSON);
    }

    console.log('handleShowClassDetailsEvent - END');
}


function displayClassDetails(classAsJSON)
{
    console.log({classAsJSON});
    div_show_class_details.innerHTML = `<div class="show-class-details" data-id="${classAsJSON.id}">
        <p>Class ID (this is just for debugging): ${classAsJSON.id}</p>
        <p><strong>${classAsJSON.code}: ${classAsJSON.title}</strong></p>
        <p>Class description: ${classAsJSON.description}</p>
        <p>Max students: ${classAsJSON.maxStudents}</p>
    </div>`;
}


async function handleUpdateClassDetailsEvent(event)
{
    console.log('handleUpdateClassDetailsEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const classId = event.target.parentElement.getAttribute("data-id");
    const classAsJSON = await getClass(classId);
    console.log({classAsJSON});
    div_update_class_details.innerHTML =
        `<form id="id_form_update_class_details">
            <input type="hidden" name="id" value="${classAsJSON.id}">

            <label for="update_code">Class Code</label>
            <input type="text" name="code" id="update_code" value="${classAsJSON.code}" required>
            <br>

            <label for="update_title">Class Title</label>
            <input type="text" name="title" id="update_title" value="${classAsJSON.title}">
            <br>

            <label for="update_description">Class Description</label>
            <input type="text" name="description" id="update_description" value="${classAsJSON.description}">
            <br>

            <label for="update_max_students">Max students in class</label>
            <input type="number" name="maxStudents" id="update_max_students" value="${classAsJSON.maxStudents}">
            <br>

            <button type="submit">Update class details</button>
        </form>`;

    const idFormUpdateClassDetailsElement = document.getElementById("id_form_update_class_details");
    idFormUpdateClassDetailsElement.addEventListener("submit", function(event)
    {
        event.preventDefault();

        const formData = new FormData(idFormUpdateClassDetailsElement);
        const classData =
            {
                id: formData.get("id"),
                code: formData.get("code"),
                title: formData.get("title"),
                description: formData.get("description"),
                maxStudents: formData.get("maxStudents")
            };
        console.log({classData});
        updateClass(classData);
    });

    console.log('handleUpdateClassDetailsEvent - END');
}


async function handleDeleteClassEvent(event)
{
    console.log('handleDeleteClassEvent - START');
    console.log(`event = ${event}`);
    console.log({event});
    const classId = event.target.parentElement.getAttribute("data-id");
    await deleteClass(classId);
    console.log('handleDeleteClassEvent - END');
}
