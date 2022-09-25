import { ReadingNoteDetails, ReferenceNoteDetails } from "src/models";

export const createPermanentNoteContent = (noteDetails: ReadingNoteDetails,literatureFileName: string, referenceNoteId: string, referenceInfo: ReferenceNoteDetails): string => {
	return (noteDetails.annotation?.replace(/\n/g,'').trim() === '')
		? undefined
		: `---

tags: 
  - permanent_note
  - ${referenceInfo.title.replace(/ /g,'_')}

---

${noteDetails.annotation}

---

_Literature Note_: [[${literatureFileName}]]
_Reference Note_: [[${referenceNoteId}]]

---
`;
}
