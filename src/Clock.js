import React from 'react';

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
		this.setState({
			date: new Date()
		});
	}

	render() {
		const jour = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
		const mois = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
		
		const date = this.state.date;
		const hours = formatTime(date.getHours());
		const minutes = formatTime(date.getMinutes());
		const style = clockstyle(date.getMilliseconds());

		const day = jour[date.getDay()];
		const date_num = date.getDate();
		const month = mois[date.getMonth()];

		return <>
			<span className="time">
				{hours}
				<span style={style}>:</span>
				{minutes}
			</span>
			<span className="date">
				{day} {date_num} {month}
			</span>
		</>;
	}
}

function formatTime(time) {
	return (time < 10) ? '0' + time : time;
}

function clockstyle(time) {
	if (time > 500)
		return { opacity: 0 };
	else
		return { opacity: 1 };
}

export default Clock;
