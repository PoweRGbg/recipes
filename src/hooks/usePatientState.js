import { useState, useEffect } from 'react';

import * as patientService from '../services/patientService';

const usePatientState = (patientId) => {
    const [patient, setPatient] = useState({});

    useEffect(() => {
        if(patientId)
        patientService.getOne(patientId)
            .then(patientResult => {
                setPatient(patientResult);
            })
        else {
            console.log("Invalid patient id: "+patientId);
        }
    }, [patientId]);

    return [
        patient,
        setPatient
    ]
};

export default usePatientState;