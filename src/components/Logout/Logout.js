import { useNavigate } from 'react-router-dom';

import * as authService from '../../services/authService';
import { useAuthContext } from '../../contexts/AuthContext';
import { useEffect } from 'react';
import {isAnon} from '../../common/utils';
import Loading from '../Loading/Loading';
import * as Realm from 'realm-web'

const Logout = ({mongoContext: {app, user, setUser, setClient}}) => {
    const navigate = useNavigate();
    

    if (isAnon()) {
        console.log(`You are anonymous! Redirecting!`);
        navigate('/')
    }

    useEffect(() => {
        async function logout () {
            await app.currentUser.logOut()
            //login anon user
            setUser(await app.logIn(Realm.Credentials.anonymous()))
            //set new client
            setClient(app.currentUser.mongoClient('mongodb-atlas'))
        }

        logout();
        // authService.logout(user.accessToken)
        //     .then(() => {
        //         logout();
        //         navigate('/dashboard');
        //     })

    }, [])

    return <Loading />;
};

export default Logout;