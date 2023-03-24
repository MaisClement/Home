import React from 'react';

import error from './assets/img/error.png';
import valid from './assets/img/valid.png';
import warning from './assets/img/warning.png';
import interogation from './assets/img/interogation.png';
import maintenance from './assets/img/maintenance.png';

class Trains extends React.Component {
    render() {
        return <div className="Départ">
            {this.props.trains[0] ?
                <>
                    {this.props.trains[0].departures.map((departure, i) => (
                        <Train
                            key={i}
                            train={departure}
                            line={this.props.trains[0]}
                            number={i}
                        />
                    ))}
                </>
                :
                <div className='maintenance'>
                    <img src={maintenance} />
                    <br />
                    <b>Quelque chose s'est mal passé</b>
                    {this.props.error == true &&
                        <>
                            <br />
                            {this.props.error}
                        </>
                    }
                </div>
            }
        </div>
    }
}

class Train extends React.Component {
    render() {
        if (typeof this.props.train === 'undefined') {
            return null;
        }

        const informations = this.props.train.informations;
        const stop_date_time = this.props.train.stop_date_time;
        const line = this.props.line;

        if (informations.message === 'terminus') {
            return null;
        }

        let real_time;
        let base_time;
        let created_base_time;
        let created_real_time;

        if (stop_date_time.departure_date_time) {
            created_base_time = createDate(stop_date_time.base_departure_date_time);
            created_real_time = createDate(stop_date_time.departure_date_time);
            base_time = stop_date_time.base_departure_date_time;
            real_time = stop_date_time.departure_date_time;

        } else {
            created_base_time = createDate(stop_date_time.arrival_date_time);
            created_real_time = createDate(stop_date_time.arrival_date_time);
            base_time = stop_date_time.base_arrival_date_time;
            real_time = stop_date_time.arrival_date_time;
        }

        if (created_real_time < created_base_time) {
            created_real_time.setDate(created_real_time.getDate());
        }

        var diff = created_real_time - created_base_time;

        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;

        let type_img;

        if (mm > 0 && hh >= 0)
            type_img = warning;

        else if (stop_date_time.state === 'ontime')
            type_img = valid;

        else if (stop_date_time.state === 'delayed')
            type_img = warning;

        else if (stop_date_time.state === 'cancelled')
            type_img = error;

        else
            type_img = interogation;

        return <>
            <div className={getClass(informations.state, informations.message, real_time, base_time)}>
                <span className="class"><img className='class_img' src={'/class/' + line.name + '.png'} alt="Logo service" /></span>
                <span className="name">{informations.headsign.substring(0, 4)}</span>

                <span className="depart">{(created_base_time.getHours() < 10) ? '0' + created_base_time.getHours() : created_base_time.getHours()}:{(created_base_time.getMinutes() < 10) ? '0' + created_base_time.getMinutes() : created_base_time.getMinutes()}</span>
                <Info real_time={real_time} base_time={base_time} state={informations.state} message={informations.message} />
                <span className="dest">{informations.direction.name}</span>

            </div>
            <img src={type_img} className='trafic_img' />
            <br />
        </>;
    }
}

class Info extends React.Component {
    render() {

        let real_time = this.props.real_time;
        let base_time = this.props.base_time;
        let state = this.props.state;

        if (state == 'cancelled')
            return <span className="trafic_delete"><b> Supprimé </b></span>;

        if (state == 'delayed')
            return <span className="trafic_warning"><b> Retardé </b></span>;

        real_time = createDate(real_time);
        base_time = createDate(base_time);

        if (real_time < base_time) {
            real_time.setDate(real_time.getDate());
        }

        var diff = real_time - base_time;
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);
        msec -= hh * 1000 * 60 * 60;
        var mm = Math.floor(msec / 1000 / 60);
        msec -= mm * 1000 * 60;

        if (mm > 0 && hh >= 0) {
            if (hh == 0)
                return <span className="trafic_warning"><b> +{mm}’</b> </span>;
            else
                return <span className="trafic_warning"><b> +{hh}h{mm + hh * 60}’</b> </span>;
        }
        return null;
    }
}

function getClass(state, message, real_time, base_time) {
    if (state == 'cancelled')
        return 'cancelled';

    if (state == 'delayed')
        return 'late';


    real_time = createDate(real_time);
    base_time = createDate(base_time);

    if (real_time < base_time) {
        real_time.setDate(real_time.getDate());
    }

    var diff = real_time - base_time;
    var msec = diff;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;

    if (mm > 0 && hh >= 0) {
        return 'late';
    }

    return 'ok';
}

function createDate(date) {
    if (typeof date === 'undefined') {
        return new Date();
    }
    return new Date(Date.parse(date));
}


export default Trains;
