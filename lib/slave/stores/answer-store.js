"use strict";

import dispatcher from "../../dispatcher";
import {ReduceStore} from "flux/utils";
import Const from "../../common/constants";

class AnswerStore extends ReduceStore {
  getInitialState(){
    return [];
  }
  reduce(state, action){
    switch(action.type) {
    case Const.VOTE_EVENT:
      if(!state[action.voteId]) state[action.voteId] = [];
      if(!state[action.voteId][action.answerId]) state[action.voteId][action.answerId] = [];
      state[action.voteId][action.answerId].push(action.vote);
      return [].concat(state);
    default:
      return state;
    }
  }
}

export default new AnswerStore(dispatcher);
