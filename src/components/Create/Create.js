import { useNavigate } from 'react-router-dom';
import * as patientService from '../../services/patientService';
import { useAuthContext } from '../../contexts/AuthContext';

const Create = ({mongoContext: {client, user}}) => {
    const navigate = useNavigate();

    const onPatientCreate = async (e) => {
        e.preventDefault();
        let formData = new FormData(e.currentTarget);

        let name = formData.get('name');
        let age = formData.get('age');
        let meds = [];

        // 
        const collection = client.db('recipes').collection('patients');
        collection.insertOne({"name":name, "age": age, "meds": meds}, function(err, res) {
            if (err) alert(err);
          });
    }

    return (
        <section id="create-page" className="create">
            <form id="create-form" onSubmit={onPatientCreate} method="POST">
                <fieldset>
                    <legend>Добави нов пациент</legend>
                    <p className="field">
                        <label htmlFor="name">Име</label>
                        <span className="input">
                            <input type="text" name="name" id="name" placeholder="Name" />
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="age">Възраст</label>
                        <span className="input">
                            <input type="number" name="age" id="age" placeholder="age" ></input>
                        </span>
                    </p>
                

                   
                    <input className="button submit" type="submit" value="Добави пациент" />
                </fieldset>
            </form>
        </section>
    );
}

export default Create;