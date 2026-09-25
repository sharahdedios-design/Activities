class Android{
    constructor(phone){
        this.phone = phone;
    }
    playgame(){
      console.log(this.phone, "is playing games.");
    }
    
    makeacall(){
        console.log(this.phone, "is making a call.");
    }
}

class Iphonne extends Android{
    takeselfie(){
        console.log(this.phone, "iphone has a good camera.");
    }
    expensive(){
        console.log(this.phone, "iphone is a expensive phone.");
    }
}

const myphone = new Android ("Vivo19s");
myphone.makeacall();
myphone.playgame();