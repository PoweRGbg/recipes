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
            <ul class="other-patients-list">
            <li class="otherPet"><ExpiringProtocols /></li>
            <li class="otherPet"><ExpiringRecipes /></li>
            <li class="otherPet"><ProtocolsWithoutRecipes /></li>
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