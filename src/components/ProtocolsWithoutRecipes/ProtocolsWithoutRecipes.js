import useLonelyProtocolsState from "../../hooks/useLonelyProtocolsState";


const ProtocolsWithoutRecipes = () => {
    const [protocols] = useLonelyProtocolsState([]);


    Date.prototype.ddmmyyyy = function() {
        var mm = this.getMonth() + 1; // getMonth() is zero-based
        var dd = this.getDate();
        
        return [(dd>9 ? '' : '0') + dd,
        (mm>9 ? '' : '0') + mm,
        this.getFullYear()
        
    ].join('-');
    };



    return (
        <><div>Протоколи без рецепти:<ul>
            
            {protocols && protocols.length > 0 ? protocols.map(x=>{
                console.log(`Lonely protocols in Dashboard ${protocols.length}`);
                return <li key={x._id}> На {x.patientName} за лекарство {x.medication} на дата {new Date(x.endDate).ddmmyyyy()}</li> 
            }):"Няма такива"} 
            
            </ul></div>
        </>
    );
}

export default ProtocolsWithoutRecipes;