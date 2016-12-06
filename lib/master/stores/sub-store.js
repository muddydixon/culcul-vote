"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../../common/constants";

let exists = {};
class SubStore extends ReduceStore {
  getInitialState(){
    exists = {};
    return exists;
  }
  reduce(state, action){
    switch(action.type) {
    case Const.PING_EVENT:
      {
        exists = {};
      }
      return exists;
    case Const.PONG_EVENT:
      {
        const {existId, from, eventType} = action;
        exists = exists || {};
        if(existId in exists[existId]) return state;
        exists.push({existId, from, eventType});
      }
      return exists;
    default:
      return state;
    }
  }
}

export default new SubStore(dispatcher);
