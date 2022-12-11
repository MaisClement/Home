import React from 'react';

import Trafic from './Trafic';
import Trafic_det from './Trafic_det';
import Webcam from './Webcam';
import Train from './Train';
import Night from './Night';
import Weather, { Home, Graph } from './Weather';
import Clock from './Clock';

const credentials = require('./crendential.json');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			force: false,
		};

		this.force = this.force.bind(this);
		this.restore_force = this.restore_force.bind(this);
		this.tick = this.tick.bind(this);
	}
	componentDidMount() {
		this.timerID = setInterval(
			() => this.tick(),
			1000
		);
	}
	componentWillUnmount() {
		clearInterval(this.timerID);
	}
	tick() {
		let date = new Date();

		this.setState({
			hour: date.getHours()
		});
	}
	force() {
		if (this.timeout) clearTimeout(this.timeout);

		this.setState({
			force: true
		})

		this.timeout = setTimeout(
			() => this.restore_force(),
			1000 * 60 * 3
		);
	}
	restore_force() {
		this.setState({
			force: false
		})
	}

	render() {
		return (
			<>
				{(this.state.hour < 6 || this.state.hour >= 23) && this.state.force == true ?
					<div onClick={this.force}  >
						<Night />
					</div>
					:
					<Default />
				}
			</>
		)
	}
}
class Default extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timer: 0,

			trafic: [],

			trains: [],

			error: '',

			weather_data: [],
			weather: false,

			coord_lat: '',
			coord_lon: '',
		};
		this.getTrafic = this.getTrafic.bind(this);

		this.getPos = this.getPos.bind(this);
		this.getWeather = this.getWeather.bind(this);
		this.getTrain = this.getTrain.bind(this);
	}
	componentDidMount() {
		this.getTrafic();
		this.getTrain();
		this.getPos();

		this.intervalTimer = setInterval(
			() => this.timer(),
			50
		);
		this.intervalTrafic = setInterval(
			() => this.getTrafic(),
			1000 * 60 * 3
		);
		this.intervalTrain = setInterval(
			() => this.getTrain(),
			1000 * 60 * 2
		);
		this.intervalWeather = setInterval(
			() => this.getWeather(),
			1000 * 60 * 60
		);
	}
	componentWillUnmount() {
		clearInterval(this.intervalTimer);
		clearInterval(this.intervalTrafic);
		clearInterval(this.intervalTrain);
		clearInterval(this.intervalWeather);
	}
	timer() {
		if (this.state.timer > 1000 * 80) {
			this.setState({
				timer: 0
			});
		} else {
			this.setState({
				timer: this.state.timer + 50
			});
		}
	}
	getTrafic() {
		let url = 'https://navika.hackernwar.com/v0.1/trafic';

		fetch(url)
			.then(res => res.json())
			.then(data => {
				this.setState({
					trafic: data.trafic
				});
			})
			.catch(err => {
				this.setState({
					trafic: []
				});
			});
	}
	getPos() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.getWeather);
		} else {
			this.setState({
				weather: false
			});
		}
	}
	getWeather(position) {
		let lat, lon;

		if (position) {
			this.setState({
				coord_lat: position.coords.latitude,
				coord_lon: position.coords.longitude,
			});
			lat = position.coords.latitude;
			lon = position.coords.longitude;
		} else {
			lat = this.state.coord_lat;
			lon = this.state.coord_lon;
		}

		let url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&appid=' + credentials.API_weather + '&units=metric&lang=fr';

		const headers = new Headers();
		headers.append('Accept', 'application/json');

		fetch(url, {
			method: 'GET',
			headers: headers,
		})
			.then(res => res.json())
			.then(data => {
				this.setState({
					weather_data: data,
					weather: true
				});
			})
			.catch(err => {
				this.setState({
					weather: false
				});
			});
	}
	getTrain() {
		const base = 'https://navika.hackernwar.com/v0.1/'
		const stop = 'stop_area:IDFM:41234';
		const url = base + 'schedules_line?s=' + stop + '&l=C01736';

		fetch(url)
			.then(res => res.json())
			.then(data => {
				if (data.error && data.error === '200') {
					this.setState({
						error: 'Récupération des trains impossible.'
					});
				} else if (data.error) {
					this.setState({
						error: data.error_message,
					});
				}

				this.setState({
					trains: data.departures
				});

			})
			.catch(err => {
				this.setState({
					error: 'Récupération des trains impossible.'
				});
			});
	}

	render() {
		return (
			<>
				<Clock />
				{this.state.timer < 1000 * 15 && 1 == 3 ?
					<>
						<Weather
							weather={this.state.weather}
							weather_data={this.state.weather_data}
						/>
						<Home
							weather={this.state.weather}
							weather_data={this.state.weather_data}
						/>
					</>
					:
					<>
						{this.state.timer < 1000 * 30 && 1 == 3 ?
							<>
								<Weather
									weather={this.state.weather}
									weather_data={this.state.weather_data}
								/>
								<Graph
									weather={this.state.weather}
									weather_data={this.state.weather_data}
								/>
							</>
							:
							<>
								{this.state.timer < 1000 * 45 && 1 == 3 ?
									<>
										<Trafic_det
											trafic={this.state.trafic}
										/>
										<Trafic
											trafic={this.state.trafic}
										/>
									</>
									:
									<>
										{this.state.timer < 1000 * 60 || 1 == 1 ?
											<>
												<Trafic_det
													trafic={this.state.trafic}
												/>
												<Train
													trains={this.state.trains}
													error={this.state.error}
												/>
											</>
											:
											<Webcam />
										}
									</>
								}
							</>
						}
					</>
				}
			</>
		);
	}
}


export default App;