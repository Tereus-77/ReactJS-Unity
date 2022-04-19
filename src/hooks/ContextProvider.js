import React, {useState} from 'react'

export const Context = React.createContext()


const ContextProvider = (props) => {
    const {children} = props
    const [contextUser, setContextUser] = useState("104")
    const [absorbeDataUser, setAbsorbeDataUser] = useState({})
    
    const context = {
        contextUser,
        setContextUser,
        absorbeDataUser, 
        setAbsorbeDataUser
    }

    return (
        <Context.Provider value={context}>
            {children}
        </Context.Provider>
    )
}

export default ContextProvider
