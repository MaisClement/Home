/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';

import Trafic from './Trafic';
import Webcam from './Webcam';
import Train from './Train';
import Home, { Weather, Graph } from './Weather';
import Clock from './Clock';

const credentials = require('./crendential.json');

function App() {

	const [timer, setTimer] = useState(0);
	const [trafic, setTrafic] = useState([]);
	const [trains, setTrains] = useState([]);
	const [error, setError] = useState('');
	const [weatherData, setWeatherData] = useState([]);
	const [weather, setWeather] = useState(false);
	const [coord_lat, setCoord_lat] = useState('');
	const [coord_lon, setCoord_lon] = useState('');

	useEffect(() => {
		getTrafic();
		getTrain();
		getPos();

		const intervalTimer = setInterval(
			() => {
				setTimer(timer => { if (timer > 1000 * 75) return 0; return timer + 1000 });
			},
			1000
		);
		const intervalTrafic = setInterval(
			() => getTrafic(),
			1000 * 60 * 3
		);
		const intervalTrain = setInterval(
			() => getTrain(),
			1000 * 60 * 2
		);
		const intervalWeather = setInterval(
			() => getWeather(),
			1000 * 60 * 60
		);
		return () => {
			clearInterval(intervalTimer);
			clearInterval(intervalTrafic);
			clearInterval(intervalTrain);
			clearInterval(intervalWeather);
		}
	}, []);

	async function getTrafic() {
		let url = 'https://navika.hackernwar.com/v0.1/trafic';

		fetch(url)
			.then(res => res.json())
			.then(data => {
				setTrafic(data.trafic);
			})
			.catch(() => {
				setTrafic([]);
			});
	}
	function getPos() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(getWeather);
		} else {
			setWeather(false);
		}
	}
	function getWeather(position) {
		let lat, lon;

		if (position) {
			setCoord_lat(lat);
			setCoord_lon(lon);
			lat = position.coords.latitude;
			lon = position.coords.longitude;
		} else {
			lat = coord_lat;
			lon = coord_lon;
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
				setWeatherData(data);
				setWeather(true);
			})
			.catch(err => {
				setWeather(false);
			});
	}
	function getTrain() {
		const base = 'https://navika.hackernwar.com/v0.1/'
		const stop = 'stop_area:IDFM:41234';
		const url = base + 'schedules_line?s=' + stop + '&l=C01736';

		fetch(url)
			.then(res => res.json())
			.then(data => {
				if (data.error && data.error === '200') {
					setError('Récupération des trains impossible.');
				} else if (data.error) {
					setError(data.error_message);
				}
				setTrains(data.departures);

			})
			.catch(err => {
				setError('Récupération des trains impossible.');
			});
	}

	const classes = () => {
		if (timer < 1000 * 10) {
			return 'home';
		} else if (timer < 1000 * 25) {
			return 'home weather';
		} else if (timer < 1000 * 40) {
			return 'home graph';
		}
	}

	if (timer < 1000 * 40) {
		return <div className={classes()}>
			<Clock />
			<Home
				weather={weather}
				weatherData={weatherData}
			/>
			{
				weather
				&& <>
					<Weather
						weatherData={weatherData}
					/>
					<Graph
						weatherData={weatherData}
					/>
				</>
			}

		</div>;
	} else if (timer < 1000 * 55) {
		return <>
			<Clock />
			<Trafic
				trafic={trafic}
			/>
			<Train
				trains={trains}
				error={error}
			/>
		</>;
	}
	return <>
		<Clock />
		<Webcam />
	</>;
}

/*
<Trafic
	trafic={trafic}
/>
<Trafic
	trafic={trafic}
/>
<Train
	trains={trains}
	error={error}
/>
<Webcam />
*/




export default App;