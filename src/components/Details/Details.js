

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';
import * as protocolService from '../../services/protocolService';

import ConfirmDialog from '../Common/ConfirmDialog';
import RecipesList  from '../RecipesList'
import RecipesDashboard from "../RecipesDashboard/RecipesDashboard";
import {ddmmyyyy} from "../../common/utils";
import { BSON } from 'realm-web';
import Loading from "../Loading/Loading";
import usePatientState from '../../hooks/usePatientState';

const Details = ({mongoContext}) => {
    const navigate = useNavigate();
    const user  = mongoContext.app.currentUser;
    const { patientId } = useParams();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [protocols, setProtocols] = useState([]);
    const [patient, setPatient] = usePatientState(patientId);
    const [loading, setLoading] = useState(true);

    


    function isValid(protocolDate){
        return new Date(protocolDate).getTime() >= Date.now();
    }

    useEffect(() => {

        async function getData () {
            const patientsFromDB = mongoContext.client.db('recipes').collection('protocols');
            setProtocols((await patientsFromDB.find({"patientId"
            :patientId})));
        }

        async function getPatient(){
            const patientsFromDB = mongoContext.client.db('recipes').collection('patients');
            let patient = await patientsFromDB.find({"_id": new BSON.ObjectID(patientId)});
            console.log(`Patient got: ${JSON.stringify(patient[0])}`);
            setPatient(await JSON.parse(patient[0]));
        }

        
        getPatient();
        console.log(`Patient is: ${JSON.stringify(patient)} ${Array.isArray(patient)}`);
        getData();
        setLoading(false);
        // protocolService.getByPatient(patientId, user.accessToken)
        //     .then(result => {
        //         let filtered = [];
        //         result.forEach(x => {if(isValid(x.endDate))
        //             filtered.push(x);
        //         });
        //         setProtocols(filtered);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
    }, [patientId, mongoContext.client]);

    const deleteHandler = (e) => {
        e.preventDefault();

        // patientService.destroy(patientId, user.accessToken)
        //     .then(() => {
        //         navigate('/dashboard');
        //     })
        //     .finally(() => {
        //         setShowDeleteDialog(false);
        //     });
    };

    const deleteClickHandler = (e) => {
        e.preventDefault();
        console.log(process.env.NODE_ENV);
        setShowDeleteDialog(true);
    }

    const ownerButtons = (
        <>
            <Link className="button" to={`/protocol/add/${patientId}`}>Нов протокол</Link>
            <Link className="button" to={`/recipe/add_recipe/${patientId}`}>Нова рецепта</Link>
            <Link className="button" to={`/edit/${patientId}`}>Редактирай пациент</Link>
            <a className="button" href="#" onClick={deleteClickHandler}>Премахни пациент</a>
        </>
    );




    return (
        <>   
        <ConfirmDialog text={`Сигурни ли сте, че искате да изтриете ${patient?.name}?`} show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onSave={deleteHandler} />
            {patient === {} ? <Loading></Loading>:
            <section id="details-page" className="details">
                <div className="patient-information">
                    <h3>Име: {patient?.name}</h3>
                    {/* <RecipesDashboard patientId={patient?._id} /> */}
                    <h3>Протоколи:</h3>
                        <ul className="list">
                            {protocols?.map(x =>{ 

                            return <div className="div-list-item" key={x._id}> 
                                <li>За <b>{x.medication}</b> до {ddmmyyyy(new Date(Number(x.endDate)))} 
                                    <a href={`/recipe/add/${x._id}`}>
                                        <img className="protocolIcons" src="/images/icons/gui_add_icon.png" alt="" title="Добави рецепта"></img>
                                    </a>
                                    <a href={`/protocol/renew/${x._id}`}>
                                        <img className="protocolIcons" src="/images/icons/gui_redo_icon_157048.png" alt="" title="Поднови протокол"></img>
                                    </a>
                                    <a href={`/protocol/edit/${x._id}`}>
                                    <img className="protocolIcons" src="/images/icons/gui_edit_icon_157165.png" alt="" title="Редактирай протокол"></img>
                                    </a>
                                    <a href={`/protocol/delete/${x._id}`}>
                                    <img className="protocolIcons" src="/images/icons/gui_delete_no_icon_157196.png" alt="" title="Премахни протокол"></img>
                                    </a>
                                    {/* <RecipesList protocolId={x._id} /> */}
                                </li>
                            </div>
                            }
                            )}
                        </ul>
                    <div className="actions">

                        { user.id ? ownerButtons
                            :<></>
                        } 

                
                    </div>
                </div>
                <div className="patient-description">
                    
                </div>
            </section> 
            }
        </>
    );
}

export default Details;