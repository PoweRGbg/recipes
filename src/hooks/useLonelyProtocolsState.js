import { useState, useEffect } from 'react';

import * as recipeService from '../services/recipeService';
import * as protocolService from '../services/protocolService';
import * as patientService from '../services/patientService';

const useLonelyProtocolsState = (user) => {
    const [lonelyProtocols, setLonelyProtocols] = useState([]);
    let lonelyProtocolsFound = [];

    function isValid(protocolDate){
        return new Date(protocolDate).getTime() >= Date.now();
    }
    useEffect(() => {
        console.log(`Entering`);
        patientService.getByOwnerId(user._id, user.accessToken).then(patients =>{
            console.log(`Patients are ${patients.length}`);
            patients.forEach(patient =>{
                console.log(`Got patient ${patient.name}`);

                protocolService.getByPatient(patient._id, user.accessToken).then(protocols =>{
                    protocols.forEach(protocol =>{
                        console.log(`Checking protocol for ${protocol.medication}`);
                        recipeService.getByProtocol(protocol._id, user.accessToken).then(recipes =>{
                            let validRecipes = [];
                            console.log(`Recipes are ${recipes.length}`);
                            recipes.forEach(x =>{
                                if(isValid(x.endDate)){
                                    validRecipes.push(x);
                                }

                            });
                            console.log(`Valid are ${validRecipes.length}`);

                            if(validRecipes.length === 0){
                                // protocol is lonely
                                let oldState = [...lonelyProtocols];
                                let alreadyIn = false;
                                oldState.forEach(x =>{
                                    if(x._id === protocol._id){
                                        alreadyIn = true;
                                    }
                                });
                                if(!alreadyIn){
                                    oldState.push(protocol);
                                    console.log(`Adding ${protocol.medication}`);
                                    lonelyProtocolsFound.push(protocol);
                                    setLonelyProtocols(oldState);
                                    
                                    console.log(`Protocols are now ${lonelyProtocolsFound}`);
                                } else {
                                    console.log(`Protocol for ${protocol.medication}  already in collection`);
                                }
                            }

                        }).finally(()=>{ 

                            if(lonelyProtocolsFound.length > 0){
                                console.log(`Adding protocols ${lonelyProtocolsFound.length}`);
                                setLonelyProtocols(lonelyProtocolsFound);
                            } else {
                                console.log(`No new protocols found`);
                            } 
                        })
                    });  
                    
                })
            })
        });
    }, []);

    return [  
        lonelyProtocols,
        setLonelyProtocols
    ]
};

export default useLonelyProtocolsState;