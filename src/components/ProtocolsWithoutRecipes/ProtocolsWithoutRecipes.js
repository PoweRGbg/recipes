import useLonelyProtocolsState from "../../hooks/useLonelyProtocolsState";
import { useAuthContext } from '../../contexts/AuthContext';

const ProtocolsWithoutRecipes = () => {
    const { user } = useAuthContext(); 
    const [lonelyProtocols] = useLonelyProtocolsState(user);


    return (
        <><div><h4>Протоколи без рецепти:</h4><ul>
            
            {lonelyProtocols && lonelyProtocols.length > 0 ? lonelyProtocols.map(x=>{
                console.log(`Lonely protocols in Dashboard ${lonelyProtocols.length}`);
                return <li key={x._id}> На {x.patientName} за лекарство {x.medication} </li> 
            }):"Няма такива"} 
            
            </ul></div>
        </>
    );
}

export default ProtocolsWithoutRecipes;