//Write a function that calculates the factorial of a non-negative integer using linear recursion.

function factorial (n){
if(n<=1)return 1
return n * factorial(n-1)
}

console.log(factorial(2))