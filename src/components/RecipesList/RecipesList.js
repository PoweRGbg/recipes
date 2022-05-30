import { useState } from "react";
import { Link } from 'react-router-dom';
import * as recipeService from '../../services/recipeService';

import useRecipesState from '../../hooks/useRecipesState';
import { useAuthContext } from '../../contexts/AuthContext';
import ConfirmDialog from '../Common/ConfirmDialog';
import {ddmmyyyy} from "../../common/utils.js";


const RecipesList = (props) => {
    const  protocolId  = props.protocolId;
    const  patientId  = props.patientId;
    const mongoContext = props.mongoContext;
    const [recipes] = useRecipesState(protocolId, patientId, mongoContext);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState();
    const { user } = useAuthContext();

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
            return <li key={x._id}>{x.medication} до {ddmmyyyy(new Date(Number(x.endDate)))}
                    
                    <Link className="button" to="#" onClick={() => {setSelectedRecipe(x); setShowDeleteDialog(true)}}>Вземи рецепта</Link>
            </li>
        }):""}
                    
            </ul>
        </>
    );
}

export default RecipesList;