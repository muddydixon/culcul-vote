"use strict";

const uuid = require("uuid");
const mqtt = require("mqtt");
const Fs = require("fs");
const debug = require("debug")("voter");
const command = require('commander');

command
  .version('0.0.1')
  .option('-m,--mode <mode>', 'MODE', /^(vote|pong)$/i, "vote")
  .parse(process.argv);

const options = {};
const con = mqtt.connect(process.env.BROKER || "mqtt://192.168.99.100:1883", options);
con.on("connect", ()=>{
  console.log(`on connect ${process.env.BROKER}`);
});
con.on("error", (err)=>{
  console.log(err.stack);
});

const topic = process.env.TOPIC || "$ALL";

let id = 0;
class Publisher {
  constructor(interval, maxcnt){
    // this.id = uuid().substr(0, 8);
    this.id = (id++ % 100);
    this.interval = interval;
    this.mincnt = 0;
    this.maxcnt = maxcnt;
  }
  bulkPublish(topic, appFunc){
    return new Promise((resolve, reject)=>{
      let cnt = 0;
      const timer = setInterval(()=>{
        if(cnt++ > this.maxcnt){
          clearInterval(timer);
          return resolve(true);
        }else{
          const data = appFunc();
          const msg = JSON.stringify(data);
          debug(`pub ${topic}: ${msg}`);
          return con.publish(topic, msg);
        }
      }, this.interval);
    });
  }
  vote(){
    return this.bulkPublish(`${topic}/vote`, ()=>{
      return {
        id: uuid(),
        from: this.id,
        data: {
          eventType: Publisher.eventTypes[0|Math.random() * Publisher.eventTypes.length]
        }
      };
    });
  }
  pong(){
    return this.bulkPublish(`${topic}/pong`, ()=>{
      return {
        id: -1,
        from: this.id,
        data: {
          eventType: "pong"
        }
      };
    });
  }
}
Publisher.eventTypes = ["barup", "button1", "button2", "button3"];

const publishers = [];
for(let i = 0; i < 50; i++){
  publishers.push(new Publisher(0|Math.random() * 5000, 0|Math.random() * 50));
}
Promise.all(publishers.map((publisher)=> publisher[command.mode]())).then(()=>{
  process.exit(0);
}).catch((err)=>{
  console.log(err);
  process.exit(-1);
});
