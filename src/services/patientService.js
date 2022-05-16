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

export const getOne = (petId) => {
    return fetch(`${baseUrl}/patients/${petId}`)
        .then(res => res.json())
};

export const destroy = (petId, token) => {
    return fetch(`${baseUrl}/patients/${petId}`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};

export const like = (petId, pet, token) => {
    return fetch(`${baseUrl}/patients/${petId}`, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token
        },
        body: JSON.stringify(pet)
    }).then(res => res.json());
};