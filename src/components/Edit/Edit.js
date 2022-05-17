import { useState } from 'react';
import { useParams } from 'react-router-dom';
import usePatientState from '../../hooks/usePatientState';
import { Alert } from 'react-bootstrap';



const Edit = () => {
    const { petId } = useParams();
    const [errors, setErrors] = useState({name: false})
    const [pet] = usePatientState(petId);

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
                        <label htmlFor="name">Име</label>
                        <span className="input" style={{borderColor: errors.name ? 'red' : 'inherit'}}>
                            <input type="text" name="name" id="name" defaultValue={pet.name} onChange={nameChangeHandler} />
                        </span>
                        <Alert variant="danger" show={errors.name}>{errors.name}</Alert>
                    </p>
                    <p className="field">
                        <label htmlFor="description">Възраст</label>
                        <span className="input">
                            <textarea name="description" id="description" defaultValue={pet.description} />
                        </span>
                    </p>


                    <input className="button submit" type="submit" value="Save" />
                </fieldset>
            </form>
        </section>
    );
}

export default Edit;