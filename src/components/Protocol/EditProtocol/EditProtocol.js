import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as protocolService from '../../../services/protocolService';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';

const EditProtocol = () => { 
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
    
    Date.prototype.ddmmyyyy = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        
        return [(dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
        this.getFullYear()
        
    ].join('-');
};
const today = new Date().ddmmyyyy();

    const editProtocolSubmitHandler = (e) => {
        e.preventDefault();

        console.log('Submit');

        let formData = new FormData(e.currentTarget);

        let patientId = formData.get('patientID');
        let patientName = formData.get('patientName');
        let medication = formData.get('medication');
        let start = formData.get('start').split("-");
        let end = formData.get('endDate').split("-");
        let validity = Number(formData.get('validity'));
        let startDate = new Date(start[2], Number(start[1])-1, start[0]);
        let endDate = new Date(end[2], Number(end[1])-1, end[0]);

        console.log({
            patientId,
            patientName,
            medication,
            startDate,
            endDate
        });

        protocolService.update(protocolId, {
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

    return (
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit={editProtocolSubmitHandler}>
                <fieldset>
                    <legend>Редактирай протокол на {protocol != undefined?protocol.patientName:""}</legend>
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
                            <input name="start" id="start" defaultValue={protocol != undefined?new Date(protocol.startDate).ddmmyyyy():""}/>
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="validity">Крайна дата </label>
                        <span className="input">
                            <input name="endDate" id="endDate"  defaultValue={protocol != undefined?new Date(protocol.endDate).ddmmyyyy():""}/>
                        </span>
                    </p>
                    {protocol != undefined?<input type="hidden" name='patientID' value={protocol.patientId}></input>:""}
                    {protocol != undefined?<input type="hidden" name='patientName' value={protocol.patientName}></input>:""}
                    <input className="button submit" type="submit" value="Редактирай протокол" />
                </fieldset>
            </form>
        </section>
    );
}

export default EditProtocol; 