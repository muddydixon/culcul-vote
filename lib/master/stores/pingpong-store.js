"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../../common/constants";

class PingPongStore extends ReduceStore {
  getInitialState(){
    return [];
  }
  reduce(state, action){
    switch(action.type) {
    case Const.PING_EVENT:
      return [];
    case Const.PONG_EVENT:
      {
        const {existId, from, eventType} = action;
        console.log("existId:", existId);
        console.log("from:", from);
        console.log("eventType:", eventType);
        console.log("state:", state);
        console.log(state.find((exist) => exist.from));
        if(!state){
          console.log("first");
          state.push({existId, from, eventType});
        }else{
          if(state.find((exist) => exist.from !== from)){ // bad
            state.push({existId, from, eventType});
          }
        }
      }
      return state;
    default:
      return state;
    }
  }
}

export default new PingPongStore(dispatcher);