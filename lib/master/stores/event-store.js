"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";

class EventStore extends ReduceStore {
  getInitialState(){
    return [];
  }
  reduce(state, action){
    switch(action.type) {
    case "FETCH_EVENTS":
      return action.events;
    case "CREATE_EVENT":
      return state.concat(action.event);
    case "APPEND_VOTE":
      return action.events;
    case "APPEND_ANSWER":
      return action.events;
    case "EVENT_VOTE":
      return action.events;
    default:
      return state;
    }
  }
}

export default new EventStore(dispatcher);
