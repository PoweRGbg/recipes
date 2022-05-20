import { Link } from 'react-router-dom';

import { useAuthContext } from '../../contexts/AuthContext';

const Header = () => {
    const { user } = useAuthContext();

    let guestNavigation = (
        <div id="guest">
            <Link className="button" to="/login">Влез</Link>
            <Link to="/register" className="button">Регистрация</Link>
        </div>
    );

    let userNavigation = (
        <div id="user">
            <span>Здравей, {user.email}</span>
            <Link className="button" to="/my-patients">Пациенти</Link>
            <Link className="button" to="/create">Добави пациент</Link>
            <Link className="button" to="/logout">Излез</Link>
        </div>
    );

    return (
        <header id="site-header">
            <nav className="navbar">
                <section className="navbar-dashboard">
                    <Link to="/dashboard">Табло</Link>

                    {user.email
                        ? userNavigation
                        : guestNavigation
                    }
                </section>
            </nav>
        </header>
    );
}

export default Header;