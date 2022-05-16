import PatientList from '../PatientList';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <section id="dashboard-page" className="dashboard">
            <h1>Dashboard</h1>

            <section>
                <PatientList />
            </section>
        </section>
        
    );
}

export default Dashboard;