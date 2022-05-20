import { useState, useEffect } from 'react';

import * as recipeService from '../services/recipeService';
import * as protocolService from '../services/protocolService';
import * as patientService from '../services/patientService';
import { useAuthContext } from '../contexts/AuthContext';

const useLonelyProtocolsState = (protocolId, patientId) => {
    const [protocols, setProtocols] = useState({});
    const { user } = useAuthContext(); 


    function isValid(protocolDate){
        return new Date(protocolDate).getTime() >= Date.now();
    }
        
    useEffect(() => {
        protocolService.getAll()
            .then(result => {
                let filteredProtocols = [];
                result.forEach(x => {
                    if(isValid(x.endDate)){
                            patientService.getOne(x.patientId).then(result =>{
                                x.name = result.name;
                            }); 
                            filteredProtocols.push(x);
                    }
                    //
                });
                // check for recipes for each protocol
                let lonelyProtocols = [];
                filteredProtocols.forEach(protocol => {
                    recipeService.getByProtocol(protocol._id, user.accessToken)
                    .then(result =>{
                        console.log(`На ${protocol.patientName} протокол за ${protocol.medication} рецепти ${result.length}`);
                        if( result.length === 0){
                            lonelyProtocols.push(protocol);
                            console.log(`Lonely protocols are now: ${lonelyProtocols.length}`);
                        }
                    }).then(() =>{
                        if(lonelyProtocols.length > 0)
                        setProtocols(lonelyProtocols);

                    });
                });
                
            })
            .catch(err => {
                console.log(err);
            })
    },  [user.accessToken]);

    return [
        protocols,
        setProtocols
    ]
};

export default useLonelyProtocolsState;