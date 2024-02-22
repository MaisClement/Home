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
			"https://lab.hackernwar.com/webcam_1.php",
			"https://lab.hackernwar.com/webcam_2.php"
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
