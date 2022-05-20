import PatientList from '../PatientList';
import './Dashboard.css';
import ExpiringProtocols from '../ExpiringProtocols/ExpiringProtocols';
import ExpiringRecipes from '../ExpiringRecipes';
import ProtocolsWithoutRecipes from '../ProtocolsWithoutRecipes/ProtocolsWithoutRecipes';

const Dashboard = () => {


    return (
        <>

        <section id="details-page" className="details">
            <h2>Предстоящи събития</h2>
            <section>

            <ExpiringProtocols />
            <ExpiringRecipes />
            <ProtocolsWithoutRecipes />
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