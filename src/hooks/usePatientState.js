import { useState, useEffect } from 'react';

import * as patientService from '../services/patientService';
import { BSON } from 'realm-web';
import * as Realm from 'realm-web';
import { MongoContext } from '../contexts/MongoContext';

const usePatientState = (patientId) => {
    const [patient, setPatient] = useState({});
    const [client, setClient] = useState(null);
     const [user, setUser] = useState(null);
    const [app, setApp] = useState(new Realm.App({id: "recipes-tmpij"}));

    useEffect(() => {
        async function init () {
            if (!user) {
              setUser(app.currentUser ? app.currentUser : await app.logIn(Realm.Credentials.anonymous()))
            }
      
            if (!client) {
              setClient(app.currentUser.mongoClient('mongodb-atlas'));
            }
          }
      
        init();
        async function getPatient(){
            if(client){

              const patientsFromDB = client.db('recipes').collection('patients');
              let patient = await patientsFromDB.findOne({"_id": new BSON.ObjectID(patientId)});
              setPatient(await JSON.parse(patient));
            }
        }

        
        getPatient();
    }, [patientId, app, client, user]);

    return [
        patient,
        setPatient
    ]
};

export default usePatientState;