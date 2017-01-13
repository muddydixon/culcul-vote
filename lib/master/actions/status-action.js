"use strict";

import dispatcher from "../../dispatcher";
import uuid from "uuid";
import Const from "../../common/constants";

const beginStatus = "event/:eventId/-1/-1/play";
let status = beginStatus;

// event/:eventId/:voteId/:answerId/pause
export default {
  reset(eventId){
    dispatcher.dispatch({type: Const.STATUS_RESET, status: (status = beginStatus.replace(/:eventId/, eventId))});
  },
  forward(app, event){
    if(!event){
      dispatcher.dispatch({type: Const.SET_STATUS, status: (status = beginStatus)});
      return Promise.resolve(status);
    }
    const [type, eventId, voteId, answerId, st] = status.split("/");
    if(type === "event" && st === "play"){
      // event/:eventId/-1/-1/pause => event/:eventId/0/-1/play
      status = ["vote", eventId, 0, -1, "play"].join("/");
    }else if(type === "vote" && st === "play"){
      // vote/:eventId/:voteId/:answerId/play => answer/:eventId/:voteId/:answerId+1/pause
      status = ["answer", eventId, voteId, +answerId + 1, "pause"].join("/");
    }else if(type === "vote" && st === "stop"){
      const isLastVote     = (+voteId + 1) >= event.votes.length;
      if(isLastVote){
        // vote/:eventId/:voteId/:answerId/play => answer/:eventId/:voteId/:answerId+1/pause
        status = ["event", eventId, -1, -1, "stop"].join("/");
      }else{
        status = ["vote", eventId, +voteId + 1, -1, "play"].join("/");
      }
    }else if(type === "answer" && st === "pause"){
      status = ["answer", eventId, voteId, answerId, "play"].join("/");
    }else if(type === "answer" && st === "play"){
      const isLastAnswer   = (+answerId + 1) >= event.votes[voteId].answers.length;
      const isSimultaneous = event.votes[voteId].answerType === "simultaneous";

      if(isSimultaneous || isLastAnswer){
        status = ["vote", eventId, voteId, -1, "stop"].join("/");
      }else{
        if(isSimultaneous){
          if(event.votes.length > (+voteId + 1)){
            status = ["vote", eventId, +voteId + 1, -1, "play"].join("/");
          }else{
            status = ["vote", eventId, voteId, -1, "stop"].join("/");
          }
        }else{
          status = ["answer", eventId, voteId, +answerId + 1, "pause"].join("/");
        }
      }
    }
    app.send(`${Const.TOPICS.STATUS}`, {eventId: event.id, status});
    dispatcher.dispatch({type: Const.SET_STATUS, status});
    return Promise.resolve(status);
  },
  backward(app, event){
    if(!event){
      dispatcher.dispatch({type: Const.SET_STATUS, status: (status = beginStatus)});
      return Promise.resolve(status);
    }
    const [type, eventId, voteId, answerId, st] = status.split("/");

    if(type === "event" && st === "play"){
      status = [type, eventId, 0, -1, "play"].join("/");
    }else if(type === "event" && st === "stop"){
      status = ["vote", eventId, event.votes.length - 1, -1, "play"].join("/");
    }else if(type === "vote" && st === "play"){
      if(+voteId === 0){
        status = ["event", eventId, 0, -1, "play"].join("/");
      }else{
        status = ["vote", eventId, +voteId - 1, -1, "play"].join("/");
      }
    }else if(type === "vote" && st === "stop"){
      status = [type, eventId, 0, -1, "play"].join("/");
    }else if(type === "answer"){
      status = ["vote", eventId, voteId, -1, "play"].join("/");
    }
    app.send(`${Const.TOPICS.STATUS}`, {eventId: event.id, status});
    dispatcher.dispatch({type: Const.SET_STATUS, status});
    return Promise.resolve(status);
  }
};
