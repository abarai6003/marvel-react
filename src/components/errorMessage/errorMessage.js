import img from "./error.gif"
import { Component } from "react"

class ErrorMessage extends Component {
	render() {
		return (
			<img
				src={img}
				alt='error'
				style={{
					display: "block",
					width: "250px",
					height: "250px",
					objectFit: "contain",
					margin: "0 auto"
				}}></img>
		)
	}
}

export default ErrorMessage
