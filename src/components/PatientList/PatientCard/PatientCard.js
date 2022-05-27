import { Link} from 'react-router-dom';
import { useEffect, useState } from "react";
import * as protocolService from '../../../services/protocolService';
import { useAuthContext } from '../../../contexts/AuthContext';



const PatientCard = ({
    patient,
}) => {
    
    const { user } = useAuthContext();

    
    function isValid(protocolDate){
        return new Date(protocolDate).getTime() >= Date.now();
    }

    const [protocols, setProtocols] = useState([]);
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
    }, [patient, user.accessToken]);

    return (
        <li className="otherPet">
            <h4>Пациент: {patient.name} <Link className="button" to={`/details/${patient._id}`}>Детайли</Link></h4>
            
        </li>
    );
}

export default PatientCard;