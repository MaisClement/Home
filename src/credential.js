import React from 'react';
import { decode } from 'html-entities';

import error from './assets/img/error_small.png';
import valid from './assets/img/valid_small.png';
import work from './assets/img/work_small.png';
import warning from './assets/img/warning_small.png';
import futureWork from './assets/img/futur_work_small.png';
import interogation from './assets/img/interogation_small.png';
import information from './assets/img/information_small.png';

import TRAIN_N from './assets/img/idfm/lines_small_dark/TRAIN_N.png';

function Trafic_det({trafic}) {
	if (typeof trafic === "undefined") {
		return null;
	}

	return <div className="App">
		<SNCF_trafic line={'C01736'} name={'TRANSILIEN N'} img={TRAIN_N} trafics={trafic} />
	</div>
}

function getTrafic(trafics, line) {
	for (var i = 0; i < trafics.length; i++) {
		if (trafics[i].id === line) {
			return trafics[i];
		}
	}
	return false;
}

function SNCF_trafic({ line, trafics, name, img }) {
	let color;
	let trafic = {};
	let typeImg;
	let messsage = '';

	if (typeof trafics === "undefined") {
		return null;
	}

	trafic = getTrafic(trafics, line);
	if (trafic === false) {
		return <div className='Trafic_det'>
			<span className="trafic_block slug0">
				<img src={img} className='img' />
				<span className='trafic_img' ></span>
			</span>
		</div>;
	}

	if (trafic.severity === 0) {
		color = 'slug0';
		typeImg = valid;
		messsage = 'Trafic fluide';
	} else if (trafic.severity === 5) {
		color = 'slug1';
		typeImg = error
		messsage = 'Trafic fortement perturbé';
	} else if (trafic.severity === 4) {
		color = 'slug2';
		typeImg = warning;
		messsage = 'Trafic perturbé';
	} else if (trafic.severity === 3) {
		color = 'slug2';
		typeImg = work;
		messsage = 'Travaux';
	} else if (trafic.severity === 2) {
		color = 'slug0';
		typeImg = futureWork;
		messsage = 'Travaux à venir';
	} else if (trafic.severity === 1) {
		color = 'slug0';
		typeImg = information;
		messsage = 'Information';
	} else {
		color = 'slug0';
		typeImg = interogation;
		messsage = 'Trafic fluide';
	}

	return <div className='Trafic_det'>
		<span className={'trafic_block ' + color}>
			<img src={img} className='img' />
			<img src={typeImg} className='trafic_img' />
		</span>
		<b>{messsage}</b>
		<div className='Trafic_details'>
			<SNCF_det trafic={trafic} />
			<span id='bottom_trafic'></span>
		</div>
	</div>;
}

function SNCF_det({ trafic }) {
	let reports = trafic.reports;

	return <>
		{reports.current_trafic.map((report, i) => (
			<>
				<SNCF_trim_title
					txt={report.message.title}
				/>
				<br />
				<SNCF_trim_detail
					txt={report.message.text}
				/>
			</>
		))}
		{reports.current_work.map((report, i) => (
			<>
				<SNCF_trim_title
					txt={report.message.title}
				/>
				<br />
				<SNCF_trim_detail
					txt={report.message.text}
				/>
			</>
		))}
		{reports.future_work.map((report, i) => (
			<>
				<SNCF_trim_title
					txt={report.message.title}
				/>
				<br />
				<SNCF_trim_detail
					txt={report.message.text}
				/>
			</>
		))}
	</>
}

function SNCF_trim_title({ txt }) {
	let text = txt;

	text = text.replaceAll("Ligne N : ", "");
	text = text.replaceAll("Ligne N :", "");
	text = text.replaceAll("Ligne N:", "");
	text = text.replaceAll("Ligne N", "");

	return <b>
		{capitalizeFirstLetter(text)}
	</b>
}
function SNCF_trim_detail({ txt }) {
	let text = txt;
	text = text.replaceAll("<br>", "\n");
	text = text.replace(/(<([^>]+)>)/gi, "");

	return <span className='line'>
		{decode(text)}
	</span>
}
function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export default Trafic_det;
