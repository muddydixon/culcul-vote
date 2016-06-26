import React, {Component} from "react";

export default class Error extends Component {
  render(){
    const {error} = this.props;
    if(!error) return null;
    return <div classaName="container">
      <div className="alert alert-danger text-center" role="alert">
      <h2>{error.message}</h2>
      </div>
      </div>;
  }
}
