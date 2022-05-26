import { Formik } from 'formik'
import { Button, Form } from 'react-bootstrap'
import * as yup from 'yup'
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import Loading from '../Loading/Loading.js'
import * as Realm from 'realm-web';
import {isAnon} from '../../common/utils'

const userSchema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup.string().required().min(8)
})

const Authentication = ({mongoContext: {app, user, setUser}, type = 'login'}) => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {	
        if (!isAnon(user)) {
            navigate('/')
        }
    }, [navigate, user]);

    async function submitHandler (e) {
        setLoading(true);
        e.preventDefault();

        let formData = new FormData(e.currentTarget);

        let email = formData.get('email');
        let password = formData.get('password');
        if (type === 'create') {
            //create
            await app.emailPasswordAuth.registerUser(email, password);
        }

        //login user and redirect to home
        const credentials = Realm.Credentials.emailPassword(email, password);
        setUser(await app.logIn(credentials));
        setLoading(false);
    }

    return (
        <section id="login-page" className="login">
            <form id="login-form" onSubmit={submitHandler} method="POST">
                <fieldset>
                    <legend>{type == "login" ? "Login": "Signup"} Form</legend>
                    <p className="field">
                        <label htmlFor="email">Email</label>
                        <span className="input">
                            <input type="text" name="email" id="email" placeholder="Email" />
                        </span>
                    </p>
                    <p className="field">
                        <label htmlFor="password">Password</label>
                        <span className="input">
                            <input type="password" name="password" id="password" placeholder="Password" />
                        </span>
                    </p>
                    <input className="button submit" type="submit" value="Login" />
                </fieldset>
            </form>
        </section>
    )
}

export default Authentication;