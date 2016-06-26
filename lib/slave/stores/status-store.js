"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";

class StatusStore extends ReduceStore {
  getInitialState(){
    return null;
  }
  reduce(state, action){
    switch(action.type) {
    case "SET_STATUS":
      return action.status;
    default:
      return state;
    }
  }
}

export default new StatusStore(dispatcher);
