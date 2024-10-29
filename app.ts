class Student {
  name: string;
  email: string;
  grade: number;

  constructor(name: string, email: string, grade: number) {
    this.name = name;
    this.email = email;
    this.grade = grade;
  }
}

class StudentDataManager {
  private students: Student[] = [];
  private editIndex: number | null = null;

  constructor() {
    this.loadFromLocalStorage(); // Load data from localStorage on initialization
  }

  addStudent(student: Student): void {
    if (this.isNameValid(student.name)) {
      this.students.push(student);
      this.saveToLocalStorage();
      this.renderStudentTable();
      this.clearForm();
    } else {
      alert('Please enter a valid name, without special characters.');
    }
  }

  updateStudent(index: number, student: Student): void {
    this.students[index] = student;
    this.saveToLocalStorage();
    this.renderStudentTable();
  }

  deleteStudent(index: number): void {
    this.students.splice(index, 1);
    this.saveToLocalStorage();
    this.renderStudentTable();
  }

  editStudent(index: number): void {
    this.editIndex = index;
    this.renderStudentTable();
  }

  private saveEdit(index: number): void {
    const row = document.querySelectorAll('#student-table tbody tr')[index];
    const nameInput = (row.querySelector('input[name="name"]') as HTMLInputElement).value.trim();
    const emailInput = (row.querySelector('input[name="email"]') as HTMLInputElement).value.trim();
    const gradeInput = (row.querySelector('input[name="grade"]') as HTMLInputElement).value.trim();

    if (this.isNameValid(nameInput) && emailInput.includes('@') && !isNaN(Number(gradeInput))) {
      this.updateStudent(index, new Student(nameInput, emailInput, parseInt(gradeInput)));
      this.editIndex = null;
    } else {
      alert('Please ensure all fields are filled correctly and that the name contains only letters.');
    }
  }

  private cancelEdit(): void {
    this.editIndex = null;
    this.renderStudentTable();
  }

  private isNameValid(name: string): boolean {
    return /^[A-Za-z\s]+$/.test(name);
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('students', JSON.stringify(this.students));
  }

  private loadFromLocalStorage(): void {
    const studentsData = localStorage.getItem('students');
    if (studentsData) {
      this.students = JSON.parse(studentsData).map(
        (studentData: { name: string; email: string; grade: number }) =>
          new Student(studentData.name, studentData.email, studentData.grade)
      );
      this.renderStudentTable();
    }
  }

  private renderStudentTable(): void {
    const tableBody = document.querySelector('#student-table tbody') as HTMLElement;
    tableBody.innerHTML = '';

    this.students.forEach((student, index) => {
      const row = document.createElement('tr');

      if (index === this.editIndex) {
        row.appendChild(this.createEditableCell(student.name, 'name'));
        row.appendChild(this.createEditableCell(student.email, 'email'));
        row.appendChild(this.createEditableCell(student.grade.toString(), 'grade', 'number'));

        const actionsCell = document.createElement('td');
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.addEventListener('click', () => this.saveEdit(index));

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => this.cancelEdit());

        actionsCell.appendChild(saveButton);
        actionsCell.appendChild(cancelButton);
        row.appendChild(actionsCell);
      } else {
        row.appendChild(this.createCell(student.name));
        row.appendChild(this.createCell(student.email));
        row.appendChild(this.createCell(student.grade.toString()));

        const actionsCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => this.editStudent(index));

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => this.deleteStudent(index));

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);
        row.appendChild(actionsCell);
      }

      tableBody.appendChild(row);
    });
  }

  private createCell(content: string): HTMLElement {
    const cell = document.createElement('td');
    cell.textContent = content;
    return cell;
  }

  private createEditableCell(value: string, name: string, type: string = 'text'): HTMLElement {
    const cell = document.createElement('td');
    const input = document.createElement('input');
    input.type = type;
    input.name = name;
    input.value = value;
    cell.appendChild(input);
    return cell;
  }

  private clearForm(): void {
    const form = document.getElementById('student-form') as HTMLFormElement;
    form.reset();
  }
}

const dataManager = new StudentDataManager();
const form = document.getElementById('student-form') as HTMLFormElement;
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const nameInput = document.getElementById('name') as HTMLInputElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const gradeInput = document.getElementById('grade') as HTMLInputElement;

  dataManager.addStudent(new Student(
    nameInput.value,
    emailInput.value,
    parseInt(gradeInput.value)
  ));
});

