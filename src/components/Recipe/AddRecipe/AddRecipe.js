import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as recipeService from '../../../services/recipeService';
import * as protocolService from '../../../services/protocolService';
import usePatientState from '../../../hooks/useRecipesState';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';

const AddRecipe = () => { 
    const { user } = useAuthContext();
    const { protocolId } = useParams();
    const [errors, setErrors] = useState({name: false})
    const [protocol, setProtocol] = useState();
    const navigate = useNavigate();
    
    Date.prototype.ddmmyyyy = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        
        return [(dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
        this.getFullYear()
        
    ].join('-');
};
const today = new Date().ddmmyyyy();

    useEffect(() => {
        console.log("Getting protocol "+protocolId);
        protocolService.getOne(protocolId)
            .then(result => {
                setProtocol(result);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);
    

    const addRecipeSubmitHandler = (e) => {
        e.preventDefault();

        
        let formData = new FormData(e.currentTarget);
        
        let patientId = formData.get('patientID');
        let patientName = formData.get('patientName');
        let protocolId = formData.get('protocolId');
        let medication = formData.get('medication');
        let start = formData.get('start').split("-");
        let validity = Number(formData.get('validity'));
        let startDate = new Date(start[2], Number(start[1])-1, start[0]);
        let endDate = new Date(startDate.setDate(startDate.getDate() + validity));
        
        console.log(`Adding recipe for ${medication} patient ${patientName}`);

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

    return (
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit={addRecipeSubmitHandler}>
                <fieldset>
                    <legend>Добави рецепта към протокол {protocol ? protocol.medication:""}</legend>
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
                    <input type="hidden" name='patientID' value={protocol ? protocol.patientId:""}></input>
                    <input type="hidden" name='patientName' value={protocol ? protocol.patientName:""}></input>
                    <input type="hidden" name='protocolId' value={protocolId ? protocolId:""}></input>
                    <input className="button submit" type="submit" value="Добави протокол" />
                </fieldset>
            </form>
        </section>
    );
}

export default AddRecipe; 