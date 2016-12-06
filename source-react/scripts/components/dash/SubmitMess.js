import React from "react"

export default class SubmitMess extends React.Component {
	constructor(props) {
		super(props)
	}
	enterHandler = (input) => {
		input.addEventListener("keyup",(event) => {
			event.preventDefault();
			if (event.keyCode == 13) {
				this.props.conn.emit("client-submit", {
					username: this.props.username,
					message: input.value
				});
				input.value = ""
			}
		})
	};
	render() {
		return (
			<p className="control">
				<input className="input message-input is-dark" ref={this.enterHandler} type="text"
				       placeholder="Type your message and press Enter ..."/>
			</p>
		)
	}
}
