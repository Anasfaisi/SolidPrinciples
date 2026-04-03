// let arr=[2,0,1,10,5,3,7,6]
//? function stackSort(arr){
//   let tempArray=[]
//   while(arr.length>0){
//     let temp= arr.pop()
//     while(tempArray.length>0 && tempArray[tempArray.length-1]>temp){
//       arr.push(tempArray.pop())
//     }
//     tempArray.push(temp)
//   }
//   return tempArray
// }
// console.log(stackSort(arr));


// let result = [0,1]
// function fib(n){
//   let a=0
//   let b=1
//   for (let i = 0; i <n; i++) {
//     let temp=a+b
//     a=b
//     b=temp
//   }
//   return a
// }
// console.log(fib(100))
// console.log(result);




//? import express from "express"
// import fs from "fs"
// const app = express()
// app.get("/",(req,res)=>{
//   res.send("Hi it is working")

// })
// let date = new Date()

// app.use((req,res,next)=>{
// fs.appendFile("logger.txt",`\n ${req.method} / ${req.url} current time = ${date.toISOString()}`,(error)=>{
//   console.log(error)
// })
// })
// app.listen(4000,()=>console.log("http://localhost:4000/"))

// const express = require("express");
// const app = express();

// const PORT = 3000;

// // Main data (10 objects)
// const data = {
//   1: { id: 1, name: "Item 1", price: 100, category: "A" },
//   2: { id: 2, name: "Item 2", price: 200, category: "B" },
//   3: { id: 3, name: "Item 3", price: 300, category: "A" },
//   4: { id: 4, name: "Item 4", price: 400, category: "C" },
//   5: { id: 5, name: "Item 5", price: 500, category: "B" },
//   6: { id: 6, name: "Item 6", price: 600, category: "A" },
//   7: { id: 7, name: "Item 7", price: 700, category: "C" },
//   8: { id: 8, name: "Item 8", price: 800, category: "B" },
//   9: { id: 9, name: "Item 9", price: 900, category: "A" },
//   10:{ id:10, name: "Item 10", price: 1000, category: "C" }
// };

// // Route: get full object
// app.get("/", (req, res) => {
//   res.json(data);
// });

// // Route: get single object by id
// app.get("/:id", (req, res) => {
//   const id = req.params.id;

//   if (!data[id]) {
//     return res.status(404).json({ message: "Item not found" });
//   }

//   res.json(data[id]);
// });

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });


//? function stacksort(arr){

//   let result = []

//   while(arr.length>0){
//   let temp = arr.pop()
//   while(result.length>0&&result[result.length-1]>temp){
//      arr.push(result.pop())
//   }
//    result.push(temp)
// }
// return result
// }
// console.log(stacksort([2,0,1,10,5,3,7,6]))

// function fibonacci(n){
//   if(n==0)return 0
//   if(n==1)return 1
//   return fibonacci(n-1)+fibonacci(n-2)
// }

// console.log(fibonacci(5))

// function fib(n){
//   let a = 0;
//   let b = 1 ;
//   let temp = a+b
//   let i =2
//   while(i<n){
//     a=b
//     b=temp
//     temp = a+b
//     i++
//   }
//   return temp

// }
// console.log(fib(10))