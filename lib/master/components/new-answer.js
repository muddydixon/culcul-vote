"use strict";

import React, {Component} from "react";

export default class NewAnswer extends Component {
  constructor(props){
    super(props);
    this.state = {
      isEditing: false
    };
  }
  onSubmit (ev){
    ev.preventDefault();
    const title = this.refs.title.value.trim();
    this.props.onSubmit(title).then(()=>{
      this.setState({
        isEditing: !this.state.isEditing
      });
    }).catch((err)=> console.log(err));
  }
  toggleEditStatus(ev){
    ev.preventDefault();
    this.setState({
      isEditing: !this.state.isEditing
    });
  }
  render (){
    if(!this.state.isEditing) return <div className="container">
      <button className="btn btn-info" onClick={this.toggleEditStatus.bind(this)}>
      <i className="fa fa-plus">&nbsp;</i>回答追加</button>
      </div>;
    return <div className="fluid-row">
      <form onSubmit={this.onSubmit.bind(this)}>
      <div className="form-group">
      <label htmlFor="answer-title">回答</label>
      <input className="form-control" id="answer-title" ref="title" placeholder="回答" />
      </div>
      <button type="submit" className="btn btn-default">Submit</button>&nbsp;
      <button type="submit" onClick={this.toggleEditStatus.bind(this)} className="btn btn-danger">Cancel</button>
      </form>
      </div>;
  }
}
