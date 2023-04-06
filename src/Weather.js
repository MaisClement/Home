import React from 'react';

import background from './assets/img/background.png';

import wind from './assets/img/svg/wind.svg';
import wet from './assets/img/svg/wet.svg';
import moisture from './assets/img/svg/moisture.svg';

const credentials = require('./crendential.json');

class Home extends React.Component {
	render() {
		if (!this.props.weather || !this.props.weatherData || !this.props.weatherData.hourly[1]) {
			return <>
				<div className='Background' key='back1' style={{ backgroundImage: `url(${background})` }} />

				<div className='bottom-shadow'>
				</div>

				<div className="title">
					<h1>{greetings()}, </h1>
				</div>
			</>;

		}
		const weather = this.props.weatherData.hourly[1];

		return <>
			<img className='Background' key='back2' src={getLabImage(weather.weather[0].description)} />

			<div className='bottom-shadow' />

			<div className='temperature'>
				<span className='description'>
					{capitalizeFirstLetter(weather.weather[0].description)}
				</span>
				<span>
					<span className='value'>
						{Math.round(weather.temp)}
					</span>
					<span className='unit'>
						°C
					</span>
				</span>
			</div>

			<div className='details'>
				{
					this.props.weather
					&& <div>
						<br />
						<div className='is-inline-block ml-3'>
							<img src={wind} className='white-svg det_img' />
							{Math.round(weather.wind_speed)} Km/h <br />
						</div>
						<div className='is-inline-block ml-3'>
							<img src={wet} className='white-svg det_img' />
							{Math.round(weather.pop * 100)} % <br />
						</div>
						{weather.rain && weather.rain >= 1
							&& <div className='is-inline-block ml-3'>
								<img src={moisture} className='white-svg det_img' />
								{Math.round(weather.rain)} mm <br />
							</div>
						}
					</div>
				}
			</div>

			<div className="title">
				<h1>{greetings()}, </h1>
				<p className='ml-3'>{isRainSoon(this.props.weatherData)}</p>
			</div>
		</>;
	}
}
class BlockTemp extends React.Component {
	render() {
		const temp = this.props.temp;
		const i = this.props.i;

		const max = this.props.max;
		const min = this.props.min;

		if (min === temp) {
			return <div className='canva_block_temp temp_min' style={gstyle(temp, max, min)}>
				<b>{Math.round(temp)}</b>°<b>C</b>
			</div>

		} else if (max === temp) {
			return <div className='canva_block_temp temp_max' style={gstyle(temp, max, min)}>
				<b>{Math.round(temp)}</b>°<b>C</b>
			</div>

		} else if ((i + 2) % 4 == 0) {
			return <div className='canva_block_temp' style={gstyle(temp, this.props.max, min)}>
				<b>{Math.round(temp)}</b>°<b>C</b>
			</div>

		} else {
			return <div className='canva_nonblock_temp' style={gstyle(temp, this.props.max, min)}>
			</div>

		}
	}
}
class Weather extends React.Component {
	render() {
		return <>
			<table className="Weather">
				<tbody>
					<tr>
						{this.props.weatherData.daily.slice(1, 4).map((weather, i) => (
							<td>
								<div className='weather_block'>
									<br />

									<span>{getFullDate(weather.dt)}</span>
									<br />
									<img src={'weather/' + weather.weather[0].icon + '.png'} className='type' />

									<br /><br />
									<span className='temp'>
										{Math.round(weather.temp.day)}°<b>C</b>
									</span>
									<br /><br />
									<div>
										<span className='temp_min'>
											{Math.round(weather.temp.min)}°<b>C</b>
										</span>
										<span className='temp_space'></span>
										<span className='temp_max'>
											{Math.round(weather.temp.max)}°<b>C</b>
										</span>
									</div>
									<br />
									<span>
										{capitalizeFirstLetter(weather.weather[0].description)}
									</span>
								</div>
								<div className='weather_details'>
									<img src={wind} className='white-svg det_img' />
									{Math.round(weather.wind_speed)} Km/h <br />

									<img src={wet} className='white-svg det_img' />
									{Math.round(weather.pop * 100)} % <br />

									{
										weather.rain && weather.rain >= 1 &&
										<>
											<img src={moisture} className='white-svg det_img' />
											{Math.round(weather.rain)} mm <br />
										</>
									}
								</div>
							</td>
						))}
					</tr>
				</tbody>
			</table>
		</>;
	}
}
class Graph extends React.Component {
	render() {
		const max = getMax(this.props.weatherData.hourly);
		const min = getMin(this.props.weatherData.hourly);

		return <>
			<table className="Graph weather">
				<tbody>
					<tr>
						{this.props.weatherData.hourly.slice(0, 32).map((weather, i) => (
							<>
								{(i + 2) % 2 == 0 &&
									<td>
										<div className='weather_block'>
											<br /><br />

											<BlockTemp
												weatherData={this.props.weatherData}
												temp={weather.temp}
												i={i}
												max={max}
												min={min}
											/>

											<div className='canva_point_temp' style={gstyle(weather.temp, max, min)}>
											</div>
											<div className='canva_line' style={rstyle(i, weather.temp, this.props.weatherData.hourly[i + 2].temp, max, min)}>

											</div>

											{this.props.weatherData.hourly[i - 2] ?
												<>
													{this.props.weatherData.hourly[i - 2].weather[0].icon.replace("04", "03") === this.props.weatherData.hourly[i].weather[0].icon.replace("04", "03") ?
														<div className="fake_img">
															<span></span>
														</div>
														:
														<img src={'weather/' + weather.weather[0].icon + '.png'} />
													}
												</>
												:
												<img src={'weather/' + weather.weather[0].icon + '.png'} />
											}
											<br />
											{(i + 2) % 4 === 0 ?
												<>
													<span className="canva_lineup_time"></span>
													<div className="canva_block_time">
														{gtime(weather.dt)}
													</div>
												</>
												:
												<>
													<span className="canva_linenone_time"></span>
													<div className="canva_block_time"></div>
												</>
											}

										</div>
									</td>
								}
							</>
						))}
					</tr>
				</tbody>
			</table>
		</>;
	}
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}
function getFullDate(timestamp) {
	const jour = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

	const date = new Date(timestamp * 1000)
	return jour[date.getDay()] + ' ' + date.getDate()
}

function gstyle(temp, dmax, dmin) {
	dmax = dmax - dmin;
	temp = temp - dmin;
	dmin = dmin - dmin;

	const style = {
		bottom: (temp / dmax) * 100 + 'px',
	}
	return style;
}
function rstyle(i, temp, temp2, dmax, dmin) {
	dmax = dmax - dmin;
	temp = temp - dmin;
	temp2 = temp2 - dmin;
	dmin = dmin - dmin;

	const bottom = (temp / dmax) * 100; // px
	const bottom2 = (temp2 / dmax) * 100; // px

	const deg = (angle(0, bottom, 60, bottom2) * -1);

	const style = {
		transform: 'rotate(' + deg + 'deg)',
		bottom: ((bottom + bottom2) / 2) + 'px',
	}

	return style;
}
function angle(cx, cy, ex, ey) {
	var dy = ey - cy;
	var dx = ex - cx;
	var theta = Math.atan2(dy, dx);
	theta *= 180 / Math.PI;
	return theta;
}
function gtime(timestamp) {
	const d = new Date(timestamp * 1000);
	let time = d.getHours();
	return time + ':00';
}

function getMax(all) {
	let max = all[0].temp;

	for (let i = 0; i < 28; i += 2) {
		if (all[i].temp > max) {
			max = all[i].temp;
		}
	}
	return max;
}

function getMin(all) {
	let min = all[0].temp;
	for (let i = 0; i < 28; i += 2) {
		if (all[i].temp < min) {
			min = all[i].temp;
		}
	}
	return min;
}

function greetings() {
	const hour = new Date().getHours();
	if (hour >= 5 && hour < 12) {
		return "Bonjour";
	}
	if (hour < 18) {
		return "Bon après-midi";
	}
	if (hour < 22) {
		return "Bonne soirée";
	}
	return "Bonne nuit";
}

function getMomentOfDay() {
	const hour = new Date().getHours();
	let moment = "";

	if (hour >= 4 && hour < 6) {
		moment = "Aube";
	} else if (hour >= 6 && hour < 9) {
		moment = "Matiné";
	} else if (hour >= 9 && hour < 14) {
		moment = "Journée";
	} else if (hour >= 14 && hour < 18) {
		moment = "Après-Midi";
	} else if (hour >= 18 && hour < 20) {
		moment = "Soirée";
	} else if (hour >= 20 && hour < 22) {
		moment = "Crépuscule";
	} else {
		moment = "Nuit";
	}

	return moment;
}

function getSeason() {
	const month = new Date().getMonth();
	if (month < 2) {
		return "Hiver";
	}
	if (month < 5) {
		return "Primptemps";
	}
	if (month < 8) {
		return "Eté";
	}
	return "Automne";
}

function getLabImage(weather) {
	const momentOfDay = getMomentOfDay();
	const season = getSeason();
	const key = credentials.API_lab;

	const url = `http://lab.hackernwar.com/v0.1/image?keywords[]=${weather}&keywords[]=${season}&keywords[]=${momentOfDay}&key=${key}`;
	return url; //getImage(url);
}

function isRainSoon(weather) {
	const hourly = weather.hourly;
	if (hourly[0].rain) {
		return '';
	}
	for (let i = 0; i < hourly.length; i++) {
		if (hourly[i].rain) {
			return `${capitalizeFirstLetter(hourly[i].weather[0].description)} dans ${i} heures.`;
		}
		if (i > 12) {
			return '';
		}
	}
	return '';
}

export default Home;
export { Weather, Graph };