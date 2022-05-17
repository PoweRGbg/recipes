import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';
import usePatientState from '../../hooks/usePatientState';
import * as protocolService from '../../services/protocolService';

import { Button } from 'react-bootstrap';
import ConfirmDialog from '../Common/ConfirmDialog';

const Details = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const { patientId } = useParams();
    const [patient, setPatient] = usePatientState(patientId);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [protocols, setProtocols] = useState([]);

    
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
        protocolService.getByPatient(patient._id, user.accessToken)
            .then(result => {
                let filtered = [];
                result.forEach(x => {if(isValid(x.endDate))
                    filtered.push(x);
                });
                setProtocols(filtered);
            })
            .catch(err => {
                console.log(err);
            })
    }, [patient]);

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
            <ConfirmDialog text={`Сигурни ли сте, че искате да изтриете ${patient.name}?`} show={showDeleteDialog} onClose={() => setShowDeleteDialog(false)} onSave={deleteHandler} />
            <section id="details-page" className="details">
                <div className="patient-information">
                    <h3>Име: {patient.name}</h3>
                    <h3>Протоколи:</h3>
                        <ul className="list">
                            {protocols.map(x => 
                            <div className="div-list-item"> 
                                <li key={x._id}>{x.medication} до {new Date(x.endDate).ddmmyyyy()}
                                    <a href={`/protocol/renew/${x._id}`}>
                                        <img className="protocolIcons" src="/images/icons/gui_redo_icon_157048.png" alt="Поднови протокол"></img>
                                    </a>
                                    <a href={`/protocol/edit/${x._id}`}>
                                    <img className="protocolIcons" src="/images/icons/gui_edit_icon_157165.png" alt="Редактирай протокол"></img>
                                    </a>
                                    <a href={`/protocol/delete/${x._id}`}>
                                    <img className="protocolIcons" src="/images/icons/gui_delete_no_icon_157196.png" alt="Премахни протокол"></img>
                                    </a>
                                </li>
                            </div>
                            )}
                        </ul>
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