import { ReferenceNoteDetails } from "src/models";

export const createReferenceNoteContent = (referenceInfo: ReferenceNoteDetails): string => {
return`

Title: ${referenceInfo.title}
Authors: ${referenceInfo.authors}
`
}
