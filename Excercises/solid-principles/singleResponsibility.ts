
export {} // Makes this file a module → private scope, no global conflicts

//? ============================================================
//? SOLID — S : Single Responsibility Principle (SRP)
//? ============================================================
//?
//? Rule: A class should have only ONE reason to change.
//?
//? In plain English:
//?   Each class should do exactly ONE thing and do it well.
//?   If a class is doing two unrelated jobs, it has two reasons
//?   to change — and every change risks breaking the OTHER job.
//?   Keep each class focused on a single, well-defined concern.
//?
//? The golden test ➜  "How many reasons does this class have to change?"
//?   ✅ ONE reason  → SRP is respected
//?   ❌ MORE THAN ONE → SRP is violated
//?
//? A helpful trick: try finishing this sentence about your class —
//?   "This class is responsible for ___________."
//?   If you find yourself writing "and", you have an SRP violation.
//?   "responsible for calculating grades AND formatting reports AND sending emails"
//?                                          ↑ each AND = a new responsibility
//?
//? Scenario: MountSeena School — Student Report System
//?
//?   The school needs to process student reports at end of term:
//?     1. Calculate the final grade from exam scores
//?     2. Format the report into a readable string
//?     3. Save the report to the database
//?     4. Send the report to the parent via email
//?
//?   A junior developer put ALL of this inside one class.
//?   That class now has FOUR reasons to change — a clear SRP violation!
//?



//? ============================================================
//? ❌ STEP 1 — WITHOUT SRP (Violation — study this carefully)
//? ============================================================

//? BadStudentReport does too many unrelated things:
//?   - Reason 1: Grading logic changes      → edit this class
//?   - Reason 2: Report format changes      → edit this class
//?   - Reason 3: Database schema changes    → edit this class
//?   - Reason 4: Email provider changes     → edit this class
//?
//? Every change to ANY one concern puts ALL other concerns at risk.
//? A typo fixing the email template could accidentally break the grade calculation!

class BadStudentReport {
    private studentName: string
    private scores: number[]

    constructor(studentName: string, scores: number[]) {
        this.studentName = studentName
        this.scores      = scores
    }

    //? ❌ Responsibility 1 — calculating grades (belongs in a GradeCalculator)
    calculateGrade(): string {
        const avg = this.scores.reduce((a, b) => a + b, 0) / this.scores.length
        if (avg >= 90) return "A+"
        if (avg >= 75) return "A"
        if (avg >= 60) return "B"
        if (avg >= 50) return "C"
        return "F"
    }

    //? ❌ Responsibility 2 — formatting output (belongs in a ReportFormatter)
    formatReport(): string {
        const grade = this.calculateGrade()
        return `=== REPORT CARD ===\nStudent: ${this.studentName}\nGrade: ${grade}\n==================`
    }

    //? ❌ Responsibility 3 — database persistence (belongs in a ReportRepository)
    saveToDatabase(): void {
        const report = this.formatReport()
        console.log(`[DB] Saving report for ${this.studentName}...`)
        console.log(`[DB] INSERT INTO reports VALUES ('${this.studentName}', '${report}')`)
        // If the DB changes from SQL to MongoDB, this entire class must be edited.
    }

    //? ❌ Responsibility 4 — sending emails (belongs in a NotificationService)
    sendEmailToParent(parentEmail: string): void {
        const report = this.formatReport()
        console.log(`[EMAIL] Sending to ${parentEmail}...`)
        console.log(`[EMAIL] Subject: Report Card for ${this.studentName}`)
        console.log(`[EMAIL] Body: ${report}`)
        // If the email provider changes (e.g. SendGrid → Mailgun), this class must be edited.
    }
}

//? Demonstration:
const badReport = new BadStudentReport("Anas", [88, 92, 76, 95])
console.log("❌ --- SRP Violation ---")
console.log(badReport.formatReport())
badReport.saveToDatabase()
badReport.sendEmailToParent("parent@example.com")

//? Problem summary:
//?   - 4 responsibilities crammed into 1 class = 4 reasons to change
//?   - Changing grading logic? Open class → risk breaking email code
//?   - Changing DB? Open class → risk breaking grade calculation
//?   - Impossible to unit-test grade logic without also loading email/DB logic
//?   - Impossible to reuse just the formatter in another part of the app
//?   - Over time this class becomes a "God Class" — knows everything, does everything



//? ============================================================
//? ✅ STEP 2 — WITH SRP (Fixed Design — study this)
//? ============================================================
//?
//? The fix: give EACH responsibility its own focused class.
//?   GradeCalculator   → ONLY calculates grades
//?   ReportFormatter   → ONLY formats the report string
//?   ReportRepository  → ONLY handles database persistence
//?   NotificationService → ONLY handles sending emails
//?
//? Now each class has EXACTLY ONE reason to change.
//? They can be developed, tested, and replaced independently.

//? ✅ Responsibility 1 — GradeCalculator knows ONLY how to calculate grades.
//?    If grading rules change (e.g. A+ threshold moves to 95), edit ONLY this class.
class GradeCalculator {
    calculate(scores: number[]): string {
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length
        if (avg >= 90) return "A+"
        if (avg >= 75) return "A"
        if (avg >= 60) return "B"
        if (avg >= 50) return "C"
        return "F"
    }
}

//? ✅ Responsibility 2 — ReportFormatter knows ONLY how to format a report.
//?    If the school wants HTML format instead, edit ONLY this class.
class ReportFormatter {
    format(studentName: string, grade: string): string {
        return (
            `=== REPORT CARD ===\n` +
            `Student : ${studentName}\n` +
            `Grade   : ${grade}\n` +
            `==================`
        )
    }
}

//? ✅ Responsibility 3 — ReportRepository knows ONLY how to persist a report.
//?    If the DB changes from SQL to MongoDB, edit ONLY this class.
class ReportRepository {
    save(studentName: string, formattedReport: string): void {
        console.log(`[DB] Saving report for ${studentName}...`)
        console.log(`[DB] INSERT INTO reports VALUES ('${studentName}', '...')`)
    }
}

//? ✅ Responsibility 4 — NotificationService knows ONLY how to send emails.
//?    If the email provider changes, edit ONLY this class.
class NotificationService {
    sendEmail(parentEmail: string, studentName: string, report: string): void {
        console.log(`[EMAIL] Sending to ${parentEmail}...`)
        console.log(`[EMAIL] Subject: Report Card for ${studentName}`)
        console.log(`[EMAIL] Body:\n${report}`)
    }
}

//? ✅ The coordinator — wires the focused classes together.
//?    This class has ONE job too: orchestrate the report pipeline.
//?    It doesn't KNOW how to calculate grades or format reports — it delegates.
class StudentReportService {
    constructor(
        private calculator  : GradeCalculator,
        private formatter   : ReportFormatter,
        private repository  : ReportRepository,
        private notifier    : NotificationService
    ) {}

    processReport(studentName: string, scores: number[], parentEmail: string): void {
        const grade  = this.calculator.calculate(scores)           // delegate ✅
        const report = this.formatter.format(studentName, grade)   // delegate ✅
        this.repository.save(studentName, report)                  // delegate ✅
        this.notifier.sendEmail(parentEmail, studentName, report)  // delegate ✅
    }
}

//? Let's run it:
console.log("\n✅ --- SRP Fixed Design ---")
const reportService = new StudentReportService(
    new GradeCalculator(),
    new ReportFormatter(),
    new ReportRepository(),
    new NotificationService()
)
reportService.processReport("Anas", [88, 92, 76, 95], "parent@example.com")

//?
//? If tomorrow the grading scale changes → edit ONLY GradeCalculator ✅
//? If the school wants HTML reports     → edit ONLY ReportFormatter ✅
//? If the DB moves to MongoDB            → edit ONLY ReportRepository ✅
//? If the email provider changes         → edit ONLY NotificationService ✅
//? Nothing else is ever touched.         That is SRP. ✅



//? ============================================================
//? 📝 YOUR TASKS — Practice SRP yourself
//? ============================================================
//?
//? Scenario: MountSeena School — Library Management System
//?
//?   The school library needs software to manage:
//?     1. Track which student borrowed which book (lending records)
//?     2. Calculate overdue fines (₹5 per day late)
//?     3. Generate a borrowing report (student name, book, days, fine)
//?     4. Send an SMS reminder to students with overdue books
//?
//?   A junior developer crammed all of this into ONE `BadLibraryManager` class.
//?
//? ─────────────────────────────────────────────────────────────────────

//? TASK 1:
//?   Show the VIOLATION first.
//?   Create a `BadLibraryManager` class with these methods:
//?     - borrowBook(studentName, bookTitle, dueDateDays)
//?     - calculateFine(daysLate): number
//?     - generateReport(): string
//?     - sendSmsReminder(phoneNumber): void
//?   Add a comment above each method listing its separate "reason to change".
//?   Add a final comment explaining WHY this violates SRP.

// ── Write your violation code here ────────────────────────────
class BadLibraryManager{
    //? Reason 1: If borrowing rules change (e.g. ID card check, max books limit) → must edit BadLibraryManager
    borrowBook(studentName:string, bookTitle:string, dueDateDays:number): void {
        console.log(`Book "${bookTitle}" borrowed by ${studentName}. Due in ${dueDateDays} days.`)
    }

    //? Reason 2: If fine rate changes (e.g. ₹5/day → ₹10/day) or calculation logic changes → must edit BadLibraryManager
    calculateFine(daysLate: number): number {
        if (daysLate <= 0) return 0
        return daysLate * 5
    }

    //? Reason 3: If report format changes (e.g. plain text → HTML/PDF) → must edit BadLibraryManager
    generateReport(studentName: string, bookTitle: string, daysLate: number): string {
        const fine = this.calculateFine(daysLate)
        return `Report → Student: ${studentName} | Book: ${bookTitle} | Days Late: ${daysLate} | Fine: ₹${fine}`
    }

    //? Reason 4: If SMS provider changes (e.g. Twilio → AWS SNS) or moves to email → must edit BadLibraryManager
    sendSmsReminder(phoneNumber: string, studentName: string, bookTitle: string): void {
        const msg = `[SMS] Hi ${studentName}, return "${bookTitle}" to avoid more fines.`
        console.log(`Sending to ${phoneNumber}: ${msg}`)
    }
}
//? WHY this violates SRP:
//? BadLibraryManager has FOUR reasons to change — borrowing rules, fine rates,
//? report formatting, and SMS provider are completely unrelated concerns crammed into one class.
//? Changing the SMS provider could accidentally break fine calculation. That's SRP violated.

//? TASK 2:
//?   Identify and list EXACTLY how many reasons `BadLibraryManager` has to change.
//?   Write ecach reason as a comment, in this format:
//?     //? Reason 1: If ... changes → must edit BadLibraryManager
//?     //? Reason 2: If ... changes → must edit BadLibraryManager
//?     ...

// ── Write ur reasons here ───────────────────────────────────
//reason 1  first borrowing book added new condition something like identity card needed
//2 calculating the no of days what if the flow changed rate changes
//3  usage of another reporting thing or method
//4  what if the sms reminder sending method changed from smtp or changed from sms to email


//? TASK 3:
//?   Create a `LendingTracker` class.
//?   Responsibility: ONLY track borrowing records.
//?   It should store: studentName, bookTitle, borrowedDate, dueDate.
//?   Add a method `recordBorrowing(studentName, bookTitle, dueDays)`.

// ── Write LendingTracker class here ───────────────────────────

class LendingTracker {

    recordBorrowing(studentName: string, borrowedDate:string,dueDate:string){
        console.log(`data saved with ${studentName}and ${borrowedDate} and duedate ${dueDate}`)
    }
}



//? TASK 4:
//?   Create a `FineCalculator` class.
//?   Responsibility: ONLY calculate overdue fines.
//?   Method: `calculate(daysLate: number): number` → returns ₹5 × daysLate.
//?   If daysLate ≤ 0, return 0 (no fine).

// ── Write FineCalculator class here ───────────────────────────

class FineCalculator{
    calculate(daysLate: number): number {
        if (daysLate <= 0) return 0          // ✅ explicit early return — no fine
        return daysLate * 5                  // ₹5 per day late
    }
}


//? TASK 5:
//?   Create a `LibraryReportGenerator` class.
//?   Responsibility: ONLY format and generate reports.
//?   Method: `generate(studentName, bookTitle, daysLate, fine): string`
//?   Return a neatly formatted report string (you choose the format).

// ── Write LibraryReportGenerator class here ───────────────────
class LibraryReportGenerator{
    generate(studentName: string, bookTitle: string, daysLate: number, fine: number): string {
        // ✅ returns a string — the coordinator decides what to do with it
        return (
            `=== LIBRARY REPORT ===\n` +
            `Student   : ${studentName}\n` +
            `Book      : ${bookTitle}\n` +
            `Days Late : ${daysLate}\n` +
            `Fine      : ₹${fine}\n` +
            `======================`
        )
    }
}


//? TASK 6:
//?   Create a `SmsNotifier` class.
//?   Responsibility: ONLY send SMS reminders.
//?   Method: `sendReminder(phoneNumber, studentName, bookTitle, fine): void`
//?   Just console.log the SMS content — simulate sending.

// ── Write SmsNotifier class here ──────────────────────────────
class SmsNotifier{
    sendReminder(phoneNumber:string,studentName:string,bookTitle:string,fine:number){
        console.log(`the sms reminder is ${phoneNumber} and ${studentName} and ${bookTitle} and ${fine}`)
    }
}


//? TASK 7:
//?   Create a `LibraryService` coordinator class (like StudentReportService above).
//?   Inject all 4 classes via constructor.
//?   Responsibility: ONLY orchestrate the library workflow.
//?   Method: `processOverdueBook(studentName, bookTitle, daysLate, phone): void`
//?   Wire the 4 classes together in the right order.
//?   Then call it with some sample data and log the output.

// ── Write LibraryService coordinator and call here ────────────

class LibraryService{
    constructor(
        private _lendingTracker        : LendingTracker,
        private _fineCalculator         : FineCalculator,
        private _libraryReportGenerator : LibraryReportGenerator,
        private _smsNotifier            : SmsNotifier,
    ){}

    // ✅ ONE unified orchestrator method — wires all 4 classes in the right order
    processOverdueBook(studentName: string, bookTitle: string, daysLate: number, phone: string): void {
        this._lendingTracker.recordBorrowing(studentName, bookTitle, `${daysLate} days overdue`)  // 1. record
        const fine   = this._fineCalculator.calculate(daysLate)                                   // 2. calculate fine
        const report = this._libraryReportGenerator.generate(studentName, bookTitle, daysLate, fine) // 3. generate report
        this._smsNotifier.sendReminder(phone, studentName, bookTitle, fine)                        // 4. notify ✅ used!
        console.log(report)                                                                        // 5. print report
    }
}

const librarian = new LibraryService(
    new LendingTracker(),
    new FineCalculator(),
    new LibraryReportGenerator(),
    new SmsNotifier()
)
librarian.processOverdueBook("Anas", "Life of Pi", 10, "+91-9876543210")

//? ============================================================
//? 💡 KEY INSIGHT — SRP in one line
//? ============================================================
//?
//? SRP VIOLATION tells you: "This class knows too much."
//? The warning signs (code smells):
//?   - Class name contains "And", "Manager", "Handler", "Util", "Helper"
//?     → these are vague names hiding multiple responsibilities
//?   - A class imports from database, email service, AND business logic
//?     → it's doing persistence + communication + rules all at once
//?   - Your method touches 5 unrelated things
//?     → each touch = a separate responsibility leaking in
//?
//? The SRP Fix is almost always the same recipe:
//?   1. List every job the class is doing
//?   2. Count the distinct reasons it could change
//?   3. Each reason → extract into its own focused class
//?   4. Wire them together in a thin coordinator/service class
//?
//? Benefits of SRP:
//?   ✅ Easy to unit test — each class has ONE job, ONE set of tests
//?   ✅ Easy to replace — swap just the email class without touching grades
//?   ✅ Easy to reuse — GradeCalculator works anywhere grades are needed
//?   ✅ Easy to understand — new developer reads ONE small focused class
//?   ✅ Safe to change — editing DB code can NEVER break email code
//?
//? Relation to other SOLID principles:
//?   SRP  ➜ "Each class does ONE thing."
//?   OCP  ➜ "Add new things without editing existing ones." (SRP makes this possible)
//?   LSP  ➜ "Children honour parent's contract." (easier when classes are focused)
//?   ISP  ➜ "Keep interfaces small." (natural result of having small, focused classes)
//?   DIP  ➜ "Depend on abstractions." (inject focused classes via interfaces)
//?   All five principles reinforce each other — SRP is the foundation.
//?
//? Remember the golden test every time you name a class:
//?   ❓ "How many reasons does this class have to change?"
//?   ✅ ONE   → SRP is safe.
//?   ❌ MORE  → Split it up!
