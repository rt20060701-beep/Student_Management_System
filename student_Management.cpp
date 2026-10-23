
#include <iostream>
#include <vector>
#include <fstream>
#include <sstream>
#include <string>
#include <limits>
using namespace std;

struct Student {
    int id;
    string name;
    int age;
    string course;
    double marks;
};

vector<Student> students;
const string FILE_NAME = "students.txt";

void loadStudents() {
    ifstream file(FILE_NAME);
    Student s;
    while (file >> s.id >> s.age >> s.marks) {
        file.ignore(numeric_limits<streamsize>::max(), '\n');
        getline(file, s.name);
        getline(file, s.course);
        students.push_back(s);
    }
}

void saveStudents() {
    ofstream file(FILE_NAME);
    for (const auto& s : students) {
        file << s.id << '\n'
             << s.age << '\n'
             << s.marks << '\n'
             << s.name << '\n'
             << s.course << '\n';
    }
}

int findStudent(int id) {
    for (int i = 0; i < (int)students.size(); i++) {
        if (students[i].id == id)
            return i;
    }
    return -1;
}

void addStudent() {
    Student s;

    cout << "Enter student ID: ";
    if (!(cin >> s.id)) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid ID.\n";
        return;
    }

    if (findStudent(s.id) != -1) {
        cout << "Student ID already exists.\n";
        return;
    }

    cout << "Enter age: ";
    if (!(cin >> s.age) || s.age <= 0) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid age.\n";
        return;
    }

    cout << "Enter marks (0-100): ";
    if (!(cin >> s.marks) || s.marks < 0 || s.marks > 100) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid marks.\n";
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Enter full name: ";
    getline(cin, s.name);
    cout << "Enter course: ";
    getline(cin, s.course);

    if (s.name.empty() || s.course.empty()) {
        cout << "Name and course cannot be empty.\n";
        return;
    }

    students.push_back(s);
    saveStudents();
    cout << "Student added successfully.\n";
}

void viewStudents() {
    if (students.empty()) {
        cout << "No student records found.\n";
        return;
    }

    for (const auto& s : students) {
        cout << "\nID: " << s.id
             << "\nName: " << s.name
             << "\nAge: " << s.age
             << "\nCourse: " << s.course
             << "\nMarks: " << s.marks << "\n";
        cout << "-------------------------\n";
    }
}

void searchStudent() {
    int id;
    cout << "Enter ID to search: ";
    if (!(cin >> id)) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid ID.\n";
        return;
    }

    int index = findStudent(id);
    if (index == -1) {
        cout << "Student not found.\n";
        return;
    }

    const Student& s = students[index];
    cout << "ID: " << s.id
         << "\nName: " << s.name
         << "\nAge: " << s.age
         << "\nCourse: " << s.course
         << "\nMarks: " << s.marks << "\n";
}

void updateStudent() {
    int id;
    cout << "Enter ID to update: ";
    if (!(cin >> id)) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid ID.\n";
        return;
    }

    int index = findStudent(id);
    if (index == -1) {
        cout << "Student not found.\n";
        return;
    }

    Student& s = students[index];

    cout << "Enter new age: ";
    if (!(cin >> s.age) || s.age <= 0) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid age. No update saved.\n";
        return;
    }

    cout << "Enter new marks (0-100): ";
    if (!(cin >> s.marks) || s.marks < 0 || s.marks > 100) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid marks. No update saved.\n";
        return;
    }

    cin.ignore(numeric_limits<streamsize>::max(), '\n');
    cout << "Enter new name: ";
    getline(cin, s.name);
    cout << "Enter new course: ";
    getline(cin, s.course);

    if (s.name.empty() || s.course.empty()) {
        cout << "Name and course cannot be empty.\n";
        return;
    }

    saveStudents();
    cout << "Student updated successfully.\n";
}

void deleteStudent() {
    int id;
    cout << "Enter ID to delete: ";
    if (!(cin >> id)) {
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "Invalid ID.\n";
        return;
    }

    int index = findStudent(id);
    if (index == -1) {
        cout << "Student not found.\n";
        return;
    }

    students.erase(students.begin() + index);
    saveStudents();
    cout << "Student deleted successfully.\n";
}

int main() {
    loadStudents();

    int choice;
    do {
        cout << "\n=== STUDENT MANAGEMENT SYSTEM ===\n"
             << "1. Add Student\n"
             << "2. View Students\n"
             << "3. Search Student\n"
             << "4. Update Student\n"
             << "5. Delete Student\n"
             << "0. Exit\n"
             << "Enter choice: ";

        if (!(cin >> choice)) {
            cin.clear();
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            cout << "Please enter a valid menu number.\n";
            continue;
        }

        switch (choice) {
            case 1: addStudent(); break;
            case 2: viewStudents(); break;
            case 3: searchStudent(); break;
            case 4: updateStudent(); break;
            case 5: deleteStudent(); break;
            case 0: cout << "Goodbye!\n"; break;
            default: cout << "Invalid choice.\n";
        }
    } while (choice != 0);

    return 0;
}
