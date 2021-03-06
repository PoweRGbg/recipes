

import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

import ConfirmDialog from '../Common/ConfirmDialog';
import RecipesList  from '../RecipesList'
import {ddmmyyyy} from "../../common/utils";
import { BSON } from 'realm-web';
import Loading from "../Loading/Loading";
import usePatientState from '../../hooks/usePatientState';
import RecipesDashboard from "../RecipesDashboard"

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
            if(mongoContext.client){

                const patientsFromDB = mongoContext.client.db('recipes').collection('protocols');
                setProtocols((await patientsFromDB.find({"patientId"
                :patientId})));
            }
        }

        async function getPatient(){
            if(mongoContext.client){

                const patientsFromDB = mongoContext.client.db('recipes').collection('patients');
                let patient = await patientsFromDB.find({"_id": new BSON.ObjectID(patientId)});
                setPatient(patient[0]);
            }
        }

        
        getPatient();
        console.log(`Patient is: ${JSON.stringify(patient)} ${Array.isArray(patient)}`);
        getData();
        setLoading(false);
    }, [patientId, mongoContext.client]);

    const deleteHandler = async (e) => {
        e.preventDefault();

        console.log("Deleting patient->"+ patient._id);
        const collection = mongoContext.client.db('recipes').collection('patients');
        await collection.deleteOne({
            "_id": patient._id
        }, function(err, res) {
            if (err) console.log(err);
            else console.log(res);
        });
        navigate("/dashboard");
            
    };

    const deleteClickHandler = (e) => {
        e.preventDefault();
        console.log(process.env.NODE_ENV);
        setShowDeleteDialog(true);
    }

    const ownerButtons = (
        <>
            <Link className="button" to={`/protocol/add/${patientId}`}>?????? ????????????????</Link>
            <Link className="button" to={`/recipe/add_recipe/${patientId}`}>???????? ??????????????</Link>
            <Link className="button" to={`/edit/${patientId}`}>???????????????????? ??????????????</Link>
            <a className="button" href="#" onClick={deleteClickHandler}>???????????????? ??????????????</a>
        </>
    );




    return (
        <>   
        <ConfirmDialog text={`?????????????? ???? ??????, ???? ???????????? ???? ???????????????? ${patient?.name}?`} show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onSave={deleteHandler} />
            {patient === {} ? <Loading></Loading>:
            <section id="details-page" className="details">
                <div className="patient-information">
                    <h3>??????????????: {patient?.name}</h3>
                    <RecipesDashboard patientId={patientId} mongoContext={mongoContext}/>
                    <h3>??????????????????:</h3>
                        <ul className="list">
                            {protocols?.map(x =>{ 

                            return <div className="div-list-item" key={x._id}> 
                                <li>???? <b>{x.medication}</b> ???? {ddmmyyyy(new Date(Number(x.endDate)))} 
                                    <a href={`/recipe/add/${x._id}`}>
                                        <img className="protocolIcons" src="/images/icons/gui_add_icon.png" alt="" title="???????????? ??????????????"></img>
                                    </a>
                                    <a href={`/protocol/renew/${x._id}`} >
                                        <img className="protocolIcons" src="/images/icons/gui_redo_icon_157048.png" alt="" title="?????????????? ????????????????" ></img>
                                    </a>
                                    <a href={`/protocol/edit/${x._id}`} >
                                    <img className="protocolIcons" src="/images/icons/gui_edit_icon_157165.png" alt="" title="???????????????????? ????????????????"  ></img>
                                    </a>
                                    <a href={`/protocol/delete/${x._id}`}>
                                    <img className="protocolIcons" src="/images/icons/gui_delete_no_icon_157196.png" alt="" title="???????????????? ????????????????" /> 
                                    
                                    </a>
                                    <RecipesList protocolId={x._id} mongoContext={mongoContext}/>
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