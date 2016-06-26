"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";

const beginStatus = "event/:eventId/-1/-1/play";

class StatusStore extends ReduceStore {
  getInitialState(){
    return beginStatus;
  }
  reduce(state, action){
    switch(action.type) {
    case "STATUS_SET":
      return action.status;
    case "STATUS_RESET":
      return action.status;
    default:
      return state;
    }
  }
}

export default new StatusStore(dispatcher);
