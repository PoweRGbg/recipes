import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

import * as recipeService from '../../services/recipeService';
import { useAuthContext } from '../../contexts/AuthContext';


const RecipesList = (props) => {
    const { user } = useAuthContext();
    const  protocolId  = props.protocolId;
    const [recipes, setRecipes] = useState();

    
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
        recipeService.getByprotocol(protocolId, user.accessToken)
            .then(result => {
                console.log("Getting recipes for "+protocolId);
                console.log(`Results size ${result.length}`);
                let filtered = [];
                result.forEach(x => {if(true){
                    console.log(x);
                    filtered.push(x);

                }
                });
                setRecipes(filtered);
            })
            .catch(err => {
                console.log(err);
            })
    }, [recipes]);

    return (
        <>
            <ul>
                { recipes.map(x=>{
                    <li key={x._id}>{x.medication} до {new Date(x.endDate).ddmmyyyy()}</li>
                    })}
            </ul>
        </>
    );
}

export default RecipesList;