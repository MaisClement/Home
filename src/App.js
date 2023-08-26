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
	const [backgroundImage, setBackgroundImage] = useState('');
	const [coord_lat, setCoord_lat] = useState(null);
	const [coord_lon, setCoord_lon] = useState(null);

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

	useEffect(() => {
		getWeather();
	}, [coord_lat, coord_lon]);

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
			navigator.geolocation.getCurrentPosition(setPos);
		} else {
			setWeather(false);
		}
	}
	function setPos(position = null) {
		setCoord_lat(position.coords.latitude);
		setCoord_lon(position.coords.longitude);

		getWeather();
	}
	function getWeather() {
		if (!coord_lat || !coord_lon) {
			return;
		}
		console.log('getWeather');
		let url = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + coord_lat + '&lon=' + coord_lon + '&appid=' + credentials.API_weather + '&units=metric&lang=fr';

		const headers = new Headers();
		headers.append('Accept', 'application/json');

		fetch(url, {
			method: 'GET',
			headers: headers,
		})
			.then(res => {
				if (res.status === 200) {
					return res.json();
				}
				setWeather(false);
				throw new Error('Error');
			})
			.then(data => {
				setWeatherData(data);
				setWeather(true);
			})
			.catch(err => {
				setWeather(false);
			});
	}
	function getTrain() {
		const base = 'https://navika.hackernwar.com/'
		const stop = 'IDFM:64199';
		const url = base + 'schedules/' + stop + '?l=IDFM:C01736';

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
				backgroundImage={backgroundImage}
				setBackgroundImage={setBackgroundImage}
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

export default App;