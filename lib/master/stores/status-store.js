"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../../common/constants";

const beginStatus = "event/:eventId/-1/-1/play";

class StatusStore extends ReduceStore {
  getInitialState(){
    return beginStatus;
  }
  reduce(state, action){
    switch(action.type) {
    case Const.SET_STATUS:
      return action.status;
    case Const.RESET_STATUS:
      return action.status;
    default:
      return state;
    }
  }
}

export default new StatusStore(dispatcher);
