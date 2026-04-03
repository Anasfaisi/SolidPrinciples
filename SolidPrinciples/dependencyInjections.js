//? Dependency Injection

//? Tight Coupling

// class Database{
//     save(data){
//         console.log("Saving data to database",data)
//     }
// }
// class UserService{
//     constructor(){
//         this.database = new Database()
//     }
//     createUser(user){
//         this.database.save(user)
//     }
// }
// const userService = new UserService()
// userService.createUser({name:"John",email:"[EMAIL_ADDRESS]"})

//? Loose Coupling

// class MentorshipProgram{

//     constructor(mentor,student){
//         this.mentor= mentor;
//         this.student = student
//     }
//     SettingMenteeAndMentor(){

//         console.log(`The mentor for the student ${this.student.name} in ${this.student.standard} is ${this.mentor.name} for the subject ${this.mentor.subject}`)
//     }
// }
// class Mentor{
//     constructor(name,subject){
//         this.name = name
//         this.subject = subject
//     }
// }

// class Student{
//     constructor(name,standard){
//         this.name = name,
//         this.standard = standard
//     }
// }

// const productivityCourse = new MentorshipProgram(new Mentor('Ajith','productivity'),new Student('anas',10))
// productivityCourse.SettingMenteeAndMentor()



//? Dependency inversion 
//-The high level modules shouldn't depend on low level modules both should depend on abstraction

class PostgresDatabase {
  saveUser(user) {
    console.log(`Saving ${user} to Postgres...`);
  }

}


  class Mongodb{
    saveUser(user){
        console.log("This is to mock you "+ user)
    }
  }

class UserSignup {
  constructor(db) {
    // Problem: The high-level module creates its own dependency.
    // It is "tightly coupled" to Postgres.
    this.database = db; 
  }

  execute(name) {
    this.database.saveUser( name );
  }
}

const signup = new UserSignup( new PostgresDatabase);
const signup2 = new UserSignup(new Mongodb)
signup.execute("Alice");
signup2.execute("Anas")

// njn ippo abstraction aanlo indkandath, abstraction nn paranja oru class aa class ll implementation indavarth ennal declaration indavanm
//user signup oru interface indaakiyaal 