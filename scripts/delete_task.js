// deno-lint-ignore-file
async function deleteTask(taskId) {
  const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status == 204) {
    console.log("Success");
    window.location = "/board";
  } else {
    //Do something with error
  }
}
