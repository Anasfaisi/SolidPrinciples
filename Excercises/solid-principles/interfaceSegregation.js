//? ============================================================
//? SOLID — I : Interface Segregation Principle (ISP)
//? ============================================================
//?
//? Rule: A class should NOT be forced to implement methods it doesn't use.
//?       Split large "fat" interfaces into smaller, focused ones.
//?
//? Why TypeScript first?
//?   TypeScript has a real `interface` keyword and `implements`.
//?   This is the cleanest way to SEE the problem and solution.
//?   (JS mixin approach comes after this!)
//?
//? Scenario: MountSeena School — Staff Portal
//?
//?   The school has different types of staff:
//?     - Teacher       → can teach, grade papers
//?     - Librarian     → can manage books
//?     - Driver        → can drive the school bus
//?
//?   Someone made ONE giant IStaff interface for everyone.
//?   Now every staff member is FORCED to implement ALL methods — even useless ones.
//?
//? ❌ Teacher is FORCED to implement issueBook, returnBook, driveBus
class BadTeacher {
    teachClass(subject) {
        console.log(`Teaching ${subject}`);
    }
    gradePapers(studentName) {
        console.log(`Grading papers for ${studentName}`);
    }
    issueBook(bookName) {
        throw new Error("Teachers don't manage books!"); // ❌ forced garbage
    }
    returnBook(bookName) {
        throw new Error("Teachers don't manage books!"); // ❌ forced garbage
    }
    driveBus(route) {
        throw new Error("Teachers don't drive buses!"); // ❌ forced garbage
    }
}
//? TASK 2:
//? Create a `Teacher` class that implements ONLY ITeachable.
//? It should NOT have issueBook, returnBook, or driveBus at all.
// ── Write Teacher class here ────────────────────────────────
class Teacher {
    teachClass() {
        console.log("The teacher would take the classes");
    }
    gradePapers() {
        console.log("the teacher would grade the papers for the students");
    }
}
//? TASK 3:
//? Create a `Librarian` class that implements ONLY ILibrarian.
// ── Write Librarian class here ──────────────────────────────
class Librarian {
    issueBook() {
        console.log("the librarian will handle issueing the book");
    }
    returnBook() {
        console.log("Mr. librarian will handle about returning of the book too");
    }
}
//? TASK 4:
//? Create a `Driver` class that implements ONLY IDriver.
// ── Write Driver class here ─────────────────────────────────
class Driver {
    driveBus() {
        console.log("Mr Driver will drive the school bus and pick the students from the spot and drop them too");
    }
}
//? TASK 5 (Bonus):
//? MountSeena hires a "TeacherCumLibrarian" — a staff member who
//? both teaches AND manages books (but doesn't drive).
//?
//? In TypeScript a class can implement MULTIPLE interfaces!
//? Syntax:  class Foo implements IBar, IBaz { ... }
//?
//? Create a `TeacherCumLibrarian` class that implements both
//? ITeachable AND ILibrarian.
// ── Write TeacherCumLibrarian class here ────────────────────
class TeacherCumLibrarian {
    teachClass() {
        console.log("The teacher would take the classes");
    }
    gradePapers() {
        console.log("the teacher would grade the papers for the students");
    }
    issueBook() {
        console.log("the librarian will handle issueing the book");
    }
    returnBook() {
        console.log("Mr. librarian will handle about returning of the book too");
    }
}
// Teacher
let teacher = new Teacher();
teacher.teachClass();
teacher.gradePapers();
// Librarian
let librarian = new Librarian();
librarian.issueBook();
librarian.returnBook();
// Driver
let driver = new Driver();
driver.driveBus();
// TeacherCumLibrarian — uses both ITeacher + ILibrarian
let superTeacher = new TeacherCumLibrarian();
superTeacher.teachClass();
superTeacher.gradePapers();
superTeacher.issueBook();
superTeacher.returnBook();
//? ============================================================
//? 💡 KEY INSIGHT — What changed?
//? ============================================================
//?
//? ❌ Before ISP:  IStaff (fat) → Teacher, Librarian, Driver
//?                 All are forced to carry methods they'll NEVER use.
//?
//? ✅ After ISP:   ITeachable   → Teacher, TeacherCumLibrarian
//?                 ILibrarian   → Librarian, TeacherCumLibrarian
//?                 IDriver      → Driver
//?
//? Each class ONLY implements what it actually needs.
//? And a class CAN implement multiple focused interfaces — that's ISP in action!
//?
//? TypeScript `implements` = Java/C# interface (clean & explicit)
//? JavaScript mixin pattern = same idea, different syntax (coming next!)
