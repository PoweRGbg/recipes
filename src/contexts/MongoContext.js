import React from 'react'

export const MongoContext = React.createContext({
    app: null,
    client: null,
    user: null,
    setApp: () => {},
    setClient: () => {},
    setUser: () => {}
});
