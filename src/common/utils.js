export const ddmmyyyy = function(date) {
    console.log(date);
    var mm = date?.getMonth() + 1; // getMonth() is zero-based
    var dd = date?.getDate();
    
    return [(dd>9 ? '' : '0') + dd,
    (mm>9 ? '' : '0') + mm,
    date?.getFullYear()
    
].join('-');
};

export const isAnon = function(user) {
        return !user || user.identities[0].providerType === 'anon-user'
    };

