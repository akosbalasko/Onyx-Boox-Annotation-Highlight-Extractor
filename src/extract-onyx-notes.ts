import { createReferenceNote } from "./create-reference-note";
import { createZettelNotes } from "./create-zettel-notes";
import { OnyxBooxExtractorSettings, ReferenceNoteDetails } from "./models";
import { parseNote } from "./parse-onyx-note";

export const extractOnyxReadingNotes = async (vault: any, settings: OnyxBooxExtractorSettings, fileContent: string) => {
	const NOTE_SEPARATOR = '-------------------';
	let readingNotesArray = fileContent.split(NOTE_SEPARATOR);
	// parse reading note
	// first contains the ref info
	const firstNote = readingNotesArray.shift();
	let firstNoteLines = firstNote.split('\n')

	// readingNotesArray 
	const title = firstNoteLines.shift().split('|')[1].replace(/<<|>>/g,'');
	const authors = firstNoteLines.shift();
	firstNoteLines.reverse().push('\n');
	firstNoteLines = firstNoteLines.reverse();
	readingNotesArray.push(firstNote);
	readingNotesArray = readingNotesArray.filter(note => note.contains('【Original Text】'));
	const referenceInfo: ReferenceNoteDetails = {
		title,
		authors,
	};
	const referenceNoteId = await createReferenceNote(vault, settings, referenceInfo);
	for (const readingNote of readingNotesArray){
		const noteDetails = parseNote(readingNote);
		await createZettelNotes(vault, settings, referenceNoteId, referenceInfo, noteDetails);
		
	}
}
