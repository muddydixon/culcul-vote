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
        if(state.length == 0){
          state.push({existId, from, eventType});
        }else{
          if(state.find((exist) => exist.from == from)){ // 一つ目の配列しか指していない
            console.log("duplicates");
          }else{
            console.log("not duplicates");
            state.push({existId, from, eventType});
          }
        }
        console.log(state.length);
      }
      return state;
    default:
      return state;
    }
  }
}

export default new PingPongStore(dispatcher);