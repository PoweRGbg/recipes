import { useEffect, useState } from "react";
import * as recipeService from '../../services/recipeService';


const ExpiringRecipes = () => {
    
    const [recipes, setProtocols] = useState([]);
    const daysAhead = 15;
    const nowDate = new Date();
    const dateAhead = new Date(nowDate.setDate(nowDate.getDate() + daysAhead));
    console.log(dateAhead);

    Date.prototype.ddmmyyyy = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        
        return [(dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
        this.getFullYear()
        
    ].join('-');
    };

    
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
        <><div>Невзети рецепти в следващите {daysAhead} дни<ul>
            
            {recipes && recipes.length > 0 ? recipes.map(x=>{
                return <li key={x._id}> На {x.patientName} за лекарство {x.medication} на дата {new Date(x.endDate).ddmmyyyy()}</li> 
            }):""} 
            
            </ul></div>
        </>
    );
}

export default ExpiringRecipes;