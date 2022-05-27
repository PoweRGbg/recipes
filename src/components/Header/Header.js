import { Link } from 'react-router-dom';
import { isAnon } from '../../common/utils';

import { useAuthContext } from '../../contexts/AuthContext';

const Header = ({mongoContext: {app, user, setUser}}) => {

    let guestNavigation = (
        <div id="guest">
            <Link className="button" to="/signin">Влез</Link>
            <Link to="/signup" className="button">Регистрация</Link>
        </div>
    );

    let userNavigation = (
        <div id="user">
            <span>Здравей, {user?.profile.email}</span>
            <Link className="button" to="/dashboard">Пациенти</Link>
            <Link className="button" to="/create">Добави пациент</Link>
            <Link className="button" to="/logout">Излез</Link>
        </div>
    );

    return (
        <header id="site-header">
            <nav className="navbar">
                <section className="navbar-dashboard">
                    {!isAnon(user)
                        ? userNavigation
                        : guestNavigation
                    }
                </section>
            </nav>
        </header>
    );
}

export default Header;