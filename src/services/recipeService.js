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

export const getByPatient = (patientId, token) => {
    return fetch(`${baseUrl}/recipes?where=patientId%3D%22${patientId}%22`, {
        method: 'GET',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};

export const getByprotocol = (protocolId, token) => {
    return fetch(`${baseUrl}/recipes?where=protocolId%3D%22${protocolId}%22`, {
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
