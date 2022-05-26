import PatientList from '../PatientList';
import './Dashboard.css';
import ExpiringProtocols from '../ExpiringProtocols/ExpiringProtocols';
import ExpiringRecipes from '../ExpiringRecipes';
import ProtocolsWithoutRecipes from '../ProtocolsWithoutRecipes/ProtocolsWithoutRecipes';

const Dashboard = () => {


    return (
        <>

        <section id="details-page" className="dashboard">
            <h1>Предстоящи събития</h1>
            <section>
            <ul className="other-patients-list">
            <li className="otherPet"><ExpiringProtocols /></li>
            <li className="otherPet"><ExpiringRecipes /></li>
            <li className="otherPet"><ProtocolsWithoutRecipes /></li>
            </ul>
            </section>                    
        </section>
        
        <section id="dashboard-page" className="dashboard">
            <h1>Пациенти</h1>

            <section>
                <PatientList />
            </section>
        </section>
        </>
        
    );
}

export default Dashboard;