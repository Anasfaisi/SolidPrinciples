class Maths {
    #marks;

    constructor(mark){
        this.#marks = mark
    }
    get mark(){
       return this.#marks 
    }

    set mark(value){
        if(value>0){
            this.#marks= value
        }else {
            return "invalid mark"
        }
    }
}

let a = new Maths(10)
console.log(a.mark)
a.mark = 20
console.log(a.mark)