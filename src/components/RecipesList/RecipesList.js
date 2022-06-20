import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import useRecipesState from '../../hooks/useRecipesState';
import { useAuthContext } from '../../contexts/AuthContext';
import ConfirmDialog from '../Common/ConfirmDialog';
import {ddmmyyyy} from "../../common/utils.js";

const RecipesList = (props) => {
    const  protocolId  = props.protocolId;
    const  patientId  = props.patientId;
    const mongoContext = props.mongoContext;
    // const [recipes] = useRecipesState(protocolId, patientId, mongoContext);
    const [recipes, setRecipes] = useState();
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState();
    const navigate = useNavigate();
    const { user } = useAuthContext();

    useEffect(() => {
        async function getRecipesByProtocol(){
            const collection = mongoContext.client.db('recipes').collection('recipes');
            let recipesFromDB = await collection.find({"protocolId": ""+protocolId});
            if(recipesFromDB.length > 0){
                setRecipes(recipesFromDB);
            }
            
        }

        
        async function getRecipesByPatient(){
            const collection = mongoContext.client.db('recipes').collection('recipes');
            let recipesFromDB = await collection.find({"patientId": ""+patientId, "protocolId":""});
            if(recipesFromDB.length > 0){
                setRecipes(recipesFromDB);
            }
        }

        if(mongoContext.client){
            if(protocolId !== "" && protocolId !== undefined){
                getRecipesByProtocol();
            } else {
                getRecipesByPatient();
            } 
        }
    }, [protocolId, patientId, mongoContext.client]);

    const deleteHandler = async(e) => {
        e.preventDefault();
        const collection = mongoContext.client.db('recipes').collection('recipes');
        await collection.deleteOne({
            "_id": selectedRecipe._id
        }, function(err, res) {
            if (err) console.log(err);
        });
        navigate(0);
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