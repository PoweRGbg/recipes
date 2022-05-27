import { useEffect, useState } from "react";
import PatientCard from "./PatientCard";
import * as patientService from '../../services/patientService';

const PatientList = ({mongoContext}) => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        async function getData () {
            let result = await patientService.getAll();
            // const patientsFromDB = mongoContext.client.db('recipes').collection('patients');
            setPatients(result);
        }

        if (mongoContext.user && mongoContext.client) {
            getData()
        }
    }, [mongoContext.client,mongoContext.user]);

    return (
        <>
            {patients.length > 0
                ? (
                    <ul className="other-patients-list">
                        {patients.map(x =>  <PatientCard key={x._id} mongoContext={mongoContext} patient={x} />)}
                    </ul>
                ) 
                : <p className="no-patients">Нямате добавени пациенти!</p>
            }
        </>
    );
}

export default PatientList;