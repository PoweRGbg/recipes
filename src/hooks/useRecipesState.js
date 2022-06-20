import { useState, useEffect } from 'react';

import * as recipeService from '../services/recipeService';
import { useAuthContext } from '../contexts/AuthContext';


const useRecipesState = (protocolId, patientId, mongoContext) => {
    const { user } = useAuthContext();
    const [recipes, setRecipes] = useState({});

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
            let recipesFromDB = await collection.find({"parientId": ""+patientId});
            if(recipesFromDB.length > 0){
                setRecipes(recipesFromDB);
            }
        }

        if(protocolId !== ""){
            getRecipesByProtocol();
        } else {
            getRecipesByPatient();
        } 

    }, [protocolId, patientId, user.accessToken]);
        

    return [
        recipes,
        setRecipes
    ]
};

export default useRecipesState;