import { useState, useEffect } from 'react';

import * as recipeService from '../services/recipeService';

const useRecipesState = (protocolId) => {
    const [recipes, setRecipes] = useState({});

    useEffect(() => {
        recipeService.getByprotocol(protocolId)
            .then(patientResult => {
                setRecipes(patientResult);
            })
    }, [protocolId]);

    return [
        recipes,
        setRecipes
    ]
};

export default useRecipesState;