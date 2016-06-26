"use strict";

import React, {Component} from "react";
import EventAction from "../actions/event-action";

export default class NewEvent extends Component {
  constructor(props){
    super(props);
    this.state = {
      banner: null
    };
  }
  onSubmit (ev){
    ev.preventDefault();
    const title = this.refs.title.value.trim();
    const sponsorName = this.refs.sponsorName.value.trim();

    EventAction.create({title, sponsor: {name: sponsorName, banner: this.state.banner}}).then(()=>{
      this.context.router.push("/");
    });
  }
  onBanner(ev){
    const files = this.refs.sponsorBanner.files;
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = ()=>{
      // document.querySelector('#preview').src = reader.result;
      this.setState({banner: reader.result});
    };
  }
  render (){
    return <div className="container">
      <form onSubmit={this.onSubmit.bind(this)}>
      <div className="form-group">
      <label htmlFor="event-title">イベントタイトル</label>
      <input className="form-control" id="event-title" ref="title" placeholder="Event Title" />
      </div>
      <div className="form-group">
      <label htmlFor="event-sponsor-name">スポンサー名(任意)</label>
      <input className="form-control" id="event-sponsor-name" ref="sponsorName" placeholder="Sponsor Name" />
      </div>
      <div className="form-group">
      <label htmlFor="event-sponsor-banner">スポンサー画像(任意)</label>
      <input type="file" className="form-control" id="event-sponsor-banner" ref="sponsorBanner" onChange={this.onBanner.bind(this)}/>
      <div><img src={this.state.banner || ""} /></div>
      </div>
      <button type="submit" className="btn btn-default">作成</button>
      </form>
      </div>;
  }
};
NewEvent.contextTypes = {router: React.PropTypes.object.isRequired};
