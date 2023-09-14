class Human {
    constructor(opt) {
        this.nick = opt.nick;
        this.token = opt.token || false;
    }

    check() {
      
        if(this.token) {
            console.log(`${this.nick} - Ben vallaha tokenim.`);
        } else {
            console.log(`${this.nick} - Ben token değilim!`);
        }
      
    }
  
}

const Seyfo = new Human({
  nick: "Seyfooksck",
  token: false
})

Seyfo.check();
// Ben token değilim 
