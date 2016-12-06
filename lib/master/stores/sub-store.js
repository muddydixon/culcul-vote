"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../../common/constants";

let exists = [];
class SubStore extends ReduceStore {
  getInitialState(){
    exists = [];
    return exists;
  }
  reduce(state, action){
    switch(action.type) {
    case Const.PING_EVENT:
      {
        exists = [];
      }
      return exists;
    case Const.PONG_EVENT:
      {
        const {existId, from, eventType} = action;
        let duplicateFlag = false;
        for(var exist in exists){
          if(!exist.from){
            return;
          }
          console.log("from", from);
          console.log("exist", exist.from);
          if(exist.from === from){
            duplicateFlag = true;
            console.log("duplicate");
            return state;
          }
        }
        if(!duplicateFlag){
          exists.push({existId, from, eventType});
        }
        console.log(exists.length)
      }
      return exists;
    default:
      return state;
    }
  }
}

export default new SubStore(dispatcher);