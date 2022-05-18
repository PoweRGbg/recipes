import { request } from './requester';

const baseUrl = 'http://localhost:3030/data';

export const getAll = () => request(`${baseUrl}/recipes`)

export const create = async (recipeData, token) => {
    let response = await fetch(`${baseUrl}/recipes`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token,
        },
        body: JSON.stringify({...recipeData})
    });

    let result = await response.json();

    return result;
};

export const getOne = (recipeId) => {
    return fetch(`${baseUrl}/recipes/${recipeId}`)
        .then(res => res.json())
};

// Get by patient
// GET /data/recipes?where=recipeId%3D%228f414b4f-ab39-4d36-bedb-2ad69da9c830%22
export const getByPatient = (patientId, token) => {
    return fetch(`${baseUrl}/recipes?where=patientId%3D%22${patientId}%22`, {
        method: 'GET',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};

export const remove = (recipeId, token) => {
    return fetch(`${baseUrl}/recipes/${recipeId}`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};

export const update = (recipeId, recipeData, token) => {
    return fetch(`${baseUrl}/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
            'X-Authorization': token
        },
        body: JSON.stringify({...recipeData})
    }).then(res => res.json());
};
