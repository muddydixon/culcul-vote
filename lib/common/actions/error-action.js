"use strict";

import dispatcher from "../../dispatcher";

export default {
  error(err){
    dispatcher.dispatch({type: "ERROR", error: err});
    return Promise.reject(err);
  }
};
