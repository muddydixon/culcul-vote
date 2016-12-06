const mqtt = require('mqtt');
const config = require('config');
const commander = require('commander')

commander
  .version('0.0.1')
  .option('-e --endpoint [endpoint]', 'endpoint')
  .option('-p --port [port]', 'port')
  .option('-t --topic [topic]', 'topic')
  .option('-i --interval [interval]', 'Interval')
  .option('-b --bool <bool>', 'Bool', /^(true|false)$/i, false)
  .parse(process.argv);

const UNIQUE_REQUEST_ID = {
  EVENT_PING: "ping",
  EVENT_PONG: "pong",
}


const setting = config.mqtt.default;
if(commander.endpoint){
  setting.endpoint = commander.endpoint
}
if(commander.port){
  setting.port = commander.port
}
if(commander.topic){
  setting.topic = commander.topic
}
if(commander.interval){
  setting.interval = commander.interval
}
if(!setting.endpoint || !setting.port || !setting.topic){
  return;
}

const publishPingMessage = (()=>{
  let i = 0;
  return ()=>{
    const json_data = {
      from: 0,
      data:{
        id: -1,  // All
        eventType: UNIQUE_REQUEST_ID.EVENT_PONG
      }
    }
    return json_data;
  };
})();

const client = mqtt.connect(process.env.BROKER || (setting.endpoint+":"+setting.port),{} );

client.on('connect', ()=>{
  // subscribe
  client.subscribe(setting.topic, ()=> {
    console.log(`subscribing ${setting.topic}`)
  });
  client.on("message", (tpc, msg)=>{
    console.log(client);
    console.log(`subscribe: topic: ${tpc}, msg: ${msg}`);
  });
  console.log(commander['bool']);
  if(commander.bool==='true'){
    setInterval(()=>{
      // publish
      const msg = publishPingMessage();
      client.publish(setting.topic, JSON.stringify(msg), ()=>{
        console.log(`publish: topic: ${setting.topic}, msg: ${JSON.stringify(msg)}`);
      });
    }, setting.interval);
  }
});
client.on("error", (err)=>{
  console.log(err.stack);
});

// mesage.on
