import { useState, useEffect } from 'react';

import * as patientService from '../services/patientService';

const usePatientState = (patientId) => {
    const [patient, setPatient] = useState({});

    useEffect(() => {
        patientService.getOne(patientId)
            .then(patientResult => {
                setPatient(patientResult);
            })
    }, [patientId]);

    return [
        patient,
        setPatient
    ]
};

export default usePatientState;