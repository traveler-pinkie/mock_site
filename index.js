document.querySelector("#loginButton").addEventListener("click", function() {
    console.log("Login button clicked");
})

document.querySelector("#todoButton").addEventListener("click", function() {
    document.querySelector(".todo-list").appendChild(document.createElement("li")).innerText = "New Todo Item";
})