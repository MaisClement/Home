import React from 'react';

const imgs = [
	'0000',
	'0101',  // Nouvel An
	'0214',  // St Valentin
	'0317',  // St Patrick
	'0501',  // 1er Mai
	'0508',  // Armistice
	'0606',  // DDay
	'0621',  // Fete de la musique
	'0714',  // Fete nationale
	'0921',  // Automne
	'1031',  // Halloween
	'1109',  // Chute du mur de Berlin
	'1111',  // Armistice
	'1221',  // Hiver
	'1224',  // Noël
	'1225',  // Noël
];

function Wallpaper({state, weatherData}) {
	if (!state || !weatherData || !weatherData.hourly[1]) {
		return <div className='Background' id='back1'  key='back1' />;
	}

	const wallpaper = getWallpaper(weatherData.hourly[1].weather[0].icon);

	return <img className='Background' id='back2' key='back2' src={ wallpaper }/>;
}

function getWallpaper(icon) {
	const date = new Date()

	var img = `${formatTime(date.getMonth()  + 1)}${formatTime(date.getDate())}`;

	if (imgs.indexOf(img) !== -1) {
		return `weather/wallpaper/special/${img}.png`;
	}

	return `weather/wallpaper/${icon}.png`;
}

function formatTime(time) {
	return (time < 10) ? '0' + time : time;
}

export default Wallpaper;