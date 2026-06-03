//? ============================================================
//? SOLID — D : Dependency Inversion Principle (DIP)
//? ============================================================
//?
//? Rule 1: High-level modules should NOT depend on low-level modules.
//? Rule 2: Both should depend on ABSTRACTIONS (contracts).
//?
//? Scenario: MountSeena School
//?   A school sends notifications to parents when:
//?     - A student gets a grade
//?     - A student is absent
//?   Right now it only supports Email. Tomorrow they may add SMS, WhatsApp.
//?


//? ============================================================
//? ❌ STEP 1 — WITHOUT DIP (Tight Coupling — study this)
//? ============================================================

class EmailService {
    sendEmail(parent, message) {
        console.log(`📧 Email to ${parent}: ${message}`)
    }
}

class NotificationManager {
    constructor() {
        // ❌ High-level class creates its own low-level dependency
        // ❌ If you want SMS tomorrow, you must CHANGE this class
        this.emailService = new EmailService()
    }

    notifyGrade(student, grade) {
        this.emailService.sendEmail(student.parentContact, `${student.name} scored ${grade}`)
    }

    notifyAbsence(student) {
        this.emailService.sendEmail(student.parentContact, `${student.name} was absent today`)
    }
}

//? Problem:
//? - NotificationManager is LOCKED to EmailService
//? - To add SMS you have to modify NotificationManager (violates Open/Closed too!)
//? - You can't test NotificationManager without actually sending emails


//? ============================================================
//? ✅ STEP 2 — WITH DIP (Your task — fill in the blanks)
//? ============================================================

//? TASK 1:
//? Create a "contract" — all notifiers MUST have a send(contact, message) method
//? In JS we simulate this with a base class that throws if not implemented

class Notifier {
    send(contact, message) {
        // this acts as the "interface" / contract
        throw new Error(`${this.constructor.name} must implement send()`)
    }
}


//? TASK 2:
//? Create EmailNotifier that EXTENDS Notifier and implements send()

class EmailNotifier extends Notifier {
     send(contact, message) {
        console.log(`📧 Email to ${contact}: ${message}`)
    }
}


//? TASK 3:
//? Create SMSNotifier that EXTENDS Notifier and implements send()

class SMSNotifier extends Notifier {
    send(contact, message) {
        console.log(`🖥️  SMS to ${contact}: ${message}`)
    }
}


//? TASK 4:
//? Create WhatsAppNotifier that EXTENDS Notifier and implements send()

class WhatsAppNotifier extends Notifier {
  send(contact, message) {
        console.log(`📜 Whatsapp to ${contact}: ${message}`)
    }

}


//? TASK 5:
//? Fix NotificationManager to depend on the ABSTRACTION (Notifier),
//? not on a specific EmailService.
//? The notifier should be INJECTED from outside (combine DI + DIP!)

class SchoolNotificationManager {
    constructor(notifier) {
        this.notificator = notifier

    }

    notifyGrade(student, grade) {
        this.notificator.send(student.parentContact,`${student.name} scored ${grade}`)
    }

    notifyAbsence(student) {
        this.notificator.send(student.parentContact,`${student.name} was absent today`)

    }
}


//? TASK 6:
//? Use SchoolNotificationManager with all 3 notifiers below
//? Observe: SchoolNotificationManager code never changes — only what you inject does!

const riya   = { name: "Riya",  parentContact: "riya_mom@gmail.com" }
const arjun  = { name: "Arjun", parentContact: "9876543210" }
const fatima = { name: "Fatima",parentContact: "wa:9123456780" }

// With Email
const emailManager = new SchoolNotificationManager(new EmailNotifier)
emailManager.notifyGrade(riya, "A+")

// With SMS
const smsManager = new SchoolNotificationManager(new SMSNotifier)
smsManager.notifyAbsence(arjun)

// With WhatsApp
const waManager = new SchoolNotificationManager(new WhatsAppNotifier)
waManager.notifyGrade(fatima, "B+")


//? ============================================================
//? 💡 KEY INSIGHT — What changed?
//? ============================================================
//?
//? ❌ Before DIP:   NotificationManager → EmailService
//?                  (high-level directly depends on low-level)
//?
//? ✅ After DIP:    NotificationManager → Notifier (contract)
//?                  EmailNotifier      → Notifier (contract)
//?                  SMSNotifier        → Notifier (contract)
//?
//? Both high-level AND low-level now depend on the abstraction.
//? That's the INVERSION — the contract is in charge, not the concrete class.
//?
