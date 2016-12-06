import React from "react"

import Register from "./Register"

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reqPass: false,
			choose: "",
			username: ""
		}
	}
	chooseLogin = () => {
		this.setState({
			choose: "login"
		})
	};
	chooseRegister = () => {
		this.setState({
			choose: "register"
		})
	};
	loginHandler = () => {
		if (this.state.reqPass) {
			this.props.conn.emit("client-login", {
				username: this.state.username,
				password: this.refs.txtPassword.value
			});
			this.refs.txtPassword.value = "";
			this.setState({
				reqPass: false
			});
		} else {
			this.setState({
				reqPass: true,
				username: this.refs.txtUser.value,
			});
			this.refs.txtUser.value = "";
		}
	};
	render() {
		let passOrUser = this.state.reqPass ?
			<input className="input message-input is-primary" type="password" ref="txtPassword"
			       placeholder="Enter your password ..."/>:
			<input className="input message-input is-primary" ref="txtUser" type="text"
				placeholder="Enter your username ..."/>;
		let jsx = <p className="control has-addons">
			{passOrUser}
			<a className="button is-primary is-info" onClick={this.loginHandler}>
				OK
			</a>
		</p>;
		if (this.state.choose == "login") {
			return (jsx)
		} else if (this.state.choose == "register") {
			return <Register conn={this.props.conn} goToLogin={this.chooseLogin}/>
		}
		return (
			<div>
				<a className="button is-info" onClick={this.chooseLogin} style={{"marginRight": "5px"}}>Login</a>
				<a className="button is-outlined" onClick={this.chooseRegister}>Register</a>
			</div>
		)
	}
}
