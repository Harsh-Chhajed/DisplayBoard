import {
  initializeApp
} from 'https://www.gstatic.com/firebasejs/9.7.0/firebase-app.js'

import { getDatabase, ref, onValue, child, push, update, set } from "https://www.gstatic.com/firebasejs/9.7.0/firebase-database.js";
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


const secondYear = ["DM", "FDS", "OOP", "CG", "DELD", "HSS", "M3", "DSA", "SE", "MP", "PPL", "COC", "Proxy"]
const thirdYear = ["DBMS", "TOC", "SPOS", "CNS", "IOTES", "HCI", "DS", "DSBDA", "WT", "AI", "IS", "AVR", "CC", "SMA"]
const fourthYear = ["DAA", "ML", "BT", "PC", "MT", "CSDF", "OOMD", "DSP", "IR", "GPUPA", "MC", "STQA", "CMPLR", "HPC", "DL", "NLP", "IP", "SDN", "ADSP", "OE1", "PR", "SC", "BI", "QC", "OE2"]

const staffMap = new Map([
  ["SEA", ["SS Deshmukh", "JR Tambe", "BS Sable", "YA Shinde", "AR Panhalkar", "RL Paikrao"]], ["TE", ["AN Nawathe", "KU Rahane", "JN Ganthade", "SK Sonkar"]], ["BE", ["MB Vaidya", "SR Pandit", "RG Tambe", "DR Patil"]]
]);

const subMap = new Map([
  ["SE", secondYear], ["TE", thirdYear], ["BE", fourthYear]
]);

const daysMap = new Map([
  ["Sunday", "0"], ["Monday", "1"], ["Tuesday", "2"], ["Wednesday", "3"], ["Thursday", "4"], ["Friday", "5"], ["Saturday", "6"]
]);

const timeMap = new Map([
  ["9:00 am - 9:55 am", "1"], ["9:55 am - 10:50 am", "2"], ["10:50 am - 11:10 am", "3"],["11:10 am - 12:05 pm", "4"], ["12:05 pm - 1:00 pm", "5"], ["1:00 pm - 2:00 pm", "6"], ["2:00 pm - 2:55 pm", "7"], ["2:55 pm - 3:50 pm", "8"], ["3:50 pm - 4:45 pm", "9"], ["4:45 pm - 5:40 pm", "10"], ["5:40 pm - 12:00 am", "11"]
]);

//const classMap = new Map([["SEA", 0], ["SEB", 1], ["TEA", 2], ["TEB", 3], ["BEA", 4], ["BEB", 5]]);

const app = initializeApp(firebaseConfig);
const db = getDatabase();;
const auth = getAuth();
const provider = new GoogleAuthProvider();

let prevYear = '';

document.getElementById("updateButton").addEventListener("click", function(event) {
  event.preventDefault()
  update1()
});

document.getElementById("subject").addEventListener("click", function(event) {
  showSubjects()
});

/*document.getElementById("staff").addEventListener("click", function(event) {
  showStaff()
});*/

document.getElementById("resetButton").addEventListener("click", function(event) {
  resetDB();
});


function update1() {

  let classroom = document.getElementById("classroom").value;

  console.log(document.getElementById("subject").value == "");
  let subject = document.getElementById("subject").value;

  console.log(document.getElementById("time").value);
  let time1 = timeMap.get(document.getElementById("time").value);

  console.log(document.getElementById("year").value);
  let year = document.getElementById("year").value;

  console.log(document.getElementById("division").value);
  let division = document.getElementById("division").value;

  console.log(document.getElementById("day").value);
  let day = daysMap.get(document.getElementById("day").value);

  console.log(document.getElementById("professor").value);
  let professor = document.getElementById("professor").value;

  while (subject.length < 6) {
    subject = subject + '_';
  }
  //let classCode = classMap.get(year + division);
  const updates = {};

  updates['/' + classroom + '/' + day + '/' + time1] = '_' + year + '-' + division + '_' + subject + professor;

  update(ref(db), updates);

}

function showSubjects() {
  let yr = document.getElementById("year").value;
  let division = document.getElementById("division")

  if (yr == prevYear) {
    return
  }
  let subArr = subMap.get(yr);
  document.getElementById("subject").innerHTML = "";

  for (let i = 0; i < subArr.length; i++) {

    let node = document.createElement("option");
    let textnode = document.createTextNode(subArr[i]);
    node.appendChild(textnode);
    document.getElementById("subject").appendChild(node);
  }

  /*let staffArr=staffMap.get(yr+division);
  document.getElementById("subject").innerHTML="";
  
  for (let i = 0; i < subArr.length; i++) {
    
    let node = document.createElement("option");
    let textnode = document.createTextNode(subArr[i]);
    node.appendChild(textnode);
    document.getElementById("subject").appendChild(node);
  } */
  prevYear = yr;

}



function resetDB() {
  const db = getDatabase();
  set(ref(db, '1/1'), {
    1: "_SE-A_PPL___AR Panhalkar",
    2: "_SE-A_M3____SS Deshmukh",
    3: "Break 1",
    4: "_SE-A_DSA___JR Tambe",
    5: "_SE-A_MP____YA Shinde",
    6: "Lunch",
    7: "_TE-A_AI____JN Gathade",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });

  set(ref(db, '1/2'), {
    1: "_SE-A_SE____BS Sable",
    2: "_SE-A_PPL___AR Panhalkar",
    3: "Break 1",
    4: "_SE-A_M3____SS Deshmukh",
    5: "_SE-A_MP____YA Shinde",
    6: "Lunch",
    7: "_TE-A_WT____KU Rahane",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  set(ref(db, '1/3'), {
    1: "_SE-A_DSA___JR Tambe",
    2: "_SE-A_SE____BS Sable",
    3: "Break 1",
    4: "_SE-A_MP____YA Shinde",
    5: "AVAILABLE",
    6: "Lunch",
    7: "_TE-A_DSBDA_AN Nawathe",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  set(ref(db, '1/4'), {
    1: "_SE-A_M3____SS Deshmukh",
    2: "AVAILABLE",
    3: "Break 1",
    4: "_SE-A_PPL___AR Panhalkar",
    5: "AVAILABLE",
    6: "Lunch",
    7: "_TE-A_DSBDA_AN Nawathe",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  set(ref(db, '1/5'), {
    1: "_SE-A_SE____BS Sable",
    2: "_SE-A_DSA___JR Tambe",
    3: "Break 1",
    4: "_SE-A_M3____SS Deshmukh",
    5: "AVAILABLE",
    6: "Lunch",
    7: "_TE-A_CC____SK Sonkar",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
    set(ref(db, '1/6'), {
    1: "_SE-A_PPL___AR Panhalkar",
    2: "_SE-A_M3____SS Deshmukh",
    3: "Break 1",
    4: "_SE-A_DSA___J R Tambe",
    5: "_SE-A_MP____YA Shinde",
    6: "Lunch",
    7: "_TE-A_AI____JN Gathade",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  set(ref(db, '2/1'), {
    1: "_SE-B_DSA___SB Bhonde",
    2: "_SE-B_MP____AR NEHE",
    3: "Break 1",
    4: "_SE-B_SE____RS Gaikwad",
    5: "_SE-B_M3____SS Deshmukh",
    6: "Lunch",
    7: "AVAILABLE",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  set(ref(db, '2/2'), {
    1: "_SE-B_M3____SS Deshmukh",
    2: "_SE-B_DSA___SB Bhonde",
    3: "Break 1",
    4: "_SE-B_PPL___RL Paikrao",
    5: "_SE-B_MP____AR NEHE",
    6: "Lunch",
    7: "AVAILABLE",
    8: "AVAILABLE"
  });
  set(ref(db, '2/3'), {
    1: "_SE-B_SE____RS Gaikwad",
    2: "_SE-B_M3____SS Deshmukh",
    3: "Break 1",
    4: "_SE-B_PPL___RL Paikrao",
    5: "AVAILABLE",
    6: "Lunch",
    7: "AVAILABLE",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  set(ref(db, '2/4'), {
    1: "_SE-B_DSA___SB Bhonde",
    2: "_SE-B_MP____AR NEHE",
    3: "Break 1",
    4: "AVAILABLE",
    5: "AVAILABLE",
    6: "Lunch",
    7: "AVAILABLE",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  set(ref(db, '2/5'), {
    1: "_SE-B_M3____SS Deshmukh",
    2: "_SE-B_PPL___RL Paikrao",
    3: "Break 1",
    4: "_SE-B_SE____RS Gaikwad",
    5: "AVAILABLE",
    6: "Lunch",
    7: "AVAILABLE",
    8: "AVAILABLE",
    9: "AVAILABLE",
    10: "AVAILABLE",
    11: "AVAILABLE",
    12: "AVAILABLE"
  });
  /*set(ref(db, '1/'), {
  1:"",
  2:"",
  3:"Break 1",
  4:"",
  5:""
});*/


}