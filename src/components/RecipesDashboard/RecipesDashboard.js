import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';
import usePatientState from '../../hooks/usePatientState';
import * as recipeService from '../../services/recipeService';

import ConfirmDialog from '../Common/ConfirmDialog';
import RecipesList  from '../RecipesList'
// Show list of recipes without protocol
const RecipesDashboard = (props) => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { patientId } = "";
    const [patient, setPatient] = usePatientState(patientId);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [recipes, setReciepes] = useState([]);

    
    Date.prototype.ddmmyyyy = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        
        return [(dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
        this.getFullYear()
        
    ].join('-');
    };

    function isValid(protocolDate){
        return new Date(protocolDate).getTime() >= Date.now();
    }

    useEffect(() => {
        // if(props.patientId)
        // recipeService.getByPatient(props.patientId, user.accessToken)
        //     .then(result => {
        //         console.log(`Got recipes! ${props.patientId}`);
        //         let filtered = [];
        //         result.forEach(x => {if(isValid(x.endDate))
        //             if(x.protocolId === "" && x.patientId === props.patientId){
        //                 filtered.push(x);
        //             }
        //         });
        //         setReciepes(filtered);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }, [props.patientId]);

    const deleteHandler = (e) => {
        e.preventDefault();

        patientService.destroy(patientId, user.accessToken)
            .then(() => {
                navigate('/dashboard');
            })
            .finally(() => {
                setShowDeleteDialog(false);
            });
    };

    const ownerButtons = (
        <>
            <Link className="button" to={`/recipe/add_recipe/${patient._id}`}>Нова рецепта</Link>
        </>
    );




    return (
        <>
            <ConfirmDialog text={`Сигурни ли сте, че искате да изтриете ${patient.name}?`} show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onSave={deleteHandler} />
                    <h3>Рецепти без протоколи:</h3>
                        <div className="div-list-item"> 
                            <RecipesList protocolId="" patientId={props.patientId}/>
                        </div>
                    <div className="actions">
                        {user._id && (user._id == patient._ownerId
                            ? ownerButtons
                            :<></>
                        )}

                
                    </div>
        </>
    );
}

export default RecipesDashboard;