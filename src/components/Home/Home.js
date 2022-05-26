import { useEffect, useState } from "react";

import PatientCard from '../PatientList/PatientCard';
import * as Realm from 'realm-web';

const Home = ({mongoContext: {client, user}}) => {
    const [patients, setPatients] = useState([]);
    const app = new Realm.App({id: "recipes-tmpij"});

    useEffect(() => {
        async function getData () {
            const patientsFromDB = client.db('recipes').collection('patients');
            setPatients((await patientsFromDB.find()).slice(0, 10));
        }

        if (user && client) {
            getData()
        }
    }, [client,user]);

    return (
    	<div className="mt-3">
                {patients.map((patient) => (
        <PatientCard key={patient._id} patient={patient} />
        ))
	}
</div>
    )
}

export default Home;