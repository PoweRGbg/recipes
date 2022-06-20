import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../../contexts/AuthContext';
import ConfirmDialog from '../../Common/ConfirmDialog';
import {ddmmyyyy} from "../../../common/utils.js";
import { BSON } from 'realm-web';


const DeleteProtocol = ({mongoContext}) => { 
    const { user } = useAuthContext();
    const { protocolId } = useParams();
    const [errors, setErrors] = useState({name: false})
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [protocol, setProtocol] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        async function getPatient(){
            const protocolsFromDb = mongoContext.client.db('recipes').collection('protocols');
            let patient = await protocolsFromDb.find({"_id": new BSON.ObjectID(protocolId)});
            setProtocol(patient[0]);
        }
        getPatient();

    }, [protocolId, mongoContext.client]);
    

const today = ddmmyyyy(new Date());

    const DeleteProtocolHandler = async (e) => {
        e.preventDefault();

        console.log('Deleting protocol '+protocol.medication);
        const collection = mongoContext.client.db('recipes').collection('protocols');
        await collection.deleteOne({
            "_id": protocol._id
        }, function(err, res) {
            if (err) console.log(err);
        });
            
        navigate(`/details/${protocol.patientId}`);
    }

    const deleteClickHandler = (e) => {
        e.preventDefault();
        console.log(process.env.NODE_ENV);
        setShowDeleteDialog(true);
    }

    const backClickHandler = (e) =>{
        e.preventDefault();
        navigate(`/details/${protocol.patientId}`);
    }

    return (
        <>
        <ConfirmDialog text={`Сигурни ли сте, че искате да изтриете ${protocol != undefined?protocol.medication:""}?`} show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onSave={DeleteProtocolHandler} />
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit="">
                <fieldset>
                    <legend>Изтриване на протокол на {protocol != undefined?protocol.patientName:""}</legend>
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
                            <input name="start" id="start" defaultValue={protocol != undefined?ddmmyyyy(new Date(protocol.startDate)):""}/>
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="validity">Крайна дата </label>
                        <span className="input">
                            <input name="endDate" id="endDate"  defaultValue={protocol != undefined?ddmmyyyy(new Date(protocol.endDate)):""}/>
                        </span>
                    </p>
                    {protocol != undefined?<input type="hidden" name='patientID' value={protocol.patientId}></input>:""}
                    {protocol != undefined?<input type="hidden" name='patientName' value={protocol.patientName}></input>:""}
                    <a className="button" href="#" onClick={deleteClickHandler}>Изтрий този протокол</a>
                    <a className="button" href="#" onClick={backClickHandler}>Назад</a>

                </fieldset>
            </form>
        </section>
        </>
    );
}

export default DeleteProtocol; 