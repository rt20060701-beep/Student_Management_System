
const STORAGE_KEY = "studenthub_records_v1";

const form = document.getElementById("studentForm");
const idInput = document.getElementById("studentId");
const nameInput = document.getElementById("studentName");
const ageInput = document.getElementById("studentAge");
const courseInput = document.getElementById("studentCourse");
const marksInput = document.getElementById("studentMarks");
const originalIdInput = document.getElementById("originalId");
const table = document.getElementById("studentTable");
const searchInput = document.getElementById("searchInput");
const message = document.getElementById("message");

let students = loadStudents();

function loadStudents() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

    if (!Array.isArray(saved)) return [];

    return saved.filter(s =>
      s &&
      typeof s.id === "string" &&
      typeof s.name === "string" &&
      typeof s.course === "string" &&
      Number.isFinite(s.age) &&
      Number.isFinite(s.marks)
    );
  } catch {
    return [];
  }
}

function saveStudents() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    return true;
  } catch {
    showMessage("Could not save data in this browser.", true);
    return false;
  }
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
}

function resetForm() {
  form.reset();
  originalIdInput.value = "";
  idInput.disabled = false;
  document.getElementById("formTitle").textContent = "Add a student";
  document.getElementById("submitButton").textContent = "Add student";
  document.getElementById("cancelButton").hidden = true;
}

function renderStudents() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = students.filter(s =>
    [s.id, s.name, s.course].some(value =>
      value.toLowerCase().includes(query)
    )
  );

  table.replaceChildren();

  filtered.forEach(s => {
    const row = document.createElement("tr");

    // Use textContent rather than HTML strings for user-entered data.
    const values = [
      s.id,
      s.name,
      String(s.age),
      s.course,
      Number(s.marks).toFixed(2)
    ];

    values.forEach((value, index) => {
      const cell = document.createElement("td");
      cell.textContent = value;

      if (index === 1) cell.className = "student-name";

      row.appendChild(cell);
    });

    const actions = document.createElement("td");
    const group = document.createElement("div");
    group.className = "action-group";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "action";
    editButton.textContent = "Edit";
    editButton.setAttribute("aria-label", `Edit ${s.name}`);
    editButton.addEventListener("click", () => editStudent(s.id));

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "action delete";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${s.name}`);
    deleteButton.addEventListener("click", () => deleteStudent(s.id));

    group.append(editButton, deleteButton);
    actions.appendChild(group);
    row.appendChild(actions);
    table.appendChild(row);
  });

  document.getElementById("emptyState").hidden = filtered.length > 0;
  document.getElementById("emptyState").textContent =
    students.length === 0
      ? "No students yet. Add your first record above."
      : "No matching student records found.";

  document.getElementById("totalCount").textContent = students.length;

  const average = students.length
    ? students.reduce((sum, s) => sum + s.marks, 0) / students.length
    : null;

  document.getElementById("averageMarks").textContent =
    average === null ? "—" : average.toFixed(2);
}

function editStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  originalIdInput.value = student.id;
  idInput.value = student.id;
  idInput.disabled = true;
  nameInput.value = student.name;
  ageInput.value = student.age;
  courseInput.value = student.course;
  marksInput.value = student.marks;

  document.getElementById("formTitle").textContent = "Update student";
  document.getElementById("submitButton").textContent = "Save changes";
  document.getElementById("cancelButton").hidden = false;

  showMessage("Editing " + student.name);
  form.scrollIntoView({ behavior: "smooth", block: "start" });
}

function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (!student) return;

  if (!confirm(`Delete the record for ${student.name} (${student.id})?`)) {
    return;
  }

  const previous = students;
  students = students.filter(s => s.id !== id);

  if (!saveStudents()) {
    students = previous;
    return;
  }

  if (originalIdInput.value === id) resetForm();

  renderStudents();
  showMessage("Student deleted successfully.");
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const id = idInput.value.trim();
  const name = nameInput.value.trim();
  const course = courseInput.value.trim();
  const age = Number(ageInput.value);
  const marks = Number(marksInput.value);
  const originalId = originalIdInput.value;

  if (!id || !name || !course) {
    showMessage("Please fill in every field.", true);
    return;
  }

  if (!Number.isInteger(age) || age < 1 || age > 120) {
    showMessage("Age must be a whole number between 1 and 120.", true);
    return;
  }

  if (!Number.isFinite(marks) || marks < 0 || marks > 100) {
    showMessage("Marks must be between 0 and 100.", true);
    return;
  }

  const duplicate = students.some(s =>
    s.id.toLowerCase() === id.toLowerCase() && s.id !== originalId
  );

  if (duplicate) {
    showMessage("That student ID already exists.", true);
    return;
  }

  const student = { id, name, age, course, marks };
  const previous = students;

  if (originalId) {
    students = students.map(s => s.id === originalId ? student : s);
  } else {
    students = [...students, student];
  }

  if (!saveStudents()) {
    students = previous;
    return;
  }

  resetForm();
  renderStudents();
  showMessage(originalId
    ? "Student updated successfully."
    : "Student added successfully."
  );
});

document.getElementById("cancelButton").addEventListener("click", () => {
  resetForm();
  showMessage("Edit cancelled.");
});

searchInput.addEventListener("input", renderStudents);

renderStudents();
