import React from 'react';

import wind from './assets/img/weather/wind.png';
import wet from './assets/img/weather/wet.png';
import moisture from './assets/img/weather/moisture.png';

class Weather extends React.Component {
	render() {
		return (
			<div className="App">
				<div className="weather">
					{this.props.weather == true &&
						<>
							<div className='weather_block'>
								<br />
								<img src={'weather/' + this.props.weather_data.hourly[1].weather[0].icon + '.png'} className='type' />

								<br /><br />
								<span className='temp'>
									{Math.round(this.props.weather_data.hourly[1].temp)}°C
								</span>

								<br /><br />

								<br />
								<span>
									{capitalizeFirstLetter(this.props.weather_data.hourly[1].weather[0].description)}
								</span>
							</div>
							<div className='weather_details'>
								<img src={wind} className='det_img' />
								{Math.round(this.props.weather_data.hourly[1].wind_speed)} Km/h <br />

								<img src={wet} className='det_img' />
								{Math.round(this.props.weather_data.hourly[1].pop * 100)} % <br />
							</div>
						</>
					}
				</div>
			</div>
		);
	}
}
class Home extends React.Component {
	render() {
		return <>
			<div className="Trafic">
				<h1>Bonjour, </h1>
			</div>

			<table className="Weather weather">
				<tbody>

					{this.props.weather == true &&
						<tr>
							{this.props.weather_data.daily.slice(1, 4).map((weather, i) => (
								<td>
									<div className='weather_block'>
										<br />

										<span>{getFullDate(weather.dt)}</span>
										<br />
										<img src={'weather/' + weather.weather[0].icon + '.png'} className='type' />

										<br /><br />
										<span className='temp'>
											{Math.round(weather.temp.day)}°C
										</span>
										<br /><br />
										<div>
											<span className='temp_min'>
												{Math.round(weather.temp.min)}°C
											</span>
											<span className='temp_space'></span>
											<span className='temp_max'>
												{Math.round(weather.temp.max)}°C
											</span>
										</div>
										<br />
										<span>
											{capitalizeFirstLetter(weather.weather[0].description)}
										</span>
									</div>
									<div className='weather_details'>
										<img src={wind} className='det_img' />
										{Math.round(weather.wind_speed)} Km/h <br />

										<img src={wet} className='det_img' />
										{Math.round(weather.pop * 100)} % <br />

										{
											weather.rain && weather.rain >= 1 &&
											<>
												<img src={moisture} className='det_img' />
												{Math.round(weather.rain)} mm <br />
											</>
										}
									</div>
								</td>
							))}
						</tr>
					}
				</tbody>
			</table>
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
				{Math.round(temp) + '°C'}
			</div>

		} else if (max === temp) {
			return <div className='canva_block_temp temp_max' style={gstyle(temp, max, min)}>
				{Math.round(temp) + '°C'}
			</div>

		} else if ((i + 2) % 4 == 0) {
			return <div className='canva_block_temp' style={gstyle(temp, this.props.max, min)}>
				{Math.round(temp) + '°C'}
			</div>

		} else {
			return <div className='canva_nonblock_temp' style={gstyle(temp, this.props.max, min)}>
			</div>

		}
	}
}
class Graph extends React.Component {
	render() {
		if (this.props.weather != true) {
			return null;
		}

		const max = getMax(this.props.weather_data.hourly);
		const min = getMin(this.props.weather_data.hourly);

		return <>
			<div className='weather_back'></div>
			<table className="Weather weather">
				<tbody>
					{this.props.weather == true &&
						<tr>
							{this.props.weather_data.hourly.slice(0, 32).map((weather, i) => (
								<>
									{(i + 2) % 2 == 0 &&
										<td>
											<div className='weather_block'>
												<br /><br />

												<BlockTemp
													weather_data={this.props.weather_data}
													temp={weather.temp}
													i={i}
													max={max}
													min={min}
												/>

												<div className='canva_point_temp' style={gstyle(weather.temp, max, min)}>
												</div>
												<div className='canva_line' style={rstyle(i, weather.temp, this.props.weather_data.hourly[i + 2].temp, max, min)}>

												</div>

												{this.props.weather_data.hourly[i - 2] ?
													<>
														{this.props.weather_data.hourly[i - 2].weather[0].icon.replace("04", "03") === this.props.weather_data.hourly[i].weather[0].icon.replace("04", "03") ?
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
					}
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
	var theta = Math.atan2(dy, dx); // range (-PI, PI]
	theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
	//if (theta < 0) theta = 360 + theta; // range [0, 360)
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

export default Weather;
export { Home, Graph };