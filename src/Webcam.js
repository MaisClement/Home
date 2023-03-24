import React from 'react';

class Webcam extends React.Component  {  
	constructor(props) {
		super(props);
		this.state = {
			curent: 0,
		};
		this.tick = this.tick.bind(this);
	}

	componentDidMount(){
		this.interval = setInterval(
			() => this.tick(),
			10500
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	tick(){
		if(this.state.curent == 1){
			this.setState({
				curent: 0
			})
		} else {
			this.setState({
				curent: this.state.curent + 1
			})
		}
	}

	render(){
		const webcam = [
			"https://srv05.trinum.com/ibox/ftpcam/mega_les-arcs_arcabulle.jpg",
			"https://srv07.trinum.com/ibox/ftpcam/mega_les_arcs_aiguille.jpg"
		];

		let date = new Date();
		let code = date.getMonth() + '_' + date.getDate() + '_' + date.getHours();

		let style = {
			backgroundImage: 'url("' + webcam[this.state.curent] + '?v=' + code + '")',
		};

		return(
			<div className='Webcam'>
				<div className='Web_load'>
					<span className='webcam' style={style}></span>
				</div>
			</div>
  		)
	}
}


export default Webcam;
