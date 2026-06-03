
export {} // Makes this file a module → private scope, no global conflicts

//? ============================================================
//? SOLID — CAPSTONE EXERCISE: Authentication System
//? All 5 Principles in ONE real-world scenario
//? ============================================================
//?
//? You have learned all 5 SOLID principles:
//?   S — Single Responsibility Principle (SRP)
//?   O — Open/Closed Principle           (OCP)
//?   L — Liskov Substitution Principle   (LSP)
//?   I — Interface Segregation Principle (ISP)
//?   D — Dependency Inversion Principle  (DIP)
//?
//? Now we test ALL of them together in ONE system.
//?
//? Scenario: BrotoAcademy — User Authentication System
//?
//?   BrotoAcademy has three types of users who can log in:
//?     1. Admin   → logs in via Email + Password, can manage users
//?     2. Mentor  → logs in via Email + Password, has a specialisation
//?     3. Student → logs in via Email + OTP (one-time password)
//?
//?   The system must:
//?     a) Validate credentials (different strategy per user type)
//?     b) Generate a session token after successful login
//?     c) Log every login attempt (success or failure)
//?     d) Send a welcome notification after login
//?
//? A junior developer crammed ALL of this into ONE god-class.
//? We will study the violation, then build the correct SOLID design,
//? then you will practice each principle on your own.
//?
//? ─────────────────────────────────────────────────────────────────────────


// ══════════════════════════════════════════════════════════════
//  SHARED DATA TYPES  (used by both the bad and good designs)
// ══════════════════════════════════════════════════════════════

type UserRole = "admin" | "mentor" | "student"

interface UserRecord {
    id       : string
    email    : string
    role     : UserRole
    password?: string            // Admin & Mentor use password
    otp?    : string             // Student uses OTP
    specialisation?: string      // Mentor only
}

// ── A fake "database" of registered users ──────────────────────
const fakeDB: UserRecord[] = [
    { id: "u1", email: "admin@broto.com",    role: "admin",   password: "admin123" },
    { id: "u2", email: "mentor@broto.com",   role: "mentor",  password: "mentor456", specialisation: "JavaScript" },
    { id: "u3", email: "student@broto.com",  role: "student", otp: "998877" },
]



//? ============================================================
//? ❌ STEP 1 — THE VIOLATION (read carefully — spot all 5 sins)
//? ============================================================
//?
//? BadAuthSystem violates EVERY SOLID principle at once:
//?
//?  ❌ SRP — One class handles: credential validation, token generation,
//?            logging, notification, AND role-checking.
//?            → 5+ reasons to change inside ONE class.
//?
//?  ❌ OCP — To add a new role (e.g. "parent"), you MUST edit login().
//?            → The class is NOT closed for modification.
//?
//?  ❌ LSP — Would not safely substitute any derived login type
//?            because all logic is hard-coded inside one method.
//?
//?  ❌ ISP — The class forces every caller to depend on ALL methods
//?            (validate, tokenise, log, notify) even if they only
//?            need one. A fat, undivided interface.
//?
//?  ❌ DIP — BadAuthSystem directly creates "console.log" style
//?            infrastructure inside itself — high-level business logic
//?            depends on low-level implementation details.

class BadAuthSystem {

    //? ❌ SRP sin: validates credentials, generates tokens, logs, AND notifies
    //? ❌ OCP sin: every new role = new if/else branch = modifying this method
    login(email: string, credential: string, role: UserRole): void {

        // --- Credential validation (should be its own class) ----
        //? ❌ DIP sin: directly coupled to fakeDB detail
        const user = fakeDB.find(u => u.email === email && u.role === role)

        if (!user) {
            console.log(`[LOG] ❌ FAILED login for ${email} — user not found`)
            return
        }

        let isValid = false

        //? ❌ OCP sin: adding "parent" role means editing RIGHT HERE
        if (role === "admin" || role === "mentor") {
            isValid = user.password === credential
        } else if (role === "student") {
            isValid = user.otp === credential
        }

        if (!isValid) {
            //? ❌ SRP sin: logging is NOT this class's job
            console.log(`[LOG] ❌ FAILED login for ${email} — wrong credential`)
            return
        }

        //? ❌ SRP sin: token generation is NOT this class's job
        const token = `TOKEN-${user.id}-${Date.now()}`
        console.log(`[LOG] ✅ SUCCESS login for ${email}`)

        //? ❌ SRP sin: notification is NOT this class's job
        if (role === "admin") {
            console.log(`[NOTIFY] Welcome back, Admin ${email}! You have full access.`)
        } else if (role === "mentor") {
            //? ❌ OCP sin: mentor-specific logic hard-coded here
            console.log(`[NOTIFY] Welcome, Mentor ${email}! Your specialisation: ${user.specialisation}`)
        } else if (role === "student") {
            console.log(`[NOTIFY] Welcome, Student ${email}! Check your dashboard.`)
        }

        console.log(`[SESSION] Token issued: ${token}`)
    }

    //? ❌ ISP sin: token & notification methods are forced on all consumers
    //? even when they only need credential checks.
    generateToken(userId: string): string {
        return `TOKEN-${userId}-${Date.now()}`
    }

    sendNotification(email: string, message: string): void {
        console.log(`[NOTIFY] To: ${email} — ${message}`)
    }
}

//? Demonstration of the violation:
console.log("❌ ─── BadAuthSystem (SOLID Violation) ───────────────────────")
const badAuth = new BadAuthSystem()
badAuth.login("admin@broto.com",   "admin123", "admin")
badAuth.login("mentor@broto.com",  "mentor456", "mentor")
badAuth.login("student@broto.com", "998877",    "student")
badAuth.login("hacker@evil.com",   "wrong",     "admin")   // should fail



//? ============================================================
//? ✅ STEP 2 — THE SOLID DESIGN (study each piece carefully)
//? ============================================================
//?
//? We will now rebuild the same system respecting all 5 principles.
//? Notice how every class has exactly ONE job, and every dependency
//? flows through an interface — never a concrete class.
//?
//? Architecture overview:
//?
//?   ICredentialValidator  ← OCP/LSP/ISP: one method, many implementations
//?     ├── PasswordValidator  (used by Admin & Mentor)
//?     └── OtpValidator       (used by Student)
//?
//?   ITokenService         ← DIP: high-level code depends on this, not impl
//?     └── JwtTokenService
//?
//?   ILoginLogger          ← SRP: logging is its own concern
//?     └── ConsoleLoginLogger
//?
//?   IWelcomeNotifier      ← SRP + ISP: notification is its own concern
//?     ├── AdminWelcomeNotifier
//?     ├── MentorWelcomeNotifier
//?     └── StudentWelcomeNotifier
//?
//?   IUserRepository       ← DIP: data access behind an abstraction
//?     └── InMemoryUserRepository
//?
//?   AuthService           ← the thin coordinator, depends ONLY on interfaces
//?
//? ─────────────────────────────────────────────────────────────────────────


// ── 1. ICredentialValidator ───────────────────────────────────
//? ISP: the interface is deliberately SMALL — one method, one job.
//? OCP: AuthService is closed; new auth strategies just implement this.
//? LSP: every implementation must honestly validate credentials.

interface ICredentialValidator {
    //? Takes the stored user record and the credential the user typed.
    //? Returns true if the credential is correct, false otherwise.
    validate(user: UserRecord, credential: string): boolean
}

//? ✅ PasswordValidator — used by Admin and Mentor
class PasswordValidator implements ICredentialValidator {
    validate(user: UserRecord, credential: string): boolean {
        //? LSP: returns a plain boolean — honouring the contract exactly
        return user.password === credential
    }
}

//? ✅ OtpValidator — used by Student
class OtpValidator implements ICredentialValidator {
    validate(user: UserRecord, credential: string): boolean {
        //? LSP: same contract, different internal logic — substitutable ✅
        return user.otp === credential
    }
}


// ── 2. ITokenService ──────────────────────────────────────────
//? DIP: AuthService depends on this ABSTRACTION, not on JwtTokenService.
//? Swapping JWT for a session cookie later? Just swap the implementation.

interface ITokenService {
    generate(userId: string): string
}

//? ✅ Simulates JWT token generation (no real crypto needed for this exercise)
class JwtTokenService implements ITokenService {
    generate(userId: string): string {
        //? In real life: jwt.sign({ userId }, SECRET, { expiresIn: "1h" })
        return `JWT.${(userId).toString()}.${Date.now()}`
    }
}


// ── 3. ILoginLogger ───────────────────────────────────────────
//? SRP: logging is its OWN concern; AuthService does not log directly.
//? DIP: AuthService depends on ILoginLogger, not ConsoleLoginLogger.

interface ILoginLogger {
    logSuccess(email: string, role: UserRole): void
    logFailure(email: string, reason: string): void
}

//? ✅ ConsoleLoginLogger — logs to terminal (swap to FileLogger or DBLogger easily)
class ConsoleLoginLogger implements ILoginLogger {
    logSuccess(email: string, role: UserRole): void {
        console.log(`[LOG] ✅ SUCCESS — ${role.toUpperCase()} | ${email}`)
    }
    logFailure(email: string, reason: string): void {
        console.log(`[LOG] ❌ FAILED  — ${email} | Reason: ${reason}`)
    }
}


// ── 4. IWelcomeNotifier ───────────────────────────────────────
//? ISP: only one method. Each role gets its OWN notifier class.
//? OCP: adding a "ParentWelcomeNotifier" → new class, no existing edits.
//? SRP: AuthService does NOT write notification messages — it delegates.

interface IWelcomeNotifier {
    notify(user: UserRecord): void
}

//? ✅ Admin notifier
class AdminWelcomeNotifier implements IWelcomeNotifier {
    notify(user: UserRecord): void {
        console.log(`[NOTIFY] 🛡️  Welcome back, Admin ${user.email}! Full system access granted.`)
    }
}

//? ✅ Mentor notifier — knows about specialisation (its own concern)
class MentorWelcomeNotifier implements IWelcomeNotifier {
    notify(user: UserRecord): void {
        console.log(`[NOTIFY] 🎓 Welcome, Mentor ${user.email}! Specialisation: ${user.specialisation ?? "General"}`)
    }
}

//? ✅ Student notifier
class StudentWelcomeNotifier implements IWelcomeNotifier {
    notify(user: UserRecord): void {
        console.log(`[NOTIFY] 📚 Welcome, Student ${user.email}! Head to your dashboard.`)
    }
}


// ── 5. IUserRepository ────────────────────────────────────────
//? DIP: AuthService fetches users through this interface.
//? In production you'd swap InMemoryUserRepository with MongoUserRepository.

interface IUserRepository {
    findByEmailAndRole(email: string, role: UserRole): UserRecord | undefined
}

//? ✅ InMemoryUserRepository — backed by our fakeDB array
class InMemoryUserRepository implements IUserRepository {
    findByEmailAndRole(email: string, role: UserRole): UserRecord | undefined {
        return fakeDB.find(u => u.email === email && u.role === role)
    }
}


// ── 6. AuthService — the thin SOLID coordinator ───────────────
//? SRP: its ONLY job is to orchestrate the login flow.
//? DIP: depends on FIVE interfaces — never on concrete classes.
//? OCP: adding a new role? Create new validator + notifier → zero edits here.
//? All collaborators are injected via constructor (Dependency Injection).

class AuthService {
    constructor(
        private userRepository : IUserRepository,
        private validator      : ICredentialValidator,
        private tokenService   : ITokenService,
        private logger         : ILoginLogger,
        private notifier       : IWelcomeNotifier
    ) {}

    //? The login flow has EXACTLY ONE reason to change:
    //? the orchestration logic itself. Everything else is delegated. ✅
    login(email: string, credential: string, role: UserRole): string | null {

        // Step 1: find the user (delegated to repository)
        const user = this.userRepository.findByEmailAndRole(email, role)
        if (!user) {
            this.logger.logFailure(email, "user not found")   // delegate ✅
            return null
        }

        // Step 2: validate the credential (delegated to validator)
        const isValid = this.validator.validate(user, credential) // delegate ✅
        if (!isValid) {
            this.logger.logFailure(email, "wrong credential")     // delegate ✅
            return null
        }

        // Step 3: generate a session token (delegated to token service)
        const token = this.tokenService.generate(user.id)         // delegate ✅

        // Step 4: log the success (delegated to logger)
        this.logger.logSuccess(email, role)                        // delegate ✅

        // Step 5: send welcome notification (delegated to notifier)
        this.notifier.notify(user)                                 // delegate ✅

        return token
    }
}


// ── 7. Wire everything together (Composition Root) ────────────
//? In a real app this lives in your DI container (e.g. NestJS providers).
//? Here we hand-wire for clarity.

const repo    = new InMemoryUserRepository()
const tokenSvc = new JwtTokenService()
const logger  = new ConsoleLoginLogger()

//? Each role gets its own validator + notifier — no if/else in AuthService ✅
const adminAuth = new AuthService(
    repo,
    new PasswordValidator(),       // Admin uses password
    tokenSvc,
    logger,
    new AdminWelcomeNotifier()
)

const mentorAuth = new AuthService(
    repo,
    new PasswordValidator(),       // Mentor uses password
    tokenSvc,
    logger,
    new MentorWelcomeNotifier()
)

const studentAuth = new AuthService(
    repo,
    new OtpValidator(),            // Student uses OTP ✅
    tokenSvc,
    logger,
    new StudentWelcomeNotifier()
)

//? Run the SOLID system:
console.log("\n✅ ─── SOLID AuthService ───────────────────────────────────")

const t1 = adminAuth.login("admin@broto.com",    "admin123",  "admin")
console.log(`[SESSION] Token → ${t1}\n`)

const t2 = mentorAuth.login("mentor@broto.com",  "mentor456", "mentor")
console.log(`[SESSION] Token → ${t2}\n`)

const t3 = studentAuth.login("student@broto.com","998877",    "student")
console.log(`[SESSION] Token → ${t3}\n`)

const t4 = adminAuth.login("hacker@evil.com",    "wrong",     "admin")
console.log(`[SESSION] Token → ${t4}\n`)   // null — login failed ✅



//? ============================================================
//? 📝 YOUR PRACTICE TASKS — Test your SOLID understanding
//? ============================================================
//?
//? Read each task carefully. Implement it BELOW the task comment.
//? Each task targets one specific SOLID principle.
//? Run the file after each task: npx ts-node solidAuthentication.ts
//?
//? ─────────────────────────────────────────────────────────────────────────


//? ─── TASK 1 — SRP ────────────────────────────────────────────
//?
//? Scenario: the academy now wants to track login statistics
//? (total attempts, total successes, total failures) separately
//? from the plain text logging.
//?
//? 🎯 Goal: create a `LoginStatsTracker` class.
//?
//? Rules:
//?   - It must have its OWN responsibility: tracking numbers only.
//?   - It must NOT do any logging or notification.
//?   - Methods: recordAttempt(), recordSuccess(), recordFailure(), getStats()
//?   - getStats() returns: { attempts: number, successes: number, failures: number }
//?
//? Question to answer in a comment: why is this a SEPARATE class and
//? not added as extra methods to ConsoleLoginLogger?
//due to single responsibitlity principle, this is a seperate checking, counting so basically different workflow

// ── Write LoginStatsTracker here ──────────────────────────────

let data = {attemptCount:0,loginCount:0,failureCount:0}
interface IModifyData{
  increment(data:Record<string,number>,element:string):void
}
class ModifyData implements IModifyData{
    increment(data: Record<string, number>,element:string): void {
     data[element]++
    }
}
interface IDataRetrieve {
 getData(doc:Record<string,number>):Record<string,number>
}

class DataRetrieve{
    getData(doc:Record<string,number>):Record<string,number>{
        return doc
    }
}
interface ILoginStatusTracker{
    recordAttempt(data:Record<string,number>,element:string):void
    recordSuccesses(data :Record<string,number>,element: string):void
    recordFailure(data :Record<string,number>,element: string):void
    getStatus(doc:Record<string,number>):Record<string,number>

}
class LoginStatsTracker implements ILoginStatusTracker{
    constructor(
        private _modifyData : IModifyData,
        private _retrieve : IDataRetrieve
    ){}
    recordAttempt(data :Record<string,number>,element: string): void {
        this._modifyData.increment(data,element)
    }
    recordSuccesses(data :Record<string,number>,element: string): void {
        this._modifyData.increment(data,element)
    }

    recordFailure(data :Record<string,number>,element: string): void {
            this._modifyData.increment(data,element)
    }
    
    getStatus(doc: Record<string, number>):Record<string, number> {
       return this._retrieve.getData(doc)
    }
}



//? ─── TASK 2 — OCP ────────────────────────────────────────────
//?
//? Scenario: BrotoAcademy is adding a new user type: "parent".
//? Parents log in using a 6-digit PIN (stored in a `pin` field).
//?
//? 🎯 Goal: add Parent login WITHOUT modifying AuthService or any
//? existing class.
//?
//? Steps:
//?   a) Add a parent user to fakeDB:
//?      { id: "u4", email: "parent@broto.com", role: "parent", pin: "112233" }
//?      (you will need to add "parent" to the UserRole type and add a pin? field to UserRecord)
//?   b) Create class `PinValidator implements ICredentialValidator`
//?   c) Create class `ParentWelcomeNotifier implements IWelcomeNotifier`
//?   d) Wire a new `parentAuth` AuthService using PinValidator + ParentWelcomeNotifier
//?   e) Test: parentAuth.login("parent@broto.com", "112233", "parent")
//?
//? Question to answer in a comment: which existing classes did you
//? have to modify? (The answer should be: NONE.) Why?

// ── Write PinValidator, ParentWelcomeNotifier, parentAuth here ─




//? ─── TASK 3 — LSP ────────────────────────────────────────────
//?
//? Scenario: we want a `StrictOtpValidator` that is like OtpValidator
//? but ALSO checks that the OTP has not expired.
//? (Simulate expiry by adding an `otpExpiry: number` field — timestamp —
//? to UserRecord, and rejecting if Date.now() > otpExpiry.)
//?
//? 🎯 Goal: create `StrictOtpValidator implements ICredentialValidator`.
//?
//? Rules (LSP contract for ICredentialValidator):
//?   ✅ Must return a plain boolean — no throwing errors, no side effects.
//?   ✅ Must return false (not crash) when otpExpiry is missing.
//?   ✅ Must be a drop-in replacement for OtpValidator in studentAuth.
//?
//? Test: create a user whose OTP is correct but otpExpiry is in the past.
//? StrictOtpValidator must return false for that user.
//?
//? Question to answer: if you swap OtpValidator for StrictOtpValidator
//? inside studentAuth, does AuthService need any changes? Why?

// ── Write StrictOtpValidator here ─────────────────────────────




//? ─── TASK 4 — ISP ────────────────────────────────────────────
//?
//? Scenario: some parts of the app only need to check WHETHER a
//? token is valid — they do NOT need to generate tokens.
//? Other parts only need to generate tokens — they do NOT need to verify.
//?
//? 🎯 Goal: split ITokenService into two focused interfaces.
//?
//? Create:
//?   interface ITokenGenerator { generate(userId: string): string }
//?   interface ITokenVerifier  { verify(token: string): string | null }
//?                               // returns userId if valid, null if invalid
//?
//? Then update JwtTokenService to implement BOTH interfaces.
//? Add a simple verify() method: extract the userId from the base64 middle
//? segment and return it (or return null if the token format is wrong).
//?
//? Question to answer: why is it better to have two small interfaces
//? instead of one big ITokenService? Name a real scenario where a class
//? would only need ITokenVerifier and NOT ITokenGenerator.

// ── Write ITokenGenerator, ITokenVerifier, updated JwtTokenService here ──




//? ─── TASK 5 — DIP ────────────────────────────────────────────
//?
//? Scenario: the academy wants to switch from console logs to a
//? database audit log — all login attempts stored in a log table.
//?
//? 🎯 Goal: create `DatabaseLoginLogger implements ILoginLogger`.
//?
//? Rules:
//?   - It must NOT import or inherit from ConsoleLoginLogger.
//?   - Simulate DB writes with:
//?       console.log(`[DB-AUDIT] INSERT INTO login_logs VALUES (...)`)
//?   - Swap ConsoleLoginLogger for DatabaseLoginLogger in ALL three
//?     AuthService instances (adminAuth, mentorAuth, studentAuth).
//?   - AuthService must require ZERO code changes for this swap.
//?
//? Question to answer: the DIP says "high-level modules must not depend
//? on low-level modules — both must depend on abstractions."
//? In our system, identify:
//?   a) the high-level module
//?   b) the low-level module
//?   c) the abstraction that decouples them

// ── Write DatabaseLoginLogger and swap it in below ─────────────




//? ─── TASK 6 — BONUS: All 5 Together ──────────────────────────
//?
//? Scenario: add a completely new login feature — "magic link" login.
//? A user receives an email with a one-click link that contains a token.
//? When they click it, the system validates the magic token and logs them in.
//?
//? 🎯 Goal: implement magic-link login for Students ONLY,
//? without modifying AuthService, ICredentialValidator, or any existing class.
//?
//? Steps:
//?   a) Add magicToken?: string to UserRecord and one student entry.
//?   b) Create `MagicLinkValidator implements ICredentialValidator`
//?   c) Create `MagicLinkNotifier implements IWelcomeNotifier`
//?   d) Wire a new `magicLinkAuth` AuthService.
//?   e) Test a valid and an invalid magic-link login.
//?
//? Checklist — tick each principle you applied:
//?   [ ] SRP — MagicLinkValidator only validates; MagicLinkNotifier only notifies
//?   [ ] OCP — you added new classes, never edited AuthService
//?   [ ] LSP — MagicLinkValidator returns boolean, no exceptions, no surprises
//?   [ ] ISP — you used ICredentialValidator and IWelcomeNotifier (small interfaces)
//?   [ ] DIP — AuthService received both via constructor injection

// ── Write magic-link implementation here ──────────────────────




//? ============================================================
//? 💡 KEY INSIGHT — All 5 Principles in one view
//? ============================================================
//?
//? Look at our finished AuthService and notice how each principle
//? plays its role in making the system flexible and safe:
//?
//?  S — SRP:
//?      AuthService has ONE job: orchestrate the login pipeline.
//?      Validation, tokenising, logging, notifying → each in its OWN class.
//?      Change the token format? Touch ONLY JwtTokenService.
//?      Change the log format? Touch ONLY ConsoleLoginLogger.
//?
//?  O — OCP:
//?      Adding Parent, Magic-Link, or Biometric login?
//?      Create NEW classes → AuthService is NEVER touched.
//?      The "plugin socket" is ICredentialValidator.
//?
//?  L — LSP:
//?      OtpValidator and PasswordValidator are 100% substitutable.
//?      AuthService.login() works identically regardless of which
//?      ICredentialValidator it receives — no special cases, no `instanceof`.
//?
//?  I — ISP:
//?      ICredentialValidator → 1 method.
//?      ITokenService        → 1 method.
//?      ILoginLogger         → 2 focused methods (success + failure).
//?      IWelcomeNotifier     → 1 method.
//?      No implementation is forced to write empty stubs. ✅
//?
//?  D — DIP:
//?      AuthService depends on FIVE interfaces.
//?      It knows nothing about InMemoryUserRepository, JwtTokenService,
//?      ConsoleLoginLogger, or any concrete class.
//?      Swap any piece → AuthService never changes. That is DIP. ✅
//?
//? ─────────────────────────────────────────────────────────────
//?
//? The golden questions to ask yourself EVERY time you write a class:
//?
//?   SRP → "Does this class have more than ONE reason to change?"
//?   OCP → "Can I add this feature without editing existing code?"
//?   LSP → "Can I swap this subtype without surprising the caller?"
//?   ISP → "Am I forcing consumers to depend on methods they don't use?"
//?   DIP → "Is my high-level logic married to a low-level detail?"
//?
//? If any answer is YES — refactor before you commit. 🚀
