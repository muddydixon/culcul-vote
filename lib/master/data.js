import uuid from "uuid";

export default [{
  id: "028153f4",
  title: "sample event",
  votes: [{
    id: uuid().substr(0, 8),
    title: "犬と猫と雌鳥とロバのどれが好きですか？",
    answerType: "sequence",
    answers: [{
      title: "犬派",
      votes: []
    }, {
      title: "猫派",
      votes: []
    }, {
      title: "雌鳥派",
      votes: []
    }, {
      title: "ロバ派",
      votes: []
    }]
  }, {
    id: uuid().substr(0, 8),
    title: "犬と猫どちらが好きですか？",
    answerType: "simultaneous",
    answers: [{
      title: "犬派",
      votes: []
    }, {
      title: "猫派",
      votes: []
    }]
  }]
}];
