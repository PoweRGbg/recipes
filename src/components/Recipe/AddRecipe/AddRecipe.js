import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as recipeService from '../../../services/recipeService';
import * as protocolService from '../../../services/protocolService';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import usePatientState from '../../../hooks/usePatientState';
import ddmmyyyy from '../../../common/utils';

const AddRecipe = () => { 
    const { user } = useAuthContext();
    const { protocolId, patientId } = useParams();
    const [errors] = useState({name: false})
    const [patient] = usePatientState(patientId);
    const [protocol, setProtocol] = useState();
    const navigate = useNavigate();
    
const today = ddmmyyyy(new Date());

    useEffect(() => {
        console.log(`Patient is ${patient.name} ${patientId}`);
        if(protocolId){
            console.log("Getting protocol "+protocolId);
            protocolService.getOne(protocolId)
            .then(result => {
                setProtocol(result);
            })
            .catch(err => {
                console.log(err);
            })
            
        }
    }, [patient.name, patientId, protocolId]);
    

    const addRecipeSubmitHandler = (e) => {
        e.preventDefault();

        
        let formData = new FormData(e.currentTarget);
        
        let patientId = patient ? patient._id : formData.get('patientID');
        let patientName = patient ? patient.name : formData.get('patientName');
        let protocolId = formData.get('protocolId');
        let medication = formData.get('medication');
        let triple = formData.get('triple');
        let start = formData.get('start').split("-");
        let validity = Number(formData.get('validity'));
        let startDate = new Date(start[2], Number(start[1])-1, start[0]);
        let endDate = new Date(startDate.setDate(startDate.getDate() + validity));
        
        console.log(`Adding recipe for ${medication} patient ${patient.name} ${triple}`);
        //add single or tripple recipe
        if(triple){
            for (let index = 1;index < 4;index++) {
                if(index !== 1){
                    startDate = endDate;
                    endDate = new Date(startDate.setDate(startDate.getDate() + validity));
                }
                
                recipeService.create({
                        patientId,
                        patientName,
                        protocolId,
                        medication,
                        startDate,
                        endDate
                    }, user.accessToken)
                .then(result => {
                        console.log(`Added recipe for ${medication} ${index} of 3`);
                        // Go to patient details after the last recipe
                        if(index === 3)
                            navigate(`/details/${patientId}`);
                    })
            }
        } else {
            recipeService.create({
                    patientId,
                    patientName,
                    protocolId,
                    medication,
                    startDate,
                    endDate
                }, user.accessToken)
            .then(result => {
                    navigate(`/details/${patientId}`);
                })
        }
    }
    
    return (
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit={addRecipeSubmitHandler}>
                <fieldset>
                    <legend>Добави рецепта {protocol && protocol.medication !== undefined ? "към протокол за " + protocol.medication:""} {patient ? `за ${patient.name}`:""}</legend>
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
                    <input type="hidden" name='patientID' value={protocol ? protocol.patientId:""}></input>
                    <input type="hidden" name='patientName' value={protocol ? protocol.patientName:""}></input>
                    <input type="hidden" name='protocolId' value={protocolId ? protocolId:""}></input>
                    <input className="button submit" type="submit" value="Добави рецепта" />
                </fieldset>
            </form>
        </section>
    );
}

export default AddRecipe; 