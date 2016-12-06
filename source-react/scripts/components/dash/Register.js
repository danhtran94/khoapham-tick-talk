import React from "react"

export default class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			reqPass: false,
			reqRetype: false,
			username: "",
			password: ""
		}
	}
	componentDidMount() {
		this.props.conn.on("server-check-register", (ok) => {
			if (ok) {
				this.props.goToLogin();
			} else {
				this.setState({
					reqPass: false,
					reqRetype: false
				});
				this.refs["txtUser"].value = "";
			}
		})
	}
	registerHandler = () => {
		if (!this.state.reqPass && !this.state.reqRetype) {
			this.setState({
				reqPass: true,
				username: this.refs["txtUser"].value
			});
			this.refs["txtUser"].value = "";
		}
		if (this.state.reqPass && !this.state.reqRetype) {
			this.setState({
				reqRetype: true,
				password: this.refs["txtPassword"].value
			});
			this.refs["txtPassword"].value = "";
		}
		if (this.state.reqRetype) {
			if (this.refs["txtRePassword"].value == this.state.password) {
				this.props.conn.emit("client-register", {
					username: this.state.username,
					password: this.state.password
				});
			} else {
				this.setState({
					reqRetype: false
				});
				this.refs["txtRePassword"].value = "";
			}
		}
	};
	render() {
		let passOrUser;
		if (this.state.reqRetype) {
			passOrUser = <input className="input message-input is-primary" type="password" ref="txtRePassword"
			                    placeholder="Re-enter your password ..."/>
		} else {
			passOrUser = this.state.reqPass ?
				<input className="input message-input is-primary" type="password" ref="txtPassword"
				       placeholder="Enter your password ..."/>:
				<input className="input message-input is-primary" ref="txtUser" type="text"
				       placeholder="Enter your username ..."/>;
		}
		let jsx = <p className="control has-addons">
			{passOrUser}
			<a className="button is-primary is-info" onClick={this.registerHandler}>
				OK
			</a>
		</p>;
			return jsx;
	}
}
