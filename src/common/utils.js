const ddmmyyyy = function(date) {
    var mm = date.getMonth() + 1; // getMonth() is zero-based
    var dd = date.getDate();
    
    return [(dd>9 ? '' : '0') + dd,
    (mm>9 ? '' : '0') + mm,
    date.getFullYear()
    
].join('-');
};


export default ddmmyyyy;