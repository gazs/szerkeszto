import React from "react";
import ReactDOM from "react-dom";

class Draggable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {dragging:false, x: 20, y: 20}
	}
	dragStart (e) {
		var el = ReactDOM.findDOMNode(this).parentNode;
		var m = el.getScreenCTM();
		var p = el.createSVGPoint();
		p.x = e.clientX;
		p.y = e.clientY;
		p = p.matrixTransform(m.inverse());

		this.setState({
			dragging: true,
			offsetX : this.state.x - p.x,
			offsetY : this.state.y - p.y,
		})
	}
	dragStop (e) {
		this.setState({dragging: false})
	}
	onDrag (e) {
		var el = ReactDOM.findDOMNode(this).parentNode;

		var m = el.getScreenCTM();
		var p = el.createSVGPoint();
		p.x = e.clientX;
		p.y = e.clientY;
		p = p.matrixTransform(m.inverse());


		this.setState({
			x: p.x + this.state.offsetX,
			y: p.y + this.state.offsetY
		})
	}
	render () {
		return React.cloneElement(React.Children.only(this.props.children), {
			x: this.state.x,
			y: this.state.y,
			onMouseDown: this.dragStart.bind(this),
			onMouseMove: this.state.dragging ? this.onDrag.bind(this) : null,
			onMouseUp: this.state.dragging ? this.dragStop.bind(this) : null,
		});
	}

}

export default class Print extends React.Component {
	save () {
		var uri = ("data:image/svg+xml;utf8," + `
		<svg xmlns="http://www.w3.org/2000/svg" width="84.1cm" height="118.9cm" viewBox="0 0 84.1 118.9">${this.svgElement.innerHTML}</svg>`)

		var link = document.createElement("a");
		link.download = "szia";
		link.href = uri;
		link.click();
	}
	render () {
		return <div>
		<button onClick={this.save.bind(this)}>💾</button>
		<svg
			ref={(ref) => this.svgElement = ref}
				xmlns="http://www.w3.org/2000/svg"
				width="84.1cm"
				height="118.9cm"
				viewBox="0 0 84.1 118.9" style={{border: "1px solid black"}}>
					<Draggable>
						<rect
						width="10"
						height="10"
						/>
						</Draggable>
						{React.Children.map(this.props.children, (child =>
						<Draggable>
							{child}
						</Draggable>
						))}
		</svg>
	</div>
}
}
