import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from 'react-router-dom';

import useRecipesState from '../../hooks/useRecipesState';



const RecipesList = (props) => {
    const  protocolId  = props.protocolId;
    const [recipes, setRecipes] = useRecipesState(protocolId);

    
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

    return (
        <>
            <h5>Рецепти:</h5>
            <ul>
            {recipes && recipes.length > 0 ?recipes.map(x=>{
            return <li key={x._id}>{x.medication} до {new Date(x.endDate).ddmmyyyy()}
                    <a href={`/protocol/delete/${x._id}`}>
                    <img className="protocolIcons" src="/images/icons/gui_delete_no_icon_157196.png" alt="Вземи рецепта" title="Рецептата е взета"></img>
                    </a>
            </li>
        }):""}
                    
            </ul>
        </>
    );
}

export default RecipesList;