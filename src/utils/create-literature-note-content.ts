import { ReadingNoteDetails, ReferenceNoteDetails } from "src/models"

export const createLiteratureNoteContent = (noteDetails: ReadingNoteDetails, referenceNoteId: string, referenceInfo: ReferenceNoteDetails): string => {
	return `---
_Source: ${referenceInfo.title}
_Section_: ${noteDetails.section}
_Page Number_: ${noteDetails.page}
_Time_: ${noteDetails.creationTime.toISOString()}

---

> ${noteDetails.originalText}

---

_Reference Note_: [[${referenceNoteId}]]

---`

}
