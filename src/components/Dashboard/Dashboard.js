import PatientList from '../PatientList';
import './Dashboard.css';
import ExpiringProtocols from '../ExpiringProtocols/ExpiringProtocols';
import ExpiringRecipes from '../ExpiringRecipes';
import ProtocolsWithoutRecipes from '../ProtocolsWithoutRecipes/ProtocolsWithoutRecipes';
import { MongoContext } from '../../contexts/MongoContext';

const Dashboard = () => {

    function renderComponent (Component, additionalProps = {}) {
        return <MongoContext.Consumer>{(mongoContext) => <Component mongoContext={mongoContext} {...additionalProps} />}</MongoContext.Consumer>
      };

    return (
        <>

        <section id="details-page" className="dashboard">
            <h1>Предстоящи събития</h1>
            <section>
            {/* <ul className="other-patients-list">
            <li className="otherPet">{renderComponent(ExpiringProtocols)}</li>
            <li className="otherPet">{renderComponent(ExpiringRecipes)}</li>
            <li className="otherPet">{renderComponent(ProtocolsWithoutRecipes)}</li>
            </ul> */}
            </section>                    
        </section>
        
        <section id="dashboard-page" className="dashboard">
            <h1>Пациенти</h1>

            <section>
                {renderComponent(PatientList)}
            </section>
        </section>
        </>
        
    );
}

export default Dashboard;