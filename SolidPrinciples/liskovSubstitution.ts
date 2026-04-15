
export {} // Makes this file a module → private scope, no global conflicts

//? ============================================================
//? SOLID — L : Liskov Substitution Principle (LSP)
//? ============================================================
//?
//? Rule: If S is a subtype of T, then objects of type T may be
//?       replaced with objects of type S WITHOUT breaking the program.
//?
//? In plain English:
//?   A child class should be FULLY substitutable for its parent class.
//?   Anywhere you use the Parent, you must be able to silently swap in
//?   a Child and the program should still work CORRECTLY — no crashes,
//?   no surprises, no thrown errors for "unsupported" operations.
//?
//? The golden test ➜  "Can I replace Parent with Child everywhere
//?                      and still get sensible, correct behaviour?"
//?   ✅ YES → LSP is respected
//?   ❌ NO  → LSP is violated
//?
//? Scenario: MountSeena School — Payment Desk
//?
//?   The school accepts different payment methods:
//?     - CreditCard   → can pay, can refund
//?     - DebitCard    → can pay, can refund
//?     - GiftCard     → can pay, but CANNOT refund (store policy)
//?
//?   A developer made GiftCard extend a base PaymentMethod that
//?   promises refunds. GiftCard then throws an error in refund().
//?   This SILENTLY breaks every place that calls refund() on a
//?   PaymentMethod — that is a classic LSP violation.
//?



//? ============================================================
//? ❌ STEP 1 — WITHOUT LSP (Violation — study this carefully)
//? ============================================================

// class BadPaymentMethod {
//     pay(amount: number): void {
//         console.log(`Paid ₹${amount}`)
//     }
//     refund(amount: number): void {
//         console.log(`Refunded ₹${amount}`)
//     }
// }

// class BadCreditCard extends BadPaymentMethod {
//     pay(amount: number): void {
//         console.log(`CreditCard: Paid ₹${amount}`)
//     }
//     refund(amount: number): void {
//         console.log(`CreditCard: Refunded ₹${amount}`)
//     }
// }

//? ❌ GiftCard CANNOT refund, but it is FORCED to inherit refund()
//?    because it extends BadPaymentMethod.
//?    The only way out is to throw an error — which BREAKS LSP.
// class BadGiftCard extends BadPaymentMethod {
//     pay(amount: number): void {
//         console.log(`GiftCard: Paid ₹${amount}`)
//     }
//     refund(amount: number): void {
//         throw new Error("GiftCards cannot be refunded!") // ❌ LSP broken!
//     }
// }

//? This function trusts the contract: "every BadPaymentMethod can refund"
// function processRefund(method: BadPaymentMethod, amount: number): void {
//     method.refund(amount) // 💣 Explodes silently when method is BadGiftCard
// }

//? Demonstration of the hidden time-bomb:
// const badGift = new BadGiftCard()
// processRefund(badGift, 500)
// ↑ Runtime crash! Even though TypeScript has no compile-time warning.
//?
//? Problem summary:
//?   - BadGiftCard PRETENDS to be a BadPaymentMethod (subtypes it)
//?   - But substituting it breaks the calling code
//?   - The parent's promise ("I can refund") is violated by the child
//?   - This is exactly what LSP forbids



//? ============================================================
//? ✅ STEP 2 — WITH LSP (Fixed Design — study this)
//? ============================================================
//?
//? The fix: split the base type into TWO focused types.
//?   - IPayable   → every payment method CAN pay  (universal promise)
//?   - IRefundable→ only SOME methods can refund   (opt-in promise)
//?
//? Now GiftCard simply does NOT implement IRefundable.
//? No lies. No fake throws. The type system enforces the contract.

// interface IPayable {
//     pay(amount: number): void
// }

// interface IRefundable {
//     refund(amount: number): void
// }

//? CreditCard can both pay AND refund — it implements both interfaces.
// class CreditCard implements IPayable, IRefundable {
//     pay(amount: number): void {
//         console.log(`CreditCard: Paid ₹${amount}`)
//     }
//     refund(amount: number): void {
//         console.log(`CreditCard: Refunded ₹${amount}`)
//     }
// }

//? DebitCard can both pay AND refund too.
// class DebitCard implements IPayable, IRefundable {
//     pay(amount: number): void {
//         console.log(`DebitCard: Paid ₹${amount}`)
//     }
//     refund(amount: number): void {
//         console.log(`DebitCard: Refunded ₹${amount}`)
//     }
// }

//? ✅ GiftCard only promises what it can actually DO — just IPayable.
//?    It does NOT implement IRefundable. No throws. No lies.
// class GiftCard implements IPayable {
//     pay(amount: number): void {
//         console.log(`GiftCard: Paid ₹${amount}`)
//     }
//     //? refund() simply doesn't exist here — and that is perfectly fine!
// }

// //? Now the function that does refunds ONLY accepts IRefundable.
// //? TypeScript will reject GiftCard here at COMPILE TIME. Safe!
// function issueRefund(method: IRefundable, amount: number): void {
//     method.refund(amount) // ✅ 100% safe — no runtime surprises
// }

// //? And the checkout counter accepts ANYTHING that can pay.
// function checkout(method: IPayable, amount: number): void {
//     method.pay(amount) // ✅ CreditCard, DebitCard, GiftCard all work here
// }

//? Let's run it:
// const creditCard = new CreditCard()
// const debitCard  = new DebitCard()
// const giftCard   = new GiftCard()

// //? All three can pay — LSP holds, every IPayable is truly substitutable
// checkout(creditCard, 1000)
// checkout(debitCard,  500)
// checkout(giftCard,   250)

// //? Only cards that promised refund can refund — type system enforces this
// issueRefund(creditCard, 1000)
// issueRefund(debitCard,  500)
// // issueRefund(giftCard, 250) ← TypeScript ERROR at compile time ✅ (prevented!)



//? ============================================================
//? 📝 YOUR TASKS — Practice LSP yourself
//? ============================================================
//?
//? Scenario: MountSeena School — Vehicle Fleet
//?
//?   The school fleet has different vehicles:
//?     - SchoolBus    → can transport students, can refuel
//?     - ElectricVan  → can transport students, can recharge (NOT refuel)
//?     - Bicycle      → can transport students (short errands), cannot refuel OR recharge
//?
//?   A junior developer created this base class:
//?
//?       class BadVehicle {
//?           transportStudents(count: number): void { ... }
//?           refuel(litres: number): void { ... }
//?       }
//?
//?   And made ElectricVan and Bicycle extend it.
//?   Both end up throwing errors in refuel() — a clear LSP violation!
//?
//? ─────────────────────────────────────────────────────────────────────

//? TASK 1:
//?   Show the VIOLATION first.
//?   Create a `BadVehicle` base class with transportStudents() and refuel().
//?   Create `BadElectricVan` and `BadBicycle` that extend it.
//?   Make them throw errors in refuel() to demonstrate the problem.
//?   Add a comment explaining WHY this breaks LSP.

// ── Write your violation code here ────────────────────────────

// class BadVehicle {
//     transportStudents(){
//         throw new Error("this is parent class please inherit")
//     }
//     refuel(){
//         throw new Error("this is parent class method please inherit")
//     }
// }

// class BadElectricVan extends BadVehicle{
//     transportStudents(): void {
//         console.log("The bad electric van class can transport the studnets")
//     }
//     refuel(): void {
//         console.error("Unfortunately I can't be refuelled Iam Rechargable")
//     }
// }
// class BadBicycle extends BadVehicle{
//     transportStudents(): void {
//         console.log("The bad electric van class can transport the studnets")
//     }
//     refuel(): void {
//         console.error("Unfortunately I doesn't need any fuel, I run on man power")
//     }
// }

// const byd = new BadElectricVan()
// byd.transportStudents()
// byd.refuel()

// const Herculas = new BadBicycle()
// Herculas.transportStudents()
// Herculas.refuel()

//This class is a violates because the refuel method was forcefully implemented by the child classes where it does n't have any use with that 
// so these classes should obey or in contract with a class that is only having a method called transportable , and seperate interface like rechargeable and refuel so 
// it solves that issue and also we can assign a function that only accepts those certain methods

//? TASK 2:
//?   Design the correct interfaces that fix the LSP violation.
//?   Think: what promise can ALL vehicles keep? What is opt-in?
//?   Hint: You'll need at least 2 interfaces (maybe 3!).

// ── Write your interfaces here ────────────────────────────────

//? ✅ REVIEW: GoodVehicle base class — CORRECT LSP thinking!
//?    You isolated the ONE promise ALL vehicles can keep: TransportStudents.
//?    This is exactly the "weakest promise" pattern LSP requires.
//? ⚠️  MINOR ISSUE: throwing in the base class body works but an abstract class
//?    is more idiomatic TypeScript — `abstract class GoodVehicle { abstract TransportStudents(): void }`
//?    That way TypeScript itself prevents you from doing `new GoodVehicle()` (see line ~292).
abstract class GoodVehicle{
   abstract TransportStudents():void
}

//? ✅ REVIEW: interface Rechargable — CORRECT!
//?    You correctly made recharging opt-in. Only electric vehicles implement this.
//? ⚠️  TYPO: "Rechargable" should be "Rechargeable" (missing an 'e').
interface Rechargable{
    Recharge():void
}

//? ✅ REVIEW: interface Refuel — CORRECT!
//?    Refuelling is also opt-in. Only petrol/diesel vehicles implement this.
//? ⚠️  NAMING: Interface and method share the same name `Refuel` — this is confusing.
//?    Better: rename the interface to `IRefuelable` and keep the method as `refuel()`.
interface Refuelable{
    Refuel():void
}

//? ✅ REVIEW: GoodElectricCar — CORRECT LSP!
//?    Extends GoodVehicle → honours TransportStudents ✅
//?    Implements Rechargable → honestly declares it can recharge ✅
//?    Does NOT implement Refuel → no forced lies ✅
//?    LSP GOLDEN TEST → Can GoodElectricCar replace GoodVehicle everywhere? YES ✅
class GoodElectricCar extends GoodVehicle implements Rechargable{
    TransportStudents(): void {
        console.log("Ya Iam a good electric and luxurious car I can transport children")
    }
    Recharge(): void {
        console.log("Iam so happy that 😅😅😅 I am save petrol")
    }
}

//? ✅ REVIEW: GoodVan — CORRECT LSP!
//?    Extends GoodVehicle → honours TransportStudents ✅
//?    Implements Refuel → honestly declares it can refuel ✅
//?    Does NOT implement Rechargable → no forced lies ✅
//?    LSP GOLDEN TEST → Can GoodVan replace GoodVehicle everywhere? YES ✅
class GoodVan extends GoodVehicle implements Refuelable{
    TransportStudents(): void {
        console.log("Ya Iam a good electric van I can transport children")
    }
    Refuel(): void {
        console.log("Iam running with petrol")
    }
}

//? ✅ REVIEW: Hybrid — CORRECT LSP & BONUS thinking!
//?    You realized a Hybrid can BOTH refuel AND recharge — excellent real-world modeling!
//?    Extends GoodVehicle → honours TransportStudents ✅
//?    Implements both Refuel and Rechargable → honest, no surprises ✅
//?    LSP GOLDEN TEST → Can Hybrid replace GoodVehicle everywhere? YES ✅
//? ⚠️  SPACING: minor indentation inconsistency inside the class body (cosmetic only)
class Hybrid extends GoodVehicle implements Refuelable,Rechargable{
       TransportStudents(): void {
        console.log("Ya Iam a good electric van I can transport children")
    }
    Refuel(): void {
        console.log("Iam running with petrol")
    }

     Recharge(): void {
        console.log("Iam so happy that 😅😅😅 I am save petrol")
    }
}


//? ✅ REVIEW: TransportStudents function — CORRECT LSP usage!
//?    Accepts GoodVehicle → any subtype (GoodElectricCar, GoodVan, Hybrid) can be passed ✅
//?    The base contract is honoured by ALL subtypes → perfect substitutability ✅
function TransportStudents(vehicleType:GoodVehicle){
    vehicleType.TransportStudents()
}

TransportStudents(new GoodElectricCar)  // ✅ works — LSP safe
TransportStudents(new GoodVan)          // ✅ works — LSP safe

//? TASK 3:

//?   Create a `SchoolBus` class using your interfaces.
//?   It can transport students AND refuel.

// ── Write SchoolBus class here ────────────────────────────────



//? TASK 4:
//?   Create an `ElectricVan` class using your interfaces.
//?   It can transport students AND recharge. But NOT refuel.

// ── Write ElectricVan class here ──────────────────────────────



//? TASK 5:
//?   Create a `Bicycle` class using your interfaces.
//?   It can only transport students. No refuel, no recharge.

// ── Write Bicycle class here ──────────────────────────────────



//? TASK 6 (Bonus):
//?   Write two functions:
//?     - `sendOnTrip(vehicle, count)`  → accepts ANY vehicle (any ITransportable)
//?     - `refuelAtStation(vehicle, litres)` → only accepts refuelable vehicles
//?
//?   Call sendOnTrip() with all three vehicles — all should work fine.
//?   Call refuelAtStation() with SchoolBus only — should compile fine.
//?   Try passing ElectricVan or Bicycle to refuelAtStation() in a comment
//?   and note why TypeScript stops you. That's LSP at work!

// ── Write your functions and calls here ───────────────────────



//? ============================================================
//? 💡 KEY INSIGHT — LSP in one line
//? ============================================================
//?
//? LSP VIOLATION tells you: "Your inheritance hierarchy is a lie."
//? The child claims to be a Parent, but can't honour the Parent's promise.
//?
//? The Liskov Fix is almost always the same recipe:
//?   1. Find the WEAKEST promise that ALL subtypes can keep → base interface
//?   2. Move STRONGER promises (refund, refuel, recharge) into opt-in interfaces
//?   3. Each class implements ONLY what it can truly honour
//?   4. Functions that need the stronger promise → accept the specific interface
//?      TypeScript will reject invalid substitutions at COMPILE TIME — not at runtime!
//?
//? Relation to ISP (previous lesson):
//?   ISP  ➜ "Don't force a class to implement methods it doesn't need."
//?   LSP  ➜ "Don't pretend a class supports behaviour it can't honour."
//?   Both principles guide you toward the same solution: smaller, honest contracts.
//?
//? Remember the golden test anytime you use inheritance:
//?   ❓ "Can I substitute every child for its parent without any breakage?"
//?   ✅ Great — LSP is safe.
//?   ❌ Child throws errors or silently ignores? — Fix the hierarchy!
