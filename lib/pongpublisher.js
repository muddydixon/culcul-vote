"use strict";

const uuid = require("uuid");
const mqtt = require("mqtt");
const Fs = require("fs");

const options = {};
const con = mqtt.connect(process.env.BROKER || "mqtt://192.168.99.100:1883", options);
con.on("connect", ()=>{
  console.log("on connect");
});
con.on("error", (err)=>{
  console.log(err.stack);
});
const topic = process.env.TOPIC || "$ALL";

let id = 0;
class Pong {
  constructor(max){
    this.from = -1; //0-150 
    this.eventType = Pong.eventTypes[Math.floor(Math.random() * Pong.eventTypes.length)];
    this.min = 0;
    this.max = max;
  }
  fire(){
    return new Promise((resolve, reject)=>{
      const msg = (fr,ev) =>{
        return JSON.stringify({
          id: -1,
          from: fr,
          data:{
            eventType: ev
          }
        });
      };
      let counter = 0;
      const timer = setInterval(()=>{
        if(counter++ > this.max){
          clearInterval(timer);
          resolve(true);
        }else{
          const from = Math.floor(Math.random() * (this.max - this.min) + this.min);
          const eventType = Pong.eventTypes[Math.floor(Math.random() * Pong.eventTypes.length)];
          console.log(msg(from,eventType));
          return con.publish(`${topic}/pong`, msg(from,eventType));
        }
      }, 2000);
    });
  }
}
Pong.eventTypes = ["barup", "button1", "button2", "button3"];

const pongs = [];
for(let i = 0; i < 50; i++){
  pongs.push(new Pong(Math.floor(Math.random() * 150)));
}

Promise.all(pongs.map((pong)=> pong.fire())).then(()=>{
  process.exit(0);
}).catch((err)=>{
  console.log(err);
  process.exit(-1);
});


