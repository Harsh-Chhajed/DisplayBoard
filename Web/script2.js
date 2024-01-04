import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js'

import { getDatabase, ref, onValue, child, push, update, set, get } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
// Add Firebase products that you want to use

import {
  getAuth,
  GoogleAuthProvider,
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-auth.js'

const firebaseConfig = {

  apiKey: "AIzaSyClg2ZbFr3kB5X9WKtESG-QGUpwVDZbR-o",

  authDomain: "nodemcu-734c5.firebaseapp.com",

  databaseURL: "https://nodemcu-734c5-default-rtdb.firebaseio.com",

  projectId: "nodemcu-734c5",

  storageBucket: "nodemcu-734c5.appspot.com",

  messagingSenderId: "571924555919",

  appId: "1:571924555919:web:511694e87458dd5d34e8fa"

};


const app = initializeApp(firebaseConfig);

const dbRef = ref(getDatabase());

populateTable("1");

document.getElementById("radio1").addEventListener("click", function(event) {
  populateTable("1");
});
document.getElementById("radio2").addEventListener("click", function(event) {
  populateTable("2");
});
document.getElementById("radio3").addEventListener("click", function(event) {
  populateTable("3");
});
document.getElementById("radio4").addEventListener("click", function(event) {
  populateTable("4");
});
function populateTable(x){
console.log("Flag 1");
get(child(dbRef, x)).then((snapshot) => {
  if (snapshot.exists()) {
    //console.log(snapshot.val());
    //console.log(snapshot.val()[1]);
    while(document.getElementById("cell")){
      document.getElementById("cell").remove();      
    }
    console.log("Flag 2");

    var day='';
    console.log(snapshot.val())
    for (let i = 1; i < snapshot.val().length; i++) {
      console.log(snapshot.val()[i]);
      day='Day'+i.toString();
      console.log(day);
      var row=document.getElementById(day)
      
      for (let j = 1; j < snapshot.val()[i].length; j++) {
        console.log(snapshot.val()[i][j]);

        var cell= document.createElement("td");
        cell.className="px-6 py-4";
        cell.id="cell";
        cell.innerHTML=snapshot.val()[i][j];
        row.appendChild(cell);

      }
    }
    console.log("Flag 3");
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error(error);
});
  
}