import { request } from './requester';

const baseUrl = 'http://localhost:3030/data';

export const getAll = () => request(`${baseUrl}/patients`)

export const create = async (patientData, token) => {
    let response = await fetch(`${baseUrl}/patients`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token,
        },
        body: JSON.stringify({...patientData, likes: []})
    });

    let result = await response.json();

    return result;
};

export const getOne = (patientId) => {
    return fetch(`${baseUrl}/patients/${patientId}`)
        .then(res => res.json())
};

// Get by user
// GET /data/comments?where=recipeId%3D%228f414b4f-ab39-4d36-bedb-2ad69da9c830%22
export const getByOwnerId = (ownerId, token) => {
    return fetch(`${baseUrl}/patients?where=_ownerId%3D%22${ownerId}%22`, {
        method: 'GET',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};


export const destroy = (patientId, token) => {
    return fetch(`${baseUrl}/patients/${patientId}`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};

export const like = (patientId, pet, token) => {
    return fetch(`${baseUrl}/patients/${patientId}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(pet)
    }).then(res => res.json());
};