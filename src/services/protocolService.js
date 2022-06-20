import { request } from './requester';

const baseUrl = 'https://eu-central-1.aws.data.mongodb-api.com/app/app2-bqvvg/endpoint/patients?secret=user';

export const getAll = () => request(`${baseUrl}`);

export const create = async (patientData, token) => {
    let response = await fetch(`${baseUrl}/protocols`, {
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

export const getOne = (protocolId) => {
    return fetch(`${baseUrl}/protocols/${protocolId}`)
        .then(res => res.json())
};

// Get by patient
// GET /data/comments?where=recipeId%3D%228f414b4f-ab39-4d36-bedb-2ad69da9c830%22
export const getByPatient = (patientId, token) => {
    return fetch(`${baseUrl}/protocols?where=patientId%3D%22${patientId}%22`, {
        method: 'GET',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};

export const remove = (protocolId, token) => {
    return fetch(`${baseUrl}/protocols/${protocolId}`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};

export const update = (protocolId, protocolData, token) => {
    return fetch(`${baseUrl}/protocols/${protocolId}`, {
        method: 'PUT',
        headers: {
            'X-Authorization': token
        },
        body: JSON.stringify({...protocolData})
    }).then(res => res.json());
};
