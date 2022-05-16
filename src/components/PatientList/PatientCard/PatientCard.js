import { Link} from 'react-router-dom';
import { useEffect, useState } from "react";
import * as protocolService from '../../../services/protocolService';

const PatientCard = ({
    patient
}) => {

    Date.prototype.ddmmyyyy = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        
        return [(dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
        this.getFullYear()
        
    ].join('-');
    };

    const [protocols, setProtocols] = useState([]);
    useEffect(() => {
        protocolService.getAll()
            .then(result => {
                console.log(`Ime - ${patient.name}`);
                console.log(result);
                let filtered = [];
                result.forEach(x => {if(x.patientName === patient.name)
                    filtered.push(x);
                });
                setProtocols(filtered);
            })
            .catch(err => {
                console.log(err);
            })
    }, [patient]);

    return (
        <li className="otherPet">
            <h3>Име: {patient.name}</h3>
            <p>Възраст: {patient.age}</p>
            <ul>
                        {protocols.map(x => <li>{x.medication} до {new Date(x.endDate).ddmmyyyy()}</li>)}
            </ul>
            <Link className="button" to={`/details/${patient._id}`}>Още</Link>
        </li>
    );
}

export default PatientCard;