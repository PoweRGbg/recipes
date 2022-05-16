import { request } from './requester';

const baseUrl = 'http://localhost:3030/data';

export const getAll = () => request(`${baseUrl}/protocols`)

export const create = async (protocolData, token) => {
    let response = await fetch(`${baseUrl}/protocols`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'X-Authorization': token,
        },
        body: JSON.stringify({...protocolData})
    });

    let result = await response.json();

    return result;
};

export const getOne = (protocolId) => {
    return fetch(`${baseUrl}/protocols/${protocolId}`)
        .then(res => res.json())
};

export const remove = (protocolId, token) => {
    return fetch(`${baseUrl}/protocols/${protocolId}`, {
        method: 'DELETE',
        headers: {
            'X-Authorization': token
        }
    }).then(res => res.json());
};
