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
        if(!(state.find((exist) => exist.from == from))){
          state.push({existId, from, eventType});
          state.sort((a,b)=>a.from - b.from);
        }
      }
      return [...state];
    default:
      return state;
    }
  }
}

export default new PingPongStore(dispatcher);