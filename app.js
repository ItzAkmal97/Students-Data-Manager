var Student = /** @class */ (function () {
    function Student(name, email, grade) {
        this.name = name;
        this.email = email;
        this.grade = grade;
    }
    return Student;
}());
var StudentDataManager = /** @class */ (function () {
    function StudentDataManager() {
        this.students = [];
        this.editIndex = null;
        this.loadFromLocalStorage(); // Load data from localStorage on initialization
    }
    StudentDataManager.prototype.addStudent = function (student) {
        if (this.isNameValid(student.name)) {
            this.students.push(student);
            this.saveToLocalStorage();
            this.renderStudentTable();
            this.clearForm();
        }
        else {
            alert('Please enter a valid name, without special characters.');
        }
    };
    StudentDataManager.prototype.updateStudent = function (index, student) {
        this.students[index] = student;
        this.saveToLocalStorage();
        this.renderStudentTable();
    };
    StudentDataManager.prototype.deleteStudent = function (index) {
        this.students.splice(index, 1);
        this.saveToLocalStorage();
        this.renderStudentTable();
    };
    StudentDataManager.prototype.editStudent = function (index) {
        this.editIndex = index;
        this.renderStudentTable();
    };
    StudentDataManager.prototype.saveEdit = function (index) {
        var row = document.querySelectorAll('#student-table tbody tr')[index];
        var nameInput = row.querySelector('input[name="name"]').value.trim();
        var emailInput = row.querySelector('input[name="email"]').value.trim();
        var gradeInput = row.querySelector('input[name="grade"]').value.trim();
        if (!this.isNameValid(nameInput)) {
            alert('Please ensure the name contains only letters.');
        }
        else if (!emailInput.includes('@')) {
            alert('Please enter a valid email that includes "@" symbol.');
        }
        else if (isNaN(Number(gradeInput))) {
            alert('Please enter a valid grade.');
        }
        else {
            // If all validations pass, update the student
            this.updateStudent(index, new Student(nameInput, emailInput, parseInt(gradeInput)));
            this.editIndex = null;
            this.renderStudentTable();
        }
    };
    StudentDataManager.prototype.cancelEdit = function () {
        this.editIndex = null;
        this.renderStudentTable();
    };
    StudentDataManager.prototype.isNameValid = function (name) {
        return /^[A-Za-z\s]+$/.test(name);
    };
    StudentDataManager.prototype.saveToLocalStorage = function () {
        localStorage.setItem('students', JSON.stringify(this.students));
    };
    StudentDataManager.prototype.loadFromLocalStorage = function () {
        var studentsData = localStorage.getItem('students');
        if (studentsData) {
            this.students = JSON.parse(studentsData).map(function (studentData) {
                return new Student(studentData.name, studentData.email, studentData.grade);
            });
            this.renderStudentTable();
        }
    };
    StudentDataManager.prototype.renderStudentTable = function () {
        var _this = this;
        var tableBody = document.querySelector('#student-table tbody');
        tableBody.innerHTML = '';
        this.students.forEach(function (student, index) {
            var row = document.createElement('tr');
            if (index === _this.editIndex) {
                row.appendChild(_this.createEditableCell(student.name, 'name'));
                row.appendChild(_this.createEditableCell(student.email, 'email'));
                row.appendChild(_this.createEditableCell(student.grade.toString(), 'grade', 'number'));
                var actionsCell = document.createElement('td');
                var saveButton = document.createElement('button');
                saveButton.textContent = 'Save';
                saveButton.addEventListener('click', function () { return _this.saveEdit(index); });
                var cancelButton = document.createElement('button');
                cancelButton.textContent = 'Cancel';
                cancelButton.addEventListener('click', function () { return _this.cancelEdit(); });
                actionsCell.appendChild(saveButton);
                actionsCell.appendChild(cancelButton);
                row.appendChild(actionsCell);
            }
            else {
                row.appendChild(_this.createCell(student.name));
                row.appendChild(_this.createCell(student.email));
                row.appendChild(_this.createCell(student.grade.toString()));
                var actionsCell = document.createElement('td');
                var editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.addEventListener('click', function () { return _this.editStudent(index); });
                var deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.addEventListener('click', function () { return _this.deleteStudent(index); });
                actionsCell.appendChild(editButton);
                actionsCell.appendChild(deleteButton);
                row.appendChild(actionsCell);
            }
            tableBody.appendChild(row);
        });
    };
    StudentDataManager.prototype.createCell = function (content) {
        var cell = document.createElement('td');
        cell.textContent = content;
        return cell;
    };
    StudentDataManager.prototype.createEditableCell = function (value, name, type) {
        if (type === void 0) { type = 'text'; }
        var cell = document.createElement('td');
        var input = document.createElement('input');
        input.type = type;
        input.name = name;
        input.value = value;
        cell.appendChild(input);
        return cell;
    };
    StudentDataManager.prototype.clearForm = function () {
        var form = document.getElementById('student-form');
        form.reset();
    };
    return StudentDataManager;
}());
var dataManager = new StudentDataManager();
var form = document.getElementById('student-form');
form.addEventListener('submit', function (event) {
    event.preventDefault();
    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var gradeInput = document.getElementById('grade');
    dataManager.addStudent(new Student(nameInput.value, emailInput.value, parseInt(gradeInput.value)));
});
