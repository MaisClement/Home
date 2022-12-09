import React from 'react';

import night from './assets/img/night.png';
import eco from './assets/img/natural-food.png';

class Night extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			x: 0,
			y: 0,
		};
	}
  
	componentDidMount(){
		this.setPos();

		this.interval = setInterval(
			() => this.setPos(),
			1000 * 60 * 1
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}

	setPos() {
		const ypos = Math.floor(Math.random() * 288);
		const xpos = Math.floor(Math.random() * 947);

		this.setState({
			y: ypos,
			x: xpos
		})
	}

	pos(){
		return ({
			top: this.state.y,
			left:  this.state.x
		})
	}

	render(){
		
		return (
			<>
				<Clock />

				<div className="Night">
					<div style={this.pos()}>
						<img src={eco} className='night_eco'/>
						<h2>Économie d'énergie</h2>
							<br/>
						<span>Appuyer pour afficher les informations.</span>
					</div>
				</div>
			</>
			
		);
	}

}
class Clock extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            date: new Date()
        };
    }
	
	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(),
			100
		);
	}
	
	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	
	tick() {
		const jour = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
		const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
	  	let date = new Date();
		let hour = date.getHours();
		let minute = date.getMinutes();

		hour = (hour < 10) ? '0' + hour : hour;
		minute = (minute < 10) ? '0' + minute : minute;

		this.setState({
			hour: hour,
			minute: minute,
			milli: date.getMilliseconds(),

			day: jour[date.getDay()],
			date_num: date.getDate(),
			month: mois[date.getMonth()],
		});
	}

    style(){
      	if (this.state.milli > 500)
			return { opacity: 0 };
		else
        	return { opacity: 1 };
    }

	render(){
		return (
      <>
        <span className="time">
          {this.state.hour}<span style={this.style()}>:</span>{this.state.minute}
        </span>
        <span className="date">
          {this.state.day} {this.state.date_num} {this.state.month}
        </span>
      </>
		);
	}
}

export default Night;
