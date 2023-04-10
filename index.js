let notes = [];
let doneNotes = [];
let form = document.getElementById("form-container");
let inputTitle = document.getElementById("inputTitle");
let textArea = document.getElementById("textArea");
let inputText = document.getElementById("inputText");
const formButtons = document.getElementById("form-buttons");
let addBtn = document.getElementById("add-button");
let closeBtn = document.getElementById("form-close-button");
let p = document.getElementById("addedNotesParagraph");
let notesBlock = document.getElementById("notesContainer");
let doneNotesHeader = document.getElementById("doneNotesHeader");
let doneNotesBlock = document.getElementById("doneNotesContainer");
const notesFromLocalStorage = JSON.parse(localStorage.getItem("notes")); // Fetching the elements in notes array from local storage
const DoneNotesFromLocalStorage = JSON.parse(localStorage.getItem("doneNotes")); // Fetching the elements in doneNotes array from local storage

if (notesFromLocalStorage) {
  notes = notesFromLocalStorage;
  displayNotes();
}

if (DoneNotesFromLocalStorage) {
  doneNotes = DoneNotesFromLocalStorage;
  displayDoneNotes();
}

document.body.addEventListener("click", event => {
  handleFormClick(event);
});

function handleFormClick(event) {
  const isFormClicked = form.contains(event.target);
  if (isFormClicked) {
    openForm();
  } else {
    closeForm();
  }
}

function openForm() {
  form.classList.add("form-open");
  inputTitle.style.display = "block";
  textArea.style.display = "block";
  formButtons.style.display = "block";
}

$("#textArea").hide();
$("#form-buttons").hide();
function closeForm() {
  form.classList.remove("form-open");
  textArea.style.display = "none";
  formButtons.style.display = "none";
}

addBtn.addEventListener("click", event => {
    event.preventDefault();
    const title = inputTitle.value;
    const text = inputText.value.replace(/\n/g, '<br/>');
    function getCurrentDate() {
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth() + 1;
      var yyyy = today.getFullYear().toString();
      
      if(dd<10) {
        dd = '0'+dd;
      }
      
      if(mm<10) {
        mm = '0'+mm;
      }
      
      var date = dd + '/' + mm + '/' + yyyy;
      return date;
    }
    const hasInputValue = title || text;
    if(hasInputValue) {
        addNoteToArray({title: title, text: text, date: getCurrentDate()})
    }
    displayNotes();
    inputTitle.value = "";
    inputText.value = "";
});

function addNoteToArray(note) {  
    const newNote = {
        title: note.title,
        text: note.text,
        color: "white",
        id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1,
        date: note.date
    };
    notes = [...notes, newNote];
    localStorage.setItem("notes", JSON.stringify(notes)); // Storing the elements in notes array in the local srorage
    const hasNotes = notes.length > 0;
    console.log("Updated notes", notes);
    if(hasNotes) {
      p.innerText = "My Notes";
    }
  }

function displayNotes() {
    notesBlock.innerHTML = notes.map( note => `
      <div id='note' style='background-color: ${note.color}'>
          <div id='noteDate'>Created on: ${note.date}</div>
          <div id='noteTitle' style='background-color: ${note.color};text-align: center;font-weight: bold'>${note.title}</div>
          <div id='noteText'>${note.text}</div>
          <br><br><br>
          <div id='note-toolbar-container'>
            <div id='toolbar'>
              <img id='noteModifyBtn' src="Images/modifyBtn.png" onclick='modifyNote(${note.id})'>
              <img id='noteDoneBtn' src="Images/noteDone.png" onclick='noteDone(${note.id})'>
              <img id='noteDeleteBtn' src="Images/noteDelete.png" onclick='deleteNote(${note.id})'>
            </div>
          </div>
      </div>
    `).join(" ");
    let hasNotes = notes.length > 0; // Checking if notes array contains at least 1 item
    if(hasNotes) {
      p.innerText = "My Notes";
    }
};

function displayDoneNotes() {
  doneNotesBlock.innerHTML = doneNotes.map( note => `
    <div id='note' style='background-color: ${note.color}'>
        <div id='noteDate'>Completed on: ${note.date}</div>
        <div id='noteTitle' style='background-color: ${note.color};text-align: center;font-weight: bold'>${note.title}</div>
        <div id='noteText'>${note.text}</div>
        <br><br><br>
        <div id='note-toolbar-container'>
          <div id='toolbar'>
            <img id='noteDeleteBtn' src="Images/noteDelete.png" onclick='deleteDoneNote(${note.id})'>
          </div>
        </div>
    </div>
  `).join(" ");
  let hasDoneNotes = doneNotes.length > 0;
  if(hasDoneNotes) { // Displaying text for doneNotes array if it contains at least 1 item
    doneNotesHeader.innerHTML = `<p>Completed Notes</p><img id='doneNotesToggle' title='Hide/Display Completed Notes' src="Images/arrowDown.png">`;
  } else {
    doneNotesHeader.innerHTML = "";
  }

  // Function to slide up and down the DoneNotesContainer
  $(document).ready(function(){
    $("#doneNotesToggle").click(function(){
        var doneNotesContainer = $("#doneNotesContainer").css("display")
        debugger;
        if (doneNotesContainer === "flex") {
          let arrowDownToggle = document.getElementById("doneNotesToggle");
            $("#doneNotesContainer").slideUp("slow", "swing");
            arrowDownToggle.src = "Images/arrowUp2.png"
        } else {
          let arrowUpToggle = document.getElementById("doneNotesToggle");
            $("#doneNotesContainer").slideDown("slow", "swing");
            arrowUpToggle.src = "Images/arrowDown.png"
          }
    });
});
};

// When the user scrolls down 200px from the top of the document, show the scrollToTop button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      document.getElementById("scrollToTopBtn").style.display = "block";
  } else {
      document.getElementById("scrollToTopBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}

function deleteNote(noteID) {
  notes = notes.filter(note => note.id !== noteID); // Updating the notes array to be without the deleted notes
  console.log("updated notes after deletion: ", notes);
  localStorage.setItem("notes", JSON.stringify(notes));
  displayNotes();
  let hasNotes = notes.length === 0;
  if(hasNotes) {
    p.textContent = "Notes you add will appear here";
  }
};

function modifyNote(noteID) {
  notesBlock.innerHTML = notes.map(note => {
    if (note.id === noteID) {
      return `
      <div id='note' style='background-color: ${note.color}'>
          <div id='noteDate'>Created on: ${note.date}</div>
          <input id='noteTitleModify' required="" type="text" title='Note Title' value="${note.title}">
          <div id='noteTextModify' ><textarea id='noteTextAreaModify' required="" type="text" title="Note Text">${note.text}</textarea></div>
          <br><br><br>
          <div id='note-toolbar-container'>
            <div id='toolbar'>
              <img id='noteModifyBtn' src="Images/modifyBtn.png" onclick='modifyNote(${note.id})'>
              <img id='noteDoneBtn' src="Images/noteDone.png" onclick='noteDone(${note.id})'>
              <img id='noteDeleteBtn' src="Images/noteDelete.png" onclick='deleteNote(${note.id})'>
            </div>
          </div>
      </div>
    `} else {
      return `
      <div id='note' style='background-color: ${note.color}'>
          <div id='noteDate'>Created on: ${note.date}</div>
          <div id='noteTitle' style='background-color: ${note.color};text-align: center;font-weight: bold'>${note.title}</div>
          <div id='noteText'>${note.text}</div>
          <br><br><br>
          <div id='note-toolbar-container'>
            <div id='toolbar'>
              <img id='noteModifyBtn' src="Images/modifyBtn.png" onclick='modifyNote(${note.id})'>
              <img id='noteDoneBtn' src="Images/noteDone.png" onclick='noteDone(${note.id})'>
              <img id='noteDeleteBtn' src="Images/noteDelete.png" onclick='deleteNote(${note.id})'>
            </div>
          </div>
      </div>
    `}
  }).join(" ");
}

// Form Text area grows/shrinks as to the content inside
$("textarea").each(function () {
  this.setAttribute("style", "height:" + (this.scrollHeight) + "px;overflow-y:hidden;");
}).on("input", function () {
  this.style.height = 0;
  this.style.height = (this.scrollHeight) + "px";
});
//-------------------------------------------------------------------------------------------

function deleteDoneNote(noteID) {
  doneNotes = doneNotes.filter(note => note.id !== noteID);
  localStorage.setItem("doneNotes", JSON.stringify(doneNotes));
  console.log("Updated completed notes", doneNotes);
  displayDoneNotes();
}

function noteDone(noteID) {
  let hasDoneNotes = doneNotes.length > 0; // Checking if doneNotes array contains at least 1 item
  const DoneNoteColor = "#609966";
  notes = notes.map(note => {
    if (note.id === noteID) {
      return {...note, color: DoneNoteColor, id: doneNotes.length > 0 ? doneNotes[doneNotes.length - 1].id + 1 : 1};
    } else {
        return note;
      }
 });
 let completedNotes = notes.filter(note => note.color === DoneNoteColor);
 doneNotes = [...doneNotes, completedNotes[completedNotes.length - 1]];
 localStorage.setItem("doneNotes", JSON.stringify(doneNotes)); // Storing the elements in doneNotes array in the local srorage
 notes = notes.filter(note => note.color !== DoneNoteColor);
 localStorage.setItem("notes", JSON.stringify(notes));
 let hasNotes = notes.length === 0;
  if(hasNotes) {
    p.textContent = "Notes you add will appear here";
  }
 displayNotes();
 displayDoneNotes();
};

