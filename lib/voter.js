"use strict";

const uuid = require("uuid");
const mqtt = require("mqtt");
const Fs = require("fs");
const debug = require("debug")("voter");
const command = require('commander')

command
  .version('0.0.1')
  .option('-m --mode [mode]', 'Mode', /^(vote|pong)$/i, "vote")
  .parse(process.argv);

const options = {};
const con = mqtt.connect(process.env.BROKER || "mqtt://192.168.99.100:1883", options);
con.on("connect", ()=>{
  console.log("on connect");
});
con.on("error", (err)=>{
  console.log(err.stack);
});

const topic = process.env.TOPIC || "$ALL";

console.log(command.mode);

let id = 0;
class Publisher {
  constructor(interval, maxcnt){
    // this.id = uuid().substr(0, 8);
    this.id = (id++ % 100);
    this.interval = interval;
    this.mincnt = 0;
    this.maxcnt = maxcnt;
  }
  fire(mode){
    return new Promise((resolve, reject)=>{
      let cnt = 0;
      const timer = setInterval(()=>{
        if(cnt++ > this.maxcnt){
          clearInterval(timer);
          resolve(true);
        }else{
          const eventType = Publisher.eventTypes[0|Math.random() * Publisher.eventTypes.length];
          const msg = (i,f,e) =>{
            return JSON.stringify({
              id: i,
              from: f,
              data:{
                eventType: e
              }
            });
          };
          switch (mode){
            case "vote":
              console.log(msg(uuid(), this.id, eventType));
              return con.publish(`${topic}/vote`, msg(uuid(), this.id, eventType));
              debug(`vote(${this.id})[${cnt}] publish ${eventType}`);
              break;
            case "pong":
              const from = Math.floor(Math.random() * (this.maxcnt - this.mincnt) + this.mincnt);
              console.log(msg(-1,from,eventType));
              return con.publish(`${topic}/pong`, msg(-1,from,eventType));
              break;
            default:
              break;
          }
        }
      }, this.interval);
    });
  }
}
Publisher.eventTypes = ["barup", "button1", "button2", "button3"];

const publishers = [];
for(let i = 0; i < 50; i++){
  publishers.push(new Publisher(0|Math.random() * 5000, 0|Math.random() * 50));
}
switch (command.mode){
  case "vote":
    Promise.all(publishers.map((voter)=> voter.fire(command.mode))).then(()=>{
      process.exit(0);
    }).catch((err)=>{
      console.log(err);
      process.exit(-1);
    });
    break;
  case "pong":
    Promise.all(publishers.map((pong)=> pong.fire(command.mode))).then(()=>{
      process.exit(0);
    }).catch((err)=>{
      console.log(err);
      process.exit(-1);
    });
    break;
  default:
    break;
}