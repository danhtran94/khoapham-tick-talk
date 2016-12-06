import React from "react"

import MessContent from "./MessContent"
import SubmitMess from "./SubmitMess"
import Login from "./Login"

export default class Dash extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: ""
		}
	}
	componentDidMount() {
		this.props.conn.on("server-apply-login", (username) => {
			this.setState({
				username: username
			});
			document.cookie = "username="+ username +";";
		});
		let obj = {};
		document.cookie.split("; ").map(function (val) {
			let arrC = val.split("=");
			obj[arrC[0]] = arrC[1];
		});
		if (obj.username != "" && obj.username) {
			this.props.conn.emit("client-relog", obj.username);
		}
		this.props.conn.on("server-check-relog", (reqLog) => {
			if (!reqLog) {
				this.setState({
					username: obj.username
				})
			} else {
				document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:01 GMT; Max-Age=-1";
			}
		})
	}
	render() {
		let submitOrLogin;
		let loggedOrNot;
		if (this.state.username == "") {
			submitOrLogin = (<Login conn={this.props.conn}/>);
			loggedOrNot = <span className="tag user-state is-warning">You are not logged in</span>
		} else {
			submitOrLogin = (<SubmitMess username={this.state.username} conn={this.props.conn}/>);
			loggedOrNot = <span className="tag user-state is-info">Online - {this.state.username}</span>
		}
		let jsx = (<div className="column is-half is-offset-one-quarter">
			<div className="tile is-vertical is-ancestor">
				<div className="tile is-child is-parent is-primary notification">
					<p className="title appname">Tick Talk Chat</p>
					{loggedOrNot}
					<div className="tile is-child box">
						<MessContent username={this.state.username} conn={this.props.conn}/>
					</div>
					<div className="tile is-child app-input">
						{submitOrLogin}
					</div>
				</div>
			</div>
		</div>);
		return jsx;
	}
}