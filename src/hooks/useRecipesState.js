import { useState, useEffect } from 'react';

import * as recipeService from '../services/recipeService';
import { useAuthContext } from '../contexts/AuthContext';


const useRecipesState = (protocolId, patientId) => {
    const { user } = useAuthContext();
    const [recipes, setRecipes] = useState({});

    useEffect(() => {
        if(protocolId !== ""){
            recipeService.getByProtocol(protocolId, user.accessToken)
            .then(recipesList => {
                setRecipes(recipesList);
            })
        } else 
        recipeService.getByPatient(patientId, user.accessToken)
        .then(recipesList => {
            setRecipes(recipesList);
        })
    }, [protocolId, patientId, user.accessToken]);
        

    return [
        recipes,
        setRecipes
    ]
};

export default useRecipesState;