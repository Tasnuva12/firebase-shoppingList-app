//special function of firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL:
    "https://playground-e230b-default-rtdb.asia-southeast1.firebasedatabase.app/",
};
//this line is connecting firebase with our project
const app = initializeApp(appSettings);

const database = getDatabase(app);
//this is telling us where we wanna put the data and the data name is items



const inputEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListItems = document.getElementById("shopping-list");

// Retrieve or generate user ID from localStorage
let userId = localStorage.getItem("userId");
if (!userId) {
  userId = generateUserId();
  localStorage.setItem("userId", userId);
}
const currentUserShoppingListRef = ref(
  database,
  `users/${userId}/shoppingList`
);
//button functionality
addButtonEl.addEventListener("click", function () {
  let inputValue = inputEl.value;
  if (inputValue) {
    push(currentUserShoppingListRef, inputValue); //pushing data to the database
  }

  clearInputEl(); //this function clears the inputfield
});

//fetching data from database
onValue(currentUserShoppingListRef, function (snapshot) {
  if (snapshot.exists()) {
    clearList();
    let shoppingArray = Object.entries(snapshot.val());
    for (let i = 0; i < shoppingArray.length; i++) {
      let currentItem = shoppingArray[i];

      appendToshoppingListItems(currentItem);
    }
  } else {
    shoppingListItems.innerHTML = "No Items here ...yet!";
  }
});

function clearInputEl() {
  inputEl.value = "";
}
function clearList() {
  shoppingListItems.innerHTML = "";
}

function appendToshoppingListItems(item) {
  let itemValue = item[1];
  let itemID = item[0];
  //shoppingListItems.innerHTML += `<li>${itemValue}</li>`;
  const newEl = document.createElement("li");
  newEl.textContent = itemValue;
  shoppingListItems.append(newEl);
  newEl.addEventListener("click", function () {
    const itemLocation = ref(currentUserShoppingListRef, itemID);
    
    remove(itemLocation);
  });
}
function generateUserId() {
  // Generate UUID (version 4)
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
