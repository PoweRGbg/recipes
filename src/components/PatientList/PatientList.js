import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import * as patientService from '../../services/patientService';

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        patientService.getAll()
            .then(result => {
                console.log(result);
                setPatients(result);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <>
            {patients.length > 0
                ? (
                    <ul className="other-patients-list">
                        {patients.map(x => <PatientCard key={x._id} pet={x} />)}
                    </ul>
                ) 
                : <p className="no-patients">No patients in database!</p>
            }
        </>
    );
}

export default PatientList;