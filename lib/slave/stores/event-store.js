"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../../common/constants";

class EventStore extends ReduceStore {
  getInitialState(){
    return null;
  }
  reduce(state, action){
    switch(action.type) {
    case Const.FETCH_EVENT:
      return action.event;
    default:
      return state;
    }
  }
}

export default new EventStore(dispatcher);
