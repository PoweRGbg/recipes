import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as protocolService from '../../../services/protocolService';
import * as patientService from '../../../services/patientService';
import usePatientState from '../../../hooks/usePatientState';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import { BSON } from 'realm-web';
import {ddmmyyyy} from '../../../common/utils';

const AddProtocol = ({mongoContext}) => { 
    const user  = mongoContext.app.currentUser;
    const { patientId } = useParams();
    const [errors] = useState({name: false})
    const [patient, setPatient] = usePatientState(patientId);
    const navigate = useNavigate();

    useEffect(() => {
        async function getPatient(){
            const patientsFromDB = mongoContext.client.db('recipes').collection('patients');
            let patient = await patientsFromDB.find({"_id": new BSON.ObjectID(patientId)});
            setPatient(patient[0]);
        }
        getPatient();
    }, [patientId]);
    
const today = ddmmyyyy(new Date());

    const addProtocolSubmitHandler = (e) => {
        e.preventDefault();

        let formData = new FormData(e.currentTarget);

        let patientId = formData.get('patientID');
        let patientName = formData.get('patientName');
        let medication = formData.get('medication');
        let start = formData.get('start').split("-");
        let validity = Number(formData.get('validity'));
        let startDate = new Date(start[2], Number(start[1])-1, start[0]);
        startDate.setDate(start[0]);
        startDate.setMonth(start[1]-1);
        startDate.setFullYear(start[2]);
        let endDate = new Date();
        endDate.setDate(startDate.getDate() + validity);

        console.log(`Patient is ${JSON.stringify(patient)}`);
        const collection = mongoContext.client.db('recipes').collection('protocols');
        collection.insertOne({
            "patientId":patientId, 
            "patientName":patientName, 
            "medication": medication, 
            "startDate": ""+startDate.getTime(),
            "endDate": ""+endDate.getTime()
        }, function(err, res) {
            if (err) alert(err);
        });
        navigate(`/details/${patientId}`);
        
    }

    return (
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit={addProtocolSubmitHandler}>
                <fieldset>
                    <legend>Добави протокол на {patient.name}</legend>
                    <p className="field">
                        <label htmlFor="name">Лекарство</label>
                        <span className="input" style={{borderColor: errors.name ? 'red' : 'inherit'}}>
                            <input type="text" name="medication" id="medication"  />
                        </span>
                        <Alert variant="danger" show={errors.name}>{errors.name}</Alert>
                    </p>
                    <p className="field">
                        <label htmlFor="description">Начална дата</label>
                        <span className="input">
                            <input name="start" id="start" defaultValue={today} />
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="validity">Валидност (дни)</label>
                        <span className="input">
                            <input name="validity" id="validity" defaultValue="180" />
                        </span>
                    </p>
                    <input type="hidden" name='patientID' value={patientId}></input>
                    <input type="hidden" name='patientName' value={patient.name}></input>
                    <input className="button submit" type="submit" value="Добави протокол" />
                </fieldset>
            </form>
        </section>
    );
}

export default AddProtocol; 