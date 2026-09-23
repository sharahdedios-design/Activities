class Apple{
    #prop1 = 5;
    constructor(par)
    {
        this.#prop1 = par;
        console.log(this.#prop1);
    }
}

let grapes = new Apple(11);