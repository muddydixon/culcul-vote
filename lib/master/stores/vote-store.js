"use strict";

import {ReduceStore} from "flux/utils";
import dispatcher from "../../dispatcher";

class VoteStore extends ReduceStore {
  getInitialState(){
    return [];
  }
  reduce(state, action){
    switch(action.type) {
      default:
      return state;
    }
  }
}

export default new VoteStore(dispatcher);
