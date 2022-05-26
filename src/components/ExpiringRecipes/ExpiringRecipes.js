import { useEffect, useState } from "react";
import * as recipeService from '../../services/recipeService';
import {ddmmyyyy} from "../../common/utils.js";

const ExpiringRecipes = () => {
    
    const [recipes, setProtocols] = useState([]);
    const daysAhead = 15;
    const nowDate = new Date();
    const dateAhead = new Date(nowDate.setDate(nowDate.getDate() + daysAhead));
    
    function isValid(protocolDate){
        return new Date(protocolDate).getTime() >= Date.now();
    }

    useEffect(() => {
        recipeService.getAll()
            .then(result => {
                let filtered = [];
                result.forEach(x => {
                    if(isValid(x.endDate) && new Date(x.endDate) <= dateAhead){
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
        <><div><h4>Невзети рецепти в следващите {daysAhead} дни</h4><ul>
            
            {recipes && recipes.length > 0 ? recipes.map(x=>{
                return <li key={x._id}> На {x.patientName} за лекарство {x.medication} на дата {ddmmyyyy(new Date(x.endDate))}</li> 
            }):""} 
            
            </ul></div>
        </>
    );
}

export default ExpiringRecipes;