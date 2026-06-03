
export {} // Makes this file a module → private scope, no global conflicts

//? ============================================================
//? SOLID — O : Open/Closed Principle (OCP)
//? ============================================================
//?
//? Rule: Software entities (classes, modules, functions) should be
//?       OPEN for extension but CLOSED for modification.
//?
//? In plain English:
//?   When you need NEW behaviour, you should ADD new code —
//?   NOT change existing code that already works.
//?   Think of it like a plugin socket:
//?     - The socket (existing code) never changes.
//?     - You just plug in new adapters (new classes) as needed.
//?
//? The golden test ➜  "Did I have to edit existing working code
//?                     just to add a new feature?"
//?   ✅ NO  → OCP is respected (you only added new code)
//?   ❌ YES → OCP is violated (you modified existing code)
//?
//? Scenario: MountSeena School — Fee Discount Desk
//?
//?   The school offers different types of fee discounts:
//?     - StaffChildDiscount   → 50% off for children of school staff
//?     - ScholarshipDiscount  → 75% off for merit students
//?     - SiblingDiscount      → 10% off if a sibling already studies here
//?
//?   A junior developer wrote a single FeeCalculator class that
//?   checks the discount TYPE using if/else chains.
//?   Every time a new discount type is introduced, they EDIT
//?   the FeeCalculator — that is a classic OCP violation!
//?



//? ============================================================
//? ❌ STEP 1 — WITHOUT OCP (Violation — study this carefully)
//? ============================================================

//? BadFeeCalculator decides which discount to apply using if/else.
//? This means EVERY NEW DISCOUNT TYPE forces you to open this file
//? and edit the calculateFee() method — risky, fragile, error-prone.

class BadFeeCalculator {
    calculateFee(baseFee: number, discountType: string): number {
        if (discountType === "staff") {
            return baseFee * 0.50    // ❌ 50% off — hardcoded logic inside the class
        } else if (discountType === "scholarship") {
            return baseFee * 0.25   // ❌ 75% off — hardcoded logic inside the class
        } else if (discountType === "sibling") {
            return baseFee * 0.90   // ❌ 10% off — hardcoded logic inside the class
        } else {
            return baseFee          // no discount
        }
    }
}

//? If the school adds a "SportsQuota" discount tomorrow,
//? the developer MUST open BadFeeCalculator and add another else-if.
//? That is the OCP violation — the class is NOT closed for modification.

//? Demonstration:
const badCalc = new BadFeeCalculator()
console.log(`❌ Staff child fee:       ₹${badCalc.calculateFee(10000, "staff")}`)
console.log(`❌ Scholarship fee:       ₹${badCalc.calculateFee(10000, "scholarship")}`)
console.log(`❌ Sibling discount fee:  ₹${badCalc.calculateFee(10000, "sibling")}`)
//? Problem summary:
//?   - Every new discount type = edit the class = risk of breaking existing discounts
//?   - The string "staff", "scholarship" etc. are magic strings — typos cause silent bugs
//?   - calculateFee() has MORE THAN ONE reason to change → also violates SRP
//?   - No way to add a new discount without touching existing, tested code



//? ============================================================
//? ✅ STEP 2 — WITH OCP (Fixed Design — study this)
//? ============================================================
//?
//? The fix: define a contract (interface) for what a discount IS.
//?   IDiscountStrategy → every discount must know how to calculate itself
//?
//? FeeCalculator does NOT know or care WHICH discount it receives.
//? It just calls .apply(baseFee) and trusts the contract.
//? Adding a new discount = create a new class, plug it in. Done.
//? FeeCalculator is NEVER touched again. ✅


interface IDiscountStrategy {
    apply(baseFee: number): number
    //? Every discount class must implement this one method.
    //? The calculator doesn't know the formula — the strategy does.
}


//? StaffChildDiscount knows its own formula: 50% off
class StaffChildDiscount implements IDiscountStrategy {
    apply(baseFee: number): number {
        return baseFee * 0.50   // ✅ logic lives HERE, not inside the calculator
    }
}

//? ScholarshipDiscount knows its own formula: 75% off
class ScholarshipDiscount implements IDiscountStrategy {
    apply(baseFee: number): number {
        return baseFee * 0.25   // ✅ 25% of original = 75% discount
    }
}

//? SiblingDiscount knows its own formula: 10% off
class SiblingDiscount implements IDiscountStrategy {
    apply(baseFee: number): number {
        return baseFee * 0.90   // ✅ 90% of original = 10% discount
    }
}

//? FeeCalculator is CLOSED for modification.
//? It accepts ANY IDiscountStrategy — current or future.
//? It will NEVER need to be edited for a new discount type.
class FeeCalculator {
    calculate(baseFee: number, discount: IDiscountStrategy): number {
        return discount.apply(baseFee)  // ✅ delegates to the strategy — no if/else
    }
}

//? Let's run it (notice: FeeCalculator never changed, just new strategies plugged in):
const calc = new FeeCalculator()

console.log(`\n✅ Staff child fee:       ₹${calc.calculate(10000, new StaffChildDiscount())}`)
console.log(`✅ Scholarship fee:       ₹${calc.calculate(10000, new ScholarshipDiscount())}`)
console.log(`✅ Sibling discount fee:  ₹${calc.calculate(10000, new SiblingDiscount())}`)
//?
//? If a NEW "SportsQuota" discount (20% off) is needed tomorrow:
//?   1. Create `class SportsQuotaDiscount implements IDiscountStrategy { ... }`
//?   2. Call `calc.calculate(10000, new SportsQuotaDiscount())`
//?   → FeeCalculator is NEVER touched. OCP achieved. ✅


abstract class BadFeeCalculation{
    abstract calculate(baseFee:number):number
}

class SiblingsDiscount extends BadFeeCalculation{
calculate(baseFee:number): number {
    return baseFee * 0.10
}
}

class StaffChildrenDiscount extends BadFeeCalculation{
    calculate(baseFee: number): number {
        return baseFee * 0.25
    }
}

let sibling = new SiblingsDiscount()
console.log(sibling.calculate(10000))
let staff = new StaffChildrenDiscount()
console.log(staff.calculate(20000))

//? ============================================================
//? 📝 YOUR TASKS — Practice OCP yourself
//? ============================================================
//?
//? Scenario: MountSeena School — Report Card Generator
//?
//?   The school generates student report cards in different formats:
//?     - ConsoleReport   → prints grades to the terminal
//?     - HTMLReport      → returns an HTML string  (<h1> tags etc.)
//?     - JSONReport      → returns a JSON string
//?
//?   A junior developer wrote a single ReportGenerator class that
//?   checks the format using if/else strings.
//?   Adding a new format = editing the class = OCP violation!
//?
//? ─────────────────────────────────────────────────────────────────────

//? TASK 1:
//?   Show the VIOLATION first.
//?   Create a `BadReportGenerator` class with a method:
//?       generate(studentName: string, grade: string, format: string): void
//?   Use if/else to handle "console", "html", "json" formats.
//?   Add a comment explaining WHY adding a new format breaks OCP.

// ── Write your violation code here ────────────────────────────


// class BadReportGenerator{
//         generate(studentName: string, grade: string, format: string): void{
//             if(format=='console')console.log(`${studentName} has  ${grade}`)
//             else if (format === 'html')console.log( `<h1> ${studentName} has  ${grade} in html format`)
//             else if(format === "json")console.log(`${studentName} has  ${grade} in JSON`)
//         }
// }

// let ReportGenerator = new BadReportGenerator()
// ReportGenerator.generate("anas","A+","html",)
// ReportGenerator.generate("anas","A+","console",)
// ReportGenerator.generate("anas","A+","json",)

// this classes is respecting ocp because if a new method arises we need to alter the orginal class

//? TASK 2:
//?   Design the fix — define the interface.
//?   Create an interface `IReportFormat` with one method:
//?       generate(studentName: string, grade: string): void
//?   This is the "plugin socket" that all formats will implement.

// ── Write your interface here ──────────────────────────────────
interface IReportFormat {
    generate(studentName: string, grade: string): void
}


//? TASK 3:
//?   Create a `ConsoleReport` class that implements IReportFormat.
//?   It should console.log the student name and grade in plain text.

// ── Write ConsoleReport class here ────────────────────────────

class ConsoleReport implements IReportFormat{
    generate(studentName: string, grade: string): void {
        console.log(`${studentName} has  ${grade}`)
    }
}

//? TASK 4:
//?   Create an `HTMLReport` class that implements IReportFormat.
//?   It should console.log an HTML string, for example:
//?       <h1>Report Card</h1><p>Student: Anas | Grade: A+</p>

// ── Write HTMLReport class here ───────────────────────────────
class HtmlReport implements IReportFormat{
    generate(studentName: string, grade: string): void {
        console.log("<h1>Report Card </h1> <p>Student: " ,studentName, "  with a grade: ",grade)
    }
}


//? TASK 5:
//?   Create a `JSONReport` class that implements IReportFormat.
//?   It should console.log a JSON string, for example:
//?       { "student": "Anas", "grade": "A+" }

// ── Write JSONReport class here ───────────────────────────────

class JSONReport implements IReportFormat{
    generate(studentName: string, grade: string): void {
        console.log(   { "student": studentName, "grade": grade })
    }
}

//? TASK 6:
//?   Create a `ReportGenerator` class that is CLOSED for modification.
//?   It should have a method:
//?       generate(studentName: string, grade: string, formatter: IReportFormat): void
//?   It delegates entirely to formatter.generate() — no if/else inside.

// ── Write ReportGenerator class here ──────────────────────────
class ReportGenerator {
    generate(studentName:string,grade : string,formatter:IReportFormat){
        formatter.generate(studentName,grade)
    }
}

let reportGenerator = new ReportGenerator()
reportGenerator.generate("anju","A+",new ConsoleReport())
reportGenerator.generate("anju","A+",new HtmlReport())
reportGenerator.generate("anju","A+",new JSONReport())

//? TASK 7 (Bonus):
//?   The school now wants a `PDFReport` format.
//?   Add it WITHOUT touching ReportGenerator at all.
//?   Create `PDFReport implements IReportFormat` that logs:
//?       [PDF] Generating report for Anas — Grade: A+
//?   Call ReportGenerator.generate() with the new PDFReport.
//?   Confirm: did you have to edit ReportGenerator? NO → OCP ✅

// ── Write PDFReport and call here ─────────────────────────────

class PdfGenerator implements IReportFormat{
    generate(studentName: string, grade: string): void {
        console.log("I am pdf generator")
    }
}

reportGenerator.generate("geethanjali","B",new PdfGenerator())

//? ============================================================
//? 💡 KEY INSIGHT — OCP in one line
//? ============================================================
//?
//? OCP VIOLATION tells you: "You broke open something that was already working."
//? Every if/else chain that grows over time is an OCP smell.
//?
//? The OCP Fix is almost always the same recipe:
//?   1. Find the BEHAVIOUR that varies → extract it into an interface
//?   2. Each variation becomes its OWN class implementing that interface
//?   3. The consumer class accepts the INTERFACE, not a concrete type
//?   4. New behaviours = new classes only — existing code is NEVER touched
//?
//? Relation to LSP and ISP:
//?   OCP  ➜ "Add new code, don't modify existing."
//?   LSP  ➜ "New subtypes must honour the parent's contract."
//?   ISP  ➜ "Keep interfaces small so substitution stays honest."
//?   All three work together — fixing OCP with interfaces naturally
//?   leads you to follow LSP and ISP as well.
//?
//? The Strategy Pattern (used above) is the most common OCP implementation.
//? You'll see it everywhere: payment gateways, sorting algorithms,
//? authentication providers, notification senders, and more.
//?
//? Remember the golden test every time you write an if/else:
//?   ❓ "Will I have to open this class again when requirements grow?"
//?   ✅ No  → OCP is safe.
//?   ❌ Yes → Extract the varying behaviour into a strategy interface!
