let students = [];

fetch("data.json")
    .then(res => res.json())
    .then(data => { students = data.students; })
    .catch(err => console.error("Chargement échoué :", err));

function fullName(s) {
    return s.nom + " " + s.prenom;
}

function showSection(id) {
    document.querySelectorAll("section").forEach(sec => sec.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");

    if (id === "listStudent") displayStudents();
    if (id === "listNotes") displayAllNotes();
    if (id === "ranking") ranking();
    if (id === "average") displayAverage();
}

function addStudent() {
    let name = document.getElementById("name").value.trim();
    if (!name) return alert("Veuillez saisir un nom.");

    let parts = name.split(" ");
    students.push({ id: students.length + 1, nom: parts[0], prenom: parts[1] || "", notes: [] });

    alert("Etudiant enregistre avec succes !");
    document.getElementById("name").value = "";
}

function deleteStudent() {
    let name = document.getElementById("deleteName").value.trim();
    students = students.filter(s => fullName(s) !== name);
    alert("Etudiant retire de la liste.");
    displayStudents();
}

function displayStudents() {
    let list = document.getElementById("studentList");
    list.innerHTML = "";
    students.forEach(s => {
        let li = document.createElement("li");
        li.textContent = fullName(s);
        list.appendChild(li);
    });
}

function addNote() {
    let name = document.getElementById("noteStudent").value.trim();
    let note = parseFloat(document.getElementById("noteValue").value);

    if (isNaN(note)) return alert("Veuillez entrer une note valide.");

    let student = students.find(s => fullName(s) === name);
    if (!student) return alert("Aucun étudiant trouvé avec ce nom.");

    student.notes.push(note);
    alert("Note enregistree !");
}

function deleteNote() {
    let name = document.getElementById("noteStudentDelete").value.trim();
    let student = students.find(s => fullName(s) === name);

    if (!student) return alert("Aucun étudiant trouvé avec ce nom.");
    if (student.notes.length === 0) return alert("Cet étudiant n'a aucune note.");

    student.notes.pop();
    alert("Derniere note supprimee.");
}

function displayAllNotes() {
    let list = document.getElementById("notesList");
    list.innerHTML = "";
    students.forEach(s => {
        let li = document.createElement("li");
        li.textContent = fullName(s) + " - " + (s.notes.length ? s.notes.join(", ") : "aucune note");
        list.appendChild(li);
    });
}

function studentNotes() {
    let name = document.getElementById("searchStudent").value.trim();
    let result = document.getElementById("resultNotes");
    let student = students.find(s => fullName(s) === name);

    result.innerHTML = student
        ? "Notes : " + (student.notes.length ? student.notes.join(", ") : "aucune note")
        : "Étudiant introuvable.";
}

function average(notes) {
    if (!notes.length) return 0;
    return (notes.reduce((a, b) => a + b, 0) / notes.length).toFixed(2);
}

function displayAverage() {
    let list = document.getElementById("averageList");
    list.innerHTML = "";
    students.forEach(s => {
        let li = document.createElement("li");
        li.textContent = fullName(s) + " - moyenne : " + average(s.notes) + "/20";
        list.appendChild(li);
    });
}

function averageStudent() {
    let name = document.getElementById("avgStudent").value.trim();
    let result = document.getElementById("avgResult");
    let student = students.find(s => fullName(s) === name);

    result.innerHTML = student
        ? "Moyenne de " + fullName(student) + " : " + average(student.notes) + "/20"
        : "Étudiant introuvable.";
}

function ranking() {
    let sorted = [...students].sort((a, b) => average(b.notes) - average(a.notes));
    let list = document.getElementById("rankingList");
    list.innerHTML = "";

    const medals = ["1.", "2.", "3."];
    sorted.forEach((s, i) => {
        let li = document.createElement("li");
        li.textContent = (i + 1) + ". " + fullName(s) + " - " + average(s.notes) + "/20";
        list.appendChild(li);
    });
}
