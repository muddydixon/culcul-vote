"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../../common/constants";

class StatusStore extends ReduceStore {
  getInitialState(){
    return null;
  }
  reduce(state, action){
    switch(action.type) {
    case Const.SET_STATUS:
      return action.status;
    default:
      return state;
    }
  }
}

export default new StatusStore(dispatcher);
