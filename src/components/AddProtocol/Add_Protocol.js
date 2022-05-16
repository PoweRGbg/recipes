import { useState } from 'react';
import { useParams } from 'react-router-dom';
import * as patientService from '../../services/patientService';
import usePatientState from '../../hooks/usePatientState';
import { Alert } from 'react-bootstrap';

const types = [
    { value: 'dog', text: 'Dog' },
    { value: 'parrot', text: 'Parrot' },
    { value: 'cats', text: 'Cat' },
    { value: 'reptile', text: 'Reptile' },
    { value: 'other', text: 'Other' },
]

const AddProtocol = () => {
    const { petId } = useParams();
    const [errors, setErrors] = useState({name: false})
    const [patient] = usePatientState(petId);

    const petEditSubmitHandler = (e) => {
        e.preventDefault();

        console.log('Submit');
    }

    const nameChangeHandler = (e) => {
        let currentName = e.target.value;
        if (currentName.length < 3) {
            setErrors(state => ({...state, name: 'Your name sould be at least 3 characters!'}))
        } else if (currentName.length > 10) {
            setErrors(state => ({...state, name: 'Your name sould be max 10 characters!'}))
        } else {
            setErrors(state => ({...state, name: false}))
        }
    };

    return (
        <section id="edit-page" className="edit">
            <form id="edit-form" method="POST" onSubmit={petEditSubmitHandler}>
                <fieldset>
                    <legend>Edit Patient</legend>
                    <p className="field">
                        <label htmlFor="name">Name</label>
                        <span className="input" style={{borderColor: errors.name ? 'red' : 'inherit'}}>
                            <input type="text" name="name" id="name" defaultValue={patient.name} onChange={nameChangeHandler} />
                        </span>
                        <Alert variant="danger" show={errors.name}>{errors.name}</Alert>
                    </p>
                    <p className="field">
                        <label htmlFor="description">Description</label>
                        <span className="input">
                            <textarea name="description" id="description" defaultValue={patient.description} />
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="image">Image</label>
                        <span className="input">
                            <input type="text" name="imageUrl" id="image" defaultValue={patient.imageUrl} />
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="type">Type</label>
                        <span className="input">
                            <select id="type" name="type" value={patient.type}>
                                {types.map(x => <option key={x.value} value={x.value}>{x.text}</option>)}
                            </select>
                        </span>
                    </p>
                    <input className="button submit" type="submit" value="Save" />
                </fieldset>
            </form>
        </section>
    );
}

export default AddProtocol;