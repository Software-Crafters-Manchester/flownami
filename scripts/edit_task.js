// deno-lint-ignore-file
async function updateTask() {
  const location = window.location.pathname.slice(1);
  const taskId = location.split("/")[1];

  const name = document.getElementById("taskName").innerText;
  const column = document.getElementById("taskColumn").value;

  const updatedTask = {
    id: taskId,
    name,
    column,
  };

  const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedTask),
  });

  if (response.status == 204) {
    console.log("Success");
    window.location = "/board";
  } else {
    //Do something with error
  }
}
