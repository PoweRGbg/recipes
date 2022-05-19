import { useState } from "react";
import { Link } from 'react-router-dom';
import * as recipeService from '../../services/recipeService';

import useRecipesState from '../../hooks/useRecipesState';
import { useAuthContext } from '../../contexts/AuthContext';
import ConfirmDialog from '../Common/ConfirmDialog';

const RecipesList = (props) => {
    const  protocolId  = props.protocolId;
    const  patientId  = props.patientId;
    const [recipes, setRecipes] = useRecipesState(protocolId, patientId);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState();
    const { user } = useAuthContext();

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

    const deleteHandler = (e) => {
        e.preventDefault();
        console.log(`Deleting recipe for ${selectedRecipe.medication}`);
        recipeService.remove(selectedRecipe._id, user.accessToken)
            .then(() => {
                setSelectedRecipe(undefined);
                window.location.reload(false);
            });
        }

    return (
        <>
            <ConfirmDialog text={`Взехте ли тази рецепта за ${selectedRecipe ? selectedRecipe.medication:""} ?`} show={showDeleteDialog} onClose={() => {setShowDeleteDialog(false)}} onSave={deleteHandler} />
            {protocolId ? <h5>Рецепти:</h5>: ""}
            <ul>
            {recipes && recipes.length > 0 ? recipes.map(x=>{
            if(x.protocolId === protocolId)
            return <li key={x._id}>{x.medication} до {new Date(x.endDate).ddmmyyyy()}
                    
                    <Link className="button" to="#" onClick={() => {setSelectedRecipe(x); setShowDeleteDialog(true)}}>Вземи рецепта</Link>
            </li>
        }):""}
                    
            </ul>
        </>
    );
}

export default RecipesList;