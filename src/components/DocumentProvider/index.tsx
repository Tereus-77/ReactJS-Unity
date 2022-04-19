import React, { useContext, useState } from "react";
import { documentInfo } from "../../model";

const DocumentContext = React.createContext<any>(null);

export function useDocument() {
	const context = useContext(DocumentContext);
	return {
		currentDoc:context.currentDoc,
		setDoc: context.setDoc
	};
}

// export function setDocument(doc:documentInfo){
// 	const context = useContext(DocumentContext);
// 	context.setDoc(doc);
// }

export function DocumentProvider({children = null as any}){
	const [currentDoc, setcurrentDoc] = useState<documentInfo>();
	return <DocumentContext.Provider
		value={{
			currentDoc:currentDoc,
			setDoc:setcurrentDoc,
		}}>
		{children}
	</DocumentContext.Provider>
};