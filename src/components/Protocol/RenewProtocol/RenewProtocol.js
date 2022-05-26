import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as protocolService from '../../../services/protocolService';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import {ddmmyyyy} from "../../../common/utils.js";
import { useAuthContext } from '../../../contexts/AuthContext';

const RenewProtocol = () => { 
    const { user } = useAuthContext();
    const { protocolId } = useParams();
    const [errors, setErrors] = useState({name: false})
    const navigate = useNavigate();
    const [protocol, setProtocol] = useState();

    useEffect(() => {
        console.log(protocolId);
        protocolService.getOne(protocolId)
            .then(result => {
                console.log(result);
                setProtocol(result);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);
    

const today = ddmmyyyy(new Date());

const addProtocolSubmitHandler = (e) => {
    e.preventDefault();

    console.log('Submit');

    let formData = new FormData(e.currentTarget);

    let patientId = formData.get('patientID');
    let patientName = formData.get('patientName');
    let medication = formData.get('medication');
    let start = formData.get('start').split("-");
    let validity = Number(formData.get('validity'));
    let startDate = new Date(start[2], Number(start[1])-1, start[0]);
    let endDate = new Date(startDate.setDate(startDate.getDate() + validity));


    protocolService.create({
        patientId,
        patientName,
        medication,
        startDate,
        endDate
    }, user.accessToken)
        .then(result => {
            navigate(`/details/${patientId}`);
        })
}

const backClickHandler = (e) =>{
    e.preventDefault();
    navigate(`/details/${protocol.patientId}`);
}

    return (
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit={addProtocolSubmitHandler}>
                <fieldset>
                    <legend>Поднови протокол на {protocol != undefined?protocol.patientName:""} за {protocol != undefined?protocol.medication:""}</legend>
                    <p className="field">
                        <label htmlFor="name">Лекарство</label>
                        <span className="input" style={{borderColor: errors.name ? 'red' : 'inherit'}}>
                            <input type="text" name="medication" id="medication"  defaultValue={protocol != undefined?protocol.medication:""}/>
                        </span>
                        <Alert variant="danger" show={errors.name}>{errors.name}</Alert>
                    </p>
                    <p className="field">
                        <label htmlFor="description">Начална дата</label>
                        <span className="input">
                            <input name="start" id="start" defaultValue={protocol != undefined?new Date(protocol.endDate).ddmmyyyy():""}/>
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="validity">Валидност (дни)</label>
                        <span className="input">
                            <input name="validity" id="validity" defaultValue="180" />
                        </span>
                    </p>
                    {protocol != undefined?<input type="hidden" name='patientID' value={protocol.patientId}></input>:""}
                    {protocol != undefined?<input type="hidden" name='patientName' value={protocol.patientName}></input>:""}
                    <input className="button submit" type="submit" value="Поднови протокол" />
                    <a className="button" href="#" onClick={backClickHandler}>Назад</a>

                </fieldset>
            </form>
        </section>
    );
}

export default RenewProtocol; 