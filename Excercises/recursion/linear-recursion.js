//Write a function that calculates the factorial of a non-negative integer using linear recursion.

// function factorial (n){
// if(n<=1)return 1
// return n * factorial(n-1)
// }

// console.log(factorial(2))

//sum of an array
    // let arr = [1,1,1,1,2]
    // function SumUsingRecursion(array){
    // if(array.length<=0)return 0
    
    // return array[0]+ SumUsingRecursion(array.slice(1))
    // }
    // console.log(SumUsingRecursion(arr))

//    

//write a function to reverse a string "hello" using linear recursion

// let str = "hello"
// function reverseString(s,length=s.length-1){
//     if(length==0)return s[0]
//     if(length<0)return ""
//     return s[length]+reverseString(s,length-1)
// }
// console.log(reverseString("str"))

//Binary search

let array = [5,6,7,8,9]

function BinarySearch(target,arr,start = 0,end = arr.length){
if(start>end)return -1
let mid = Math.floor((start+end)/2)
 if(arr[mid]==target)return mid
if(arr[mid]>target) return BinarySearch(target,arr,start,end = mid-1)
else return BinarySearch(target,arr,start = mid+1,end)
}
console.log(BinarySearch(6,array))