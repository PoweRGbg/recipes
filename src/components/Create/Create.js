import { useNavigate } from 'react-router-dom';
import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';

const Create = () => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    const onPatientCreate = (e) => {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);

        let name = formData.get('name');
        let age = formData.get('age');
        let meds = [];

        patientService.create({
            name,
            age,
            meds,
        }, user.accessToken)
            .then(result => {
                navigate('/dashboard');
            })
    }

    return (
        <section id="create-page" className="create">
            <form id="create-form" onSubmit={onPatientCreate} method="POST">
                <fieldset>
                    <legend>Add new Patient</legend>
                    <p className="field">
                        <label htmlFor="name">Name</label>
                        <span className="input">
                            <input type="text" name="name" id="name" placeholder="Name" />
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="age">Age</label>
                        <span className="input">
                            <input type="number" name="age" id="age" placeholder="age" ></input>
                        </span>
                    </p>
                

                   
                    <input className="button submit" type="submit" value="Add patient" />
                </fieldset>
            </form>
        </section>
    );
}

export default Create;