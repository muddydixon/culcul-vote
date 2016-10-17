"use strict";

import uuid from "uuid";
import dispatcher from "../../dispatcher";
import Const from "../../common/constants";

let state = null;

export default {
  status(status){
    return new Promise((resolve, reject)=>{
      const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
      if(type === "answer" && st === "pause"){
        dispatcher.dispatch({type: Const.RESET_ANSWER});
      }
      dispatcher.dispatch({type: Const.SET_STATUS, status: (state = status)});
      return resolve(status);
    });
  }
};
