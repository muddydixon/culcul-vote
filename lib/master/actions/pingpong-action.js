"use strict";

import dispatcher from "../../dispatcher";
import uuid from "uuid";
import _ from "lodash";
import Const from "../../common/constants";

export default {
  ping(app){
    return new Promise((resolve, reject)=> {
      const ping = {
        id: -1,
        eventType: "ping"
      };
      app.send(`${Const.TOPICS.PING}`, ping);
      console.log("app :", app);
      console.log("data :", ping);
      dispatcher.dispatch({type: Const.PING_EVENT, ping});
      resolve();
    });
  },
  pong(existId, from, eventType){
    return new Promise((resolve, reject)=>{
      dispatcher.dispatch({type: Const.PONG_EVENT, existId, from, eventType});
      resolve();
    });
  }
};
