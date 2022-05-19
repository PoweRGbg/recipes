import PatientList from '../PatientList';
import './Dashboard.css';
import { useAuthContext } from '../../contexts/AuthContext';
import ExpiringProtocols from '../ExpiringProtocols/ExpiringProtocols';

const Dashboard = () => {
    const { user } = useAuthContext();


    return (
        <>

        <section id="details-page" className="details">
            <h2>Предстоящи събития</h2>
            <ExpiringProtocols />
                    
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