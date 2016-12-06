import React from "react"

export default class Dash extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			messages: []
		}
	};
	componentWillMount() {
		this.props.conn.on("server-sync-mess", (mess) => {
			if (this.props.username != "") {
				this.setState({
					messages: mess
				});
			} else {
				var time = Date.now();
				if (this.props.username == "") {
					this.setState({
						messages: [{
							type: "sev",
							message: "You have to login to see messages ...",
							time: time
						}]
					})
				}

			}
		})
	}
	componentDidMount() {
		this.props.conn.on("server-push-mess", (mess) => {
			if (this.props.username != "" || mess.type == "sev") {
				var newMessages = this.state.messages.slice(0);
				newMessages.splice(0, 0, mess);
				console.log(newMessages);
				this.setState({
					messages: newMessages
				})
			}
		})
	};
	render() {
		return (
			<div className="message-container">
				{
					this.state.messages.map((mess, k) => {
						var Day = new Date();
						Day.setTime(mess.time);
						if (mess.username == this.props.username) {
							return (<article key={k} className="media">
								<div className="media-content mess-content my-mess">
									<div className="content">
										<p>
											<strong>{mess.username}</strong>
											<small> - {Day.toUTCString()}</small>
											<br/>
											{mess.message}
										</p>
									</div>
								</div>
							</article>)
						} else if (mess.type == "sev") {
							return (
								<article key={k} className="media">
									<div className="media-content mess-content sev-mess">
										<div className="content">
											<p>
												<strong>SYSTEM</strong>
												<small> - {Day.toUTCString()}</small>
												<br/>
												{mess.message}
											</p>
										</div>
									</div>
								</article>
							)
						}
						return (<article key={k} className="media">
							<div className="media-content mess-content">
								<div className="content">
									<p>
										<strong>{mess.username}</strong>
										<small> - {Day.toUTCString()}</small>
										<br/>
										{mess.message}
									</p>
								</div>
							</div>
						</article>)
					})
				}
			</div>

		)
	}
}
