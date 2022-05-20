import useLonelyProtocolsState from "../../hooks/useLonelyProtocolsState";
import { useEffect, useState } from "react";
import * as recipeService from '../../services/recipeService';
import * as protocolService from '../../services/protocolService';
import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';




const ProtocolsWithoutRecipes = () => {
    const { user } = useAuthContext(); 
    const [lonelyProtocols] = useLonelyProtocolsState(user);


    Date.prototype.ddmmyyyy = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        
        return [(dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
        this.getFullYear()
        
    ].join('-');
    };


    return (
        <><div>Протоколи без рецепти:<ul>
            
            {lonelyProtocols && lonelyProtocols.length > 0 ? lonelyProtocols.map(x=>{
                console.log(`Lonely protocols in Dashboard ${lonelyProtocols.length}`);
                return <li key={x._id}> На {x.patientName} за лекарство {x.medication} </li> 
            }):"Няма такива"} 
            
            </ul></div>
        </>
    );
}

export default ProtocolsWithoutRecipes;