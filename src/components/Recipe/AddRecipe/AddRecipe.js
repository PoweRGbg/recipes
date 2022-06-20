import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import usePatientState from '../../../hooks/usePatientState';
import { BSON } from 'realm-web';
import {ddmmyyyy} from '../../../common/utils';

const AddRecipe = ({mongoContext}) => { 
    const user  = mongoContext.app.currentUser;
    const { protocolId, patientId } = useParams();
    const [errors] = useState({name: false})
    const [patient, setPatient] = usePatientState();
    const [protocol, setProtocol] = useState();
    const navigate = useNavigate();
    
const today = ddmmyyyy(new Date());

    useEffect(() => {
        async function getProtocol(){
            const db = mongoContext.client.db('recipes').collection('protocols');
            let result = await db.find({"_id": new BSON.ObjectID(protocolId)});
                setProtocol(result[0]);
        }
        async function getPatient(){
            if(patientId && !patient){
                console.log("Getting patient "+patientId);
                const patientsFromDB = mongoContext.client.db('recipes').collection('patients');
                let patientFromDb = await patientsFromDB.findOne({"_id": new BSON.ObjectID(patientId)});
                console.log("FromDB "+JSON.stringify(patientFromDb));
                setPatient(patientFromDb);
            } else {
                console.log(`Patient already set: ${JSON.stringify(patient)}`);
            }
        }
        console.log(`ProtocolID as param ${protocolId}`);
        if(protocolId && mongoContext.client){
            getProtocol();
        }
        console.log(`PatientID as param: ${patientId}`);
        if(patientId){
            getPatient();
            console.log("Now patient is  "+patient?._id);
        }
    }, [patientId, protocolId, mongoContext.client, patient]);
    

    const addRecipeSubmitHandler = (e) => {
        e.preventDefault();

        
        let formData = new FormData(e.currentTarget);
        
        let patientId = formData.get('patientID') ? formData.get('patientID'): patient?._id;
        let patientName = formData.get('patientName') ? formData.get('patientName'): patient?.name;
        let protocolId = formData.get('protocolId');
        let medication = formData.get('medication');
        let triple = formData.get('triple');
        let start = formData.get('start').split("-");
        let validity = Number(formData.get('validity'));
        let startDate = new Date(start[2], Number(start[1])-1, start[0]);
        let endDate = new Date(startDate.setDate(startDate.getDate() + validity));
        const collection = mongoContext.client.db('recipes').collection('recipes');
        
        console.log(`Adding recipe for ${medication} patient ${patientName} isTripple:${triple} patientId:${patientId}`);
        // add single or tripple recipe
        if(triple){
            for (let index = 1;index < 4;index++) {
                if(index !== 1){
                    startDate = endDate;
                    endDate = new Date(startDate.setDate(startDate.getDate() + validity));
                }
                
                collection.insertOne({
                    "patientId":patientId, 
                    "patientName":patientName, 
                    "protocolId": protocolId,
                    "medication": medication, 
                    "startDate": ""+startDate.getTime(),
                    "endDate": ""+endDate.getTime()
                }, function(err, res) {
                    if (err) alert(err);
                });
            }
        } else {
            collection.insertOne({
                "patientId":patientId, 
                "patientName":patientName, 
                "protocolId": protocolId,
                "medication": medication, 
                "startDate": ""+startDate.getTime(),
                "endDate": ""+endDate.getTime()
            }, function(err, res) {
                if (err) alert(err);
            });
            
            
        }
        navigate("/details/"+patientId);
    }
    
    return (
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit={addRecipeSubmitHandler}>
                <fieldset>
                    <legend>Добави рецепта {protocol && protocol.medication !== undefined ? "към протокол за " + protocol.medication:""} {patient?.name ? `на ${patient.name}`:""}</legend>
                    <p className="field">
                        <label htmlFor="name">Лекарство</label>
                        <span className="input" style={{borderColor: errors.name ? 'red' : 'inherit'}}>
                            <input type="text" name="medication" id="medication"  defaultValue={protocol ? protocol.medication:""}/>
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
                            <input name="validity" id="validity" defaultValue="30" />
                        </span>
                    </p>
                    <div><label htmlFor='triple' className='label-check'>Това е тройна рецепта?
                    <input className="checkbox-triple" type="checkbox" id="triple" name="triple"></input>
                    </label>
                    </div>
                    <input type="hidden" name='patientID' value={protocol ? protocol.patientId:patientId}></input>
                    <input type="hidden" name='patientName' value={protocol ? protocol.patientName:patient?.name}></input>
                    <input type="hidden" name='protocolId' value={protocolId ? protocolId:""}></input>
                    <input className="button submit" type="submit" value="Добави рецепта" />
                </fieldset>
            </form>
        </section>
    );
}

export default AddRecipe; 