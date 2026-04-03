//js
//? Find the first non-repeating character in the array

let array = ["a",'n','a','s']

// for(let i =0;i<array.length;i++){
    //     if(array.indexOf(array[i])==array.lastIndexOf(array[i])){
        //         console.log(array[i])
        //         return 
        //     }
        // }
        
        
//? - weak ref 


// let user1 = {id:2,name:"anas"}
// const session = new WeakRef(user1)
// console.log(session.deref())
// user1 = null


//?weakMap
// const sessionData = new WeakMap()

// let user = {Id : 1}
// sessionData.set(user,{lastLogin : Date.now()})

// console.log(sessionData.get(user))


//? - Symbol
// let a = Symbol("anas")
// let b = Symbol("anas")
// console.log(a==b)
// console.log(a===b)

// let obj ={}

// obj[Symbol("name")] = "anas";
// obj["name"]="anju"
// for(let key in obj){
//     console.log(key,obj[key])
// }
// console.log(Object.keys(obj))
// console.log(Object.getOwnPropertySymbols(obj))

// let a = Symbol()
// let b = Symbol()
// console.log(a===b)
// a=10
// b=10
// console.log(a===b)

//? - encapsulation in OOP
// class Naming{
//     #name 
//     constructor(name){
//         this.#name = name
//     }
//     get getName(){
//         return this.#name
//     }
//     set setName(newName){
//         this.#name = newName
//     }

// }

// let person = new Naming("anas")

// console.log(person.getName)
// person.setName= "anju"
// console.log(person.getName)

// console.log(person.getName())
// person.setName("anzil")
// console.log(person.getName())


/// with constructor function
// function Person(name) {
// this.name = name;
// this.getName = function () {
// return this.name;
// };
// this.setName = function (newName) {
// this.name = newName;
// };
// }
// const person = new Person('joh doe');
// console.log(person.getName()); // outputs ‘John Doe’
// person.setName('Jane Doe');
// console.log(person.name); // outputs ‘Jane Doe’

//? polymorphism  method overriding (runtime polymorphism)

// class Animal{
//     speak(){
//         console.log("creates some random sounds")
//     }
// }
// class Cat extends Animal{
//     speak(){
//         console.log("Cat makes meow")
//     }
// }
// class Dog extends Animal{
//     speak(){
//         console.log("Dog Barks")
//     }
// }

// let animals = [new Animal(),new Dog(),new Cat()]

// animals.forEach((a)=>a.speak())

//? compile time polymorphism

// class Person{
//     constructor(name,age){
//         this.name = name,
//         this.age = age
//     }
//     display(){
//         console.log(`${this.name} , ${this.age}`)
//     }
// }

// class Person2 extends Person{
//     constructor(place){
//         super()
//         this.place = place
//     }
//     display(){
//         console.log(`${this.name} ${this.age}  ${this.place} `)
//     }
// }
// // let anju = new Person("anas")
// // anju.display()
// let anas = new Person2("hari",22,"otp")
// anas.display()

// class MathOps {
//   add(...args) {
//    if(args.length ==2){
//     return args[0]+args[1]
//    }
  
//    if(args.length ==3){
//     return args[0]+args[1]+args[2]
//    }
//   }
// }

// let a = new MathOps()
// console.log(a.add(4,5,1))


// - minutes passed since the beginning of the day 

// function minutesSinceStartOfDay() {
//   const now = new Date();
//   return now.getHours()*60 + now.getMinutes()
// }

// console.log(minutesSinceStartOfDay())
// - deep copy object (no builtins)
// - construct middle name array from person objects, with proper string cleanup and formatting (needs improvement)
// null pointer exception
//? rest operator
// const { a, ...rest } = { a: 1, b: 2, c: 3 };
// console.log(rest)


// polyfills
let arrays =[1,2,3,4]

// Array.prototype.myMaps = function (callback){
//     const  result = []

//     for(let i =0;i<this.length;i++){
//     result.push(callback(this[i],i,this))
//     }
//     return result
// }

// let answer =arrays.myMaps((map)=>map+2)
// console.log(answer,"asdjf")

//? constructor function


//node
// Default vs named exports
// Merge array alternatively
// latest ES
// app.locals
// router chaining
// rate limiting
// set header
// token introspection
// API versioning
// - httpOnly cookies 
// - types of routers 
// - socket 
// - roles of reverse proxy
// - subdomains 
// - starvation

//DSA
// Graph basic implementation
class Graph{
    constructor(){
        this.adjList = {}
    }
    addVertex(v){
        this.adjList[v]= []
    }
    addEdge(v1,v2){
        this.adjList[v1].push(v2)
        this.adjList[v2].push(v1)
    }
}

// Queue implementation using Stack - refer more
// degenerate binary tree
// open addressing
// separate chaining
// monotonic queue
// monotonic stack



//DB
// materialized views
// covered query
// clustered collection
// write concern
// read concern
// - practice more regex
// - orders with at least two items 



//React
// Limitations of redux- refer more
// Outlet
// - why are states called immutable if they can be changed 
// - React.StrictMode 
// react drawbacks
// rules of using hooks
// forwardRef
// error boundary
// props lifting
// - jpeg vs png
// - svg
// - why key prop shouldn’t be array index




