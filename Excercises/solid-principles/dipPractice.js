//? Scenario: MountSeena School — Exam Report Generator
//?
//? The school generates exam result reports for students.
//? Right now reports are only printed to the console as plain text.

//? The Principal (high-level) should not need to change
//? just because a new report format is added.
//?
//? Your job: Refactor this using Dependency Inversion Principle.


// ── ❌ Current Broken Code (Tight Coupling) ──────────────────

class PlainTextReport {
    generate(student) {
        console.log(`REPORT: ${student.name} | Grade: ${student.grade} | Score: ${student.score}%`)
    }
}


// ── ✅ Your Solution Below ────────────────────────────────────

//? Tomorrow the school wants to support PDF and Excel formats too.


class ReportGenerator {
    generate(){
        if(this.constructor.name == "ReportGenerator"){
            throw new Error("this is abstract class")
        }
    }
}

class ExcelReportGenerator extends ReportGenerator{
    generate(student){
        console.log(` Excel Report :  |Name : ${student.name} | - |Grade : ${student.grade}| - |Score : ${student.score}|`)
    }
}

class PDFReportGenerator extends ReportGenerator{
    generate(student){
        console.log(`PDF Report :-Name : ${student.name} - Grade : ${student.grade} - Score : ${student.score} `)
    }
}


class Principal {
    constructor(ReportGenerator) {
        this.reporter = ReportGenerator  
    }

    publishResult(student) {
        this.reporter.generate(student)
    }
}

const principal = new Principal(new ExcelReportGenerator)
const principal2 = new Principal(new PDFReportGenerator)
principal.publishResult({ name: "Anas",   grade: "A+", score: 95 })
principal.publishResult({ name: "Rahul",  grade: "B",  score: 74 })
principal.publishResult({ name: "Sneha",  grade: "A",  score: 88 })
principal2.publishResult({ name: "Anas",   grade: "A+", score: 95 })
principal2.publishResult({ name: "Rahul",  grade: "B",  score: 74 })
principal2.publishResult({ name: "Sneha",  grade: "A",  score: 88 })
