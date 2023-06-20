import {
    createContext,
    useContext
} from 'react'

type ContextValue = {
    globals: Tenant | null
}

export type Tenant = {
    storedValue: string | undefined
    storedType: number | undefined
}

interface Props {
    globals: Tenant | null
}

const HelperContext = createContext<ContextValue>({
    globals: null
})

export const GlobalsProvider: React.FC<React.PropsWithChildren<Props>> = ({
    children,
    globals
}) => {
    return (
        <HelperContext.Provider
        value={{
          globals  
        }}
        >{children}</HelperContext.Provider>
    )
}

export const useGlobalsContext = () => {
    if(!HelperContext){
        throw new Error("Globals must be used.")
    }
    return useContext(HelperContext)
}