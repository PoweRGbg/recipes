import { useState, useEffect } from 'react';

import * as recipeService from '../services/recipeService';
import { useAuthContext } from '../contexts/AuthContext';


const useRecipesState = (protocolId) => {
    const { user } = useAuthContext();
    const [recipes, setRecipes] = useState({});

    useEffect(() => {
        recipeService.getByProtocol(protocolId, user.accessToken)
            .then(recipesList => {
                setRecipes(recipesList);
            })
    }, [protocolId]);

    return [
        recipes,
        setRecipes
    ]
};

export default useRecipesState;