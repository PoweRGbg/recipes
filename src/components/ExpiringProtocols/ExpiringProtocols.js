import { useEffect, useState } from "react";
import * as protocolService from '../../services/protocolService';
import * as patientService from '../../services/patientService';
import {ddmmyyyy} from "../../common/utils.js";

const ExpiringProtocols = () => {
    
    const [protocols, setProtocols] = useState([]);
    const daysAhead = 15;
    const nowDate = new Date();
    const dateAhead = new Date(nowDate.setDate(nowDate.getDate() + daysAhead));

    
    function isValid(protocolDate){
        return new Date(protocolDate).getTime() >= Date.now();
    }

    useEffect(() => {
        protocolService.getAll()
            .then(result => {
                let filtered = [];
                result.forEach(x => {
                    if(isValid(x.endDate) && new Date(x.endDate) <= dateAhead){
                        // get and set names
                            patientService.getOne(x.patientId).then(result =>{
                                x.name = result.name;
                            });
                            filtered.push(x);
                    }
                });
                setProtocols(filtered);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    return (
        <><div><h4>Изтичащи протоколи в следващите {daysAhead} дни</h4><ul>
            
            {protocols && protocols.length > 0 ? protocols.map(x=>{
                return <li key={x._id}> На {x.patientName} за лекарство {x.medication} на дата {ddmmyyyy(new Date(x.endDate))}</li> 
            }):""} 
            
            </ul></div>
        </>
    );
}

export default ExpiringProtocols;