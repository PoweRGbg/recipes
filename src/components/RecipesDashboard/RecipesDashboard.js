import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';
import usePatientState from '../../hooks/usePatientState';
import { BSON } from 'realm-web';

import ConfirmDialog from '../Common/ConfirmDialog';
import RecipesList  from '../RecipesList'
import ddmmyyyy from "../../common/utils.js";

// Show list of recipes without protocol
const RecipesDashboard = (props) => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { patientId } = "";
    const [patient, setPatient] = usePatientState(patientId);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const mongoContext = props.mongoContext;


    useEffect(() => {

        async function getPatient(){
            if(mongoContext.client){

                const patientsFromDB = mongoContext.client.db('recipes').collection('patients');
                let patient = await patientsFromDB.find({"_id": new BSON.ObjectID(patientId)});
                setPatient(patient[0]);
            }
        }

        getPatient();

    }, [props.patientId, props.mongoContext.client]);

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
            <Link className="button" to={`/recipe/add_recipe/${patient?._id}`}>Нова рецепта</Link>
        </>
    );




    return (
        <>
            <ConfirmDialog text={`Сигурни ли сте, че искате да изтриете ${patient?.name}?`} show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onSave={deleteHandler} />
                    <h3>Рецепти без протоколи:</h3>
                        <div className="div-list-item"> 
                            <RecipesList patientId={props.patientId} mongoContext={mongoContext}/>
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