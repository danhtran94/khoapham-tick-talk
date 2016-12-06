import React from "react"
import ReactDOM from "react-dom"
import socket from "socket.io-client"
import style from "../styles/main.scss"

import Dash from "./components/dash/Dash"

class App extends React.Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<section className="section">
				<div className="container">
					<div className="columns">
						<Dash conn={this.props.conn}/>
					</div>
				</div>
			</section>
		)
	}
}

let conn = socket.connect("http://localhost:8081");
ReactDOM.render(<App conn={conn}/>, document.getElementById('example'));