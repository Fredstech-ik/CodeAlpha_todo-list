// Get references to the DOM elements
const taskInput = document.getElementById("task-input");
const addTaskBtn = document.getElementById("add-task-btn");
const taskList = document.getElementById("task-list");

// Initialize an empty array to store tasks
let tasks = [];

// Load tasks from local storage if available
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  renderTaskList();
}

// Add event listener to the "Add Task" button
addTaskBtn.addEventListener("click", addTask);

// Function to add a new task
function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText) {
    const task = {
      id: Date.now(), // Generate a unique ID based on the current timestamp
      text: taskText,
      completed: false,
    };
    tasks.push(task); // Add the new task to the tasks array
    renderTaskList(); // Re-render the task list
    saveTasksToLocalStorage(); // Save the updated tasks array to local storage
    taskInput.value = ""; // Clear the input field
    Swal.fire({
      icon: "success",
      title: "Task Added Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Enter A Task Description",
    });
  }
}

// Function to render the task list
function renderTaskList() {
  const taskHtml = tasks
    .map((task) => {
      return `
              <li class="task-item" data-id="${task.id}">
                  <input class="check-box" type="checkbox" ${
                    task.completed ? "checked" : ""
                  }>
                  <span class="${task.completed ? "completed" : ""}">${
        task.text
      }</span>
                  <div class="button-container">
                   <button class="edit"><i class="fas fa-edit"></i></button>
                  <button class="delete-btn"><i class="far fa-trash-alt"></i></button>
                  </div>
                  </li>
          `;
    })
    .join("");
  taskList.innerHTML = taskHtml;

  // Select all delete buttons and add event listener
  const deleteBtns = taskList.querySelectorAll(".delete-btn");
  deleteBtns.forEach((btn) => {
    btn.addEventListener("click", deleteTask);
  });

  // Select all edit buttons and add event listener
  const editBtns = taskList.querySelectorAll(".edit");
  editBtns.forEach((btn) => {
    btn.addEventListener("click", editTask);
  });

  // Select all checkboxes and add event listener
  const checkboxes = taskList.querySelectorAll('input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", toggleTaskCompleted);
  });
}

// Function to save tasks to local storage
function saveTasksToLocalStorage() {
  try {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error saving tasks to local storage:", error);
  }
}

// Function to delete a task
function deleteTask(e) {
  console.log("Delete button clicked"); // Debug log
  const taskId = e.target.closest(".task-item").dataset.id;
  tasks = tasks.filter((task) => task.id != taskId); // Remove the task from the tasks array
  renderTaskList(); // Re-render the task list
  saveTasksToLocalStorage(); // Save the updated tasks array to local storage
  Swal.fire({
    icon: "success",
    title: "Task Deleted Successfully",
    showConfirmButton: false,
    timer: 1500,
  });
  console.log("Task Deleted Successfully"); // Debug log
}

// Function to toggle the completed status of a task
function toggleTaskCompleted(e) {
  const taskId = e.target.closest(".task-item").dataset.id;
  const task = tasks.find((task) => task.id == taskId);
  task.completed = e.target.checked; // Update the completed status of the task
  renderTaskList(); // Re-render the task list
  saveTasksToLocalStorage(); // Save the updated tasks array to local storage
  Swal.fire({
    icon: "info",
    title: "Task status updated successfully",
    showConfirmButton: false,
    timer: 1500,
  });
  console.log("Task status updated successfully"); // Debug log
}

// Function to edit a task
function editTask(e) {
  const taskId = e.target.closest(".task-item").dataset.id;
  const task = tasks.find((task) => task.id == taskId);
  const newTaskText = prompt("Edit your task:", task.text);

  if (newTaskText !== null && newTaskText.trim() !== "") {
    task.text = newTaskText.trim(); // Update the task text
    renderTaskList(); // Re-render the task list
    saveTasksToLocalStorage(); // Save the updated tasks array to local storage
    Swal.fire({
      icon: "success",
      title: "Task Updated Successfully",
      showConfirmButton: false,
      timer: 1500,
    });
    console.log("Task Updated Successfully"); // Debug log
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Task description cannot be empty",
    });
  }
}
