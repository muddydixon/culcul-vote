"use strict";

import React, {Component} from "react";

export default class NewVote extends Component {
  constructor(props){
    super(props);
    this.state = {
      isEditing: false
    };
  }
  onSubmit (ev){
    ev.preventDefault();
    const title = this.refs.title.value.trim();
    const answerType = this.refs.answerType.value.trim();
    const countType = this.refs.countType.value.trim();
    const displayType = this.refs.displayType.value.trim();
    this.props.onSubmit(title, answerType, countType, displayType).then(()=>{
      this.setState({
        isEditing: !this.state.isEditing
      });
    });
  }
  toggleEditStatus(ev){
    ev.preventDefault();
    this.setState({
      isEditing: !this.state.isEditing
    });
  }
  submitEasyVote(ev){
    ev.preventDefault();
    const easyType = ev.target.id;
    const title = ev.target.title;

    const answers = easyType === "Count" ? [" "] :
            easyType === "YesNo" ? ["はい", "いいえ"] :
            easyType === "AB" ? [" ", " "] :
            [" ", " ", " "];
    const answerType = easyType === "Count" ? "sequence" : "simultaneous";
    this.props.onSubmit(`${title}`, answerType, "once", "aftervote", answers);
  }
  render (){
    if(!this.state.isEditing) return <div className="container">
      <button className="btn btn-info" onClick={this.toggleEditStatus.bind(this)}><i className="fa fa-plus">&nbsp;</i>質問追加</button>&nbsp;
      <button className="btn btn-success" id="Count" title="集計" onClick={this.submitEasyVote.bind(this)}><i className="fa fa-plus">&nbsp;</i>簡易質問追加 (集計)</button>&nbsp;
      <button className="btn btn-success" id="YesNo" title="はい/いいえ" onClick={this.submitEasyVote.bind(this)}><i className="fa fa-plus">&nbsp;</i>簡易質問追加 (はい/いいえ)</button>&nbsp;
      <button className="btn btn-success" id="AB" title="A/B" onClick={this.submitEasyVote.bind(this)}><i className="fa fa-plus">&nbsp;</i>簡易質問追加 (A/B)</button>&nbsp;
      <button className="btn btn-success" id="three" title="三択" onClick={this.submitEasyVote.bind(this)}><i className="fa fa-plus">&nbsp;</i>簡易質問追加 (三択)</button>
      </div>;
    return <div className="container">
      <div className="panel">
      <h2 className="panel-heading">質問作成</h2>
      <div className="panel-body">
      <form onSubmit={this.onSubmit.bind(this)}>
      <div className="form-group">
      <label htmlFor="vote-title">質問タイトル</label>
      <input className="form-control" id="vote-title" ref="title" placeholder="質問" />
      </div>
      <div className="form-group">
      <label htmlFor="answer-type">回答方式</label>
      <select className="form-control" id="answer-type" ref="answerType">
      <option value="sequence">時間押し分け</option>
      <option value="simultaneous">ボタン押し分け</option>
      </select>
      </div>
      <div className="form-group">
      <label htmlFor="count-type">集計方式</label>
      <select className="form-control" id="count-type" ref="countType">
      <option value="once">最初の回答のみ</option>
      <option value="multiple">複数回答許可</option>
      </select>
      </div>
      <div className="form-group">
      <label htmlFor="display-type">結果表示タイミング</label>
      <select className="form-control" id="display-type" ref="displayType">
      <option value="aftervote">集計後</option>
      </select>
      </div>
      <button type="submit" className="btn btn-default">Submit</button>&nbsp;
      <button type="submit" onClick={this.toggleEditStatus.bind(this)} className="btn btn-danger">Cancel</button>
      </form>
      </div>
      </div>
      </div>;
  }
}
