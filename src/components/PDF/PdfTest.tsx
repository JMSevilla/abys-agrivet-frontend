


import WebViewer from "@pdftron/webviewer";
import { useEffect, useRef } from "react";
type Props = {
    path: string
}
const PdfTest: React.FC<Props> = ({path}) => {
    const viewerDiv = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if(typeof window !== 'undefined') {
            WebViewer({ path: 'lib', initialDoc: path, licenseKey: 'demo:1689064766749:7c636e8303000000000ea9b2102d661862d0a2468a02da4796506ad4a6'}, viewerDiv.current as HTMLDivElement)
                .then(instance => {
                   
                })
        }
    }, [])
    return (
        <>
            <div className="webviewer" ref={viewerDiv} style={{ height: '100vh'}}></div>
        </>
    )
}

export default PdfTest