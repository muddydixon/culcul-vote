"use strict";

import mqttpress from "mqttpress";
import StatusStore from "./stores/status-store";
import StatusAction from "./actions/status-action";
import EventAction from "./actions/event-action";
import AnswerAction from "./actions/answer-action";

module.exports = (opts)=>{
  const app = mqttpress(opts);
  app.hear(`status`, (res)=>{
    StatusAction.status(res.data.status);
    const [type, eventId, voteId, answerId, st] = res.data.status.split("/");
    if(type === "answer" && st === "stop"){
      EventAction.fetch(app, eventId);
    }
  });
  app.hear(`event/update`, (res)=>{
    console.log(res);
    EventAction.update(res.data.event);
  });

  return app;
};
