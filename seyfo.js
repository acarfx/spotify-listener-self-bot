class Human {
    constructor(opt) {
        this.nick = opt.nick;
        this.token = opt.token || false;
    }

    check() {
      
        if(this.token) {
            console.log(`${opt.nick} - Ben vallaha tokenim.`);
        } else {
            console.log(`${opt.nick} - Ben token değilim!`);
        }
      
    }
  
}

const Seyfo = new Human({
  nick: "Seyfooksck",
  token: false
})

Seyfo.check();
