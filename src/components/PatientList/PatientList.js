import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import * as patientService from '../../services/patientService';

const PatientList = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        patientService.getAll()
            .then(result => {
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
                        {patients.map(x => <PatientCard key={x._id} patient={x} />)}
                    </ul>
                ) 
                : <p className="no-patients">Нямате добавени пациенти!</p>
            }
        </>
    );
}

export default PatientList;