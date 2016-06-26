"use strict";

const uuid = require("uuid");
const mqtt = require("mqtt");
const Fs = require("fs");
const debug = require("debug")("voter");

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
class Voter {
  constructor(interval, maxcnt){
    // this.id = uuid().substr(0, 8);
    this.id = (id++ % 100);
    this.interval = interval;
    this.maxcnt = maxcnt;
  }
  fire(){
    return new Promise((resolve, reject)=>{
      let cnt = 0;
      const timer = setInterval(()=>{
        if(cnt++ > this.maxcnt){
          clearInterval(timer);
          resolve(true);
        }else{
          const eventType = Voter.eventTypes[0|Math.random() * Voter.eventTypes.length];
          return con.publish(`${topic}/vote`, JSON.stringify({id: uuid(), from: this.id, data: {eventType}}));
          debug(`vote(${this.id})[${cnt}] publish ${eventType}`);
        }
      }, this.interval);
    });
  }
}
Voter.eventTypes = ["barup", "button1", "button2", "button3"];

const voters = [];
for(let i = 0; i < 50; i++){
  voters.push(new Voter(0|Math.random() * 5000, 0|Math.random() * 50));
}

Promise.all(voters.map((voter)=> voter.fire())).then(()=>{
  process.exit(0);
}).catch((err)=>{
  console.log(err);
  process.exit(-1);
});
