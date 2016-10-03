import React, {Component} from "react";

export default class VoteBase extends Component {
  summarize(votes = [], countType = "once"){
    if(countType === "once"){
      const ids = {};
      votes.forEach((v)=> ids[v.from] = v.time);
      return Object.keys(ids).length;
    }else{
      return votes.length;
    }
  }

  renderResultCount(){
    const {event, status, answers} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    const answer = event.votes[+voteId].answers[0];

    const cnt = this.summarize((answer && answer.votes) || [], event.votes[+voteId].countType) || 0;
    return <div><h2>{event.votes[+voteId].title} 結果表示</h2>
      <div className="result-count text-center">{cnt}</div>
    </div>;
  }

  renderResultYesNo(){
    const {event, status, answers} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    const cnts = event.votes[+voteId].answers.map(answer => this.summarize((answer && answer.votes) || [], event.votes[+voteId].countType) || 0);
    const total = cnts.reduce((p, c)=>{ return p + c;}, 0);

    return <div className="result-yesno">
      <h2>{event.votes[+voteId].title} 結果表示</h2>
      <div>
        <div className="row">
          <div className="col-md-6 text-left" style={{color: "red"}}>Yes</div>
          <div className="col-md-6 text-right" style={{color: "blue"}}>No</div>
        </div>
      </div>
      <div>
      <div className="bar" style={{background: "red",  width: `${100 * cnts[0] / total}%` }} />
      <div className="bar" style={{background: "blue", width: `${100 * cnts[1] / total}%` }} />
      </div>
    </div>;
  }

  renderResult(){
    const {event, status, answers} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    if(event.votes[+voteId].answers.length === 1) return this.renderResultCount();
    if(event.votes[+voteId].answers.length === 2 &&
       event.votes[+voteId].answers[0].title === "Yes" &&
       event.votes[+voteId].answers[1].title === "No") return this.renderResultYesNo();

    return <div><h2>{event.votes[+voteId].title} 結果表示</h2>
      <ol style={{listStyleType: "upper-latin"}}>
      {event.votes[+voteId].answers.map((answer, id)=>{
        const cnt = this.summarize((answer && answer.votes) || [], event.votes[+voteId].countType) || 0;
        const style = {width: cnt * 2};

        return <li key={id}>
          <h2>{answer.title}</h2>
          <div className="bar" style={style} />&nbsp;
          <h2 style={{display: "inline-block", fontFamily: "Muli, sans-serif"}}>{cnt}</h2>
        </li>;
      })}
    </ol>
    </div>;
  }

  renderTitle(){
    const {event, status, answers} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    return <div><h2>{event.votes[+voteId].title}</h2></div>;
  }

  renderProcess(){
    const {event, status, answers} = this.props;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];

    return <div>
      <h2>{event.votes[+voteId].title}</h2>
      <ol style={{fontSize: "x-large", background: "white", padding: "5px 100px"}}>
      {event.votes[+voteId].answers.map((answer, id)=>{
        if(event.votes[+voteId].answerType === "simultaneous"){
          const statusLabel = st === "pause" ? "待機中" : st === "play" ? "投票中" : "投票完了";
          return <li key={id}>
            <h2>{answer.title}</h2>
            <i className={`fa fa-${st}`} />&nbsp;{statusLabel}
          </li>;
        }else{
          const statusIcon = +answerId === id ?
                  `fa fa-${st}` : +answerId > id ? "fa fa-stop" : "fa fa-pause";
          const statusLabel = +answerId === id ?
                  (st === "pause" ? "待機中" : st === "play" ? "投票中" : "投票完了") :
                  +answerId > id ? "投票完了" : "投票前";
          return <li key={id}>
            <h2>{answer.title}</h2>
            <i className={statusIcon} />
            &nbsp;{statusLabel}
          </li>;
        }
      })}
      </ol>
    </div>;
  }
  render(){
    const {event, status, answers} = this.props;
    if(!event) return null;
    const [type, eventId, voteId, answerId, st] = status ? status.split("/") : [];
    if(!type) return null;

    if(type === "vote"){
      if(st === "stop"){
        return this.renderResult();
      }else{
        return this.renderTitle();
      }
    }else{
      if(type === "answer"){
        return this.renderProcess();
      }else{
        return null;
      }
    }
  }
};
