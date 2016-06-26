"use strict";

import {ReduceStore} from "flux/utils";
import dispatcher from "../../dispatcher";

class ErrorStore extends ReduceStore {
  getInitialState(){
    return null;
  }
  reduce(state, action){
    switch(action.type) {
    case "ERROR":
      return action.error;
    default:
      return state;
    }
  }
}

export default new ErrorStore(dispatcher);
