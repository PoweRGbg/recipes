import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';
import usePatientState from '../../hooks/usePatientState';

import { Button } from 'react-bootstrap';
import ConfirmDialog from '../Common/ConfirmDialog';

const Details = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { patientId } = useParams();
    const [patient, setPet] = usePatientState(patientId);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

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

    const deleteClickHandler = (e) => {
        e.preventDefault();
        console.log(process.env.NODE_ENV);
        setShowDeleteDialog(true);
    }

    const ownerButtons = (
        <>
            <Link className="button" to={`/add_protocol/${patient._id}`}>Add protocol</Link>
            <Link className="button" to={`/edit/${patient._id}`}>Edit</Link>
            <a className="button" href="#" onClick={deleteClickHandler}>Delete</a>
        </>
    );




    return (
        <>
            <ConfirmDialog show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onSave={deleteHandler} />
            <section id="details-page" className="details">
                <div className="patient-information">
                    <h3>Име: {patient.name}</h3>
                    <h3>Протоколи:</h3>
                    <p>{patient.description}</p>
                    <div className="actions">
                        {user._id && (user._id == patient._ownerId
                            ? ownerButtons
                            :<></>
                        )}

                
                    </div>
                </div>
                <div className="patient-description">
                    
                </div>
            </section>
        </>
    );
}

export default Details;