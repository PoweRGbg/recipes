import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as protocolService from '../../services/protocolService';
import usePatientState from '../../hooks/usePatientState';
import { Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/AuthContext';
import ConfirmDialog from '../Common/ConfirmDialog';


const DeleteProtocol = () => { 
    const { user } = useAuthContext();
    const { protocolId } = useParams();
    const [errors, setErrors] = useState({name: false})
    const [patient, setPatient] = useState();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    const DeleteProtocolHandler = (e) => {
        e.preventDefault();

        console.log('Deleting protocol '+protocol.medication);

        protocolService.remove(protocolId, user.accessToken)
            .then(result => {
                navigate(`/details/${protocol.patientId}`);
            })


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
                    <a className="button" href="#" onClick={deleteClickHandler}>Изтрий този протокол</a>
                    <a className="button" href="#" onClick={backClickHandler}>Назад</a>

                </fieldset>
            </form>
        </section>
        </>
    );
}

export default DeleteProtocol; 