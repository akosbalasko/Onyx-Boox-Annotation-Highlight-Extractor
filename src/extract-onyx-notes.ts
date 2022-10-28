import { createReferenceNote } from "./create-reference-note";
import { createZettelNotes } from "./create-zettel-notes";
import { OnyxBooxExtractorSettings, ReadingNoteDetails, ReferenceNoteDetails } from "./models";
import { parseNote } from "./parse-onyx-note";
import { isVersion2 } from "./utils/is-version-2";

const extractOnyxReadingNotesV1 = async (vault: any, settings: OnyxBooxExtractorSettings, fileContent: string) => {

	const NOTE_SEPARATOR = '-------------------';
	let readingNotesStringArray = fileContent.split(NOTE_SEPARATOR);
	// parse reading note
	// first contains the ref info
	const firstNote = readingNotesStringArray.shift();
	let firstNoteLines = firstNote.split('\n')

	// readingNotesArray 
	const title = firstNoteLines.shift().split('|')[1].replace(/<<|>>/g,'');
	const authors = firstNoteLines.shift();
	firstNoteLines.reverse().push('\n');
	firstNoteLines = firstNoteLines.reverse();
	readingNotesStringArray.push(firstNote);
	readingNotesStringArray = readingNotesStringArray.filter(note => note.contains('【Original Text】'));
	const referenceInfo: ReferenceNoteDetails = {
		title,
		authors,
	};
	const readingNotesArray = readingNotesStringArray.map(note => {return {raw: note}});
	const referenceNoteId = await createReferenceNote(vault, settings, referenceInfo);
	for (const readingNote of readingNotesArray){
		const noteDetails = parseNote(readingNote);
		await createZettelNotes(vault, settings, referenceNoteId, referenceInfo, noteDetails);
		
	}
}

const extractOnyxReadingNotesV2 = async (vault: any, settings: OnyxBooxExtractorSettings, fileContent: string) => {

	const NOTE_SEPARATOR = '-------------------';
	const mainMetadata = fileContent.split('\n')[0];
	let readingNotesArray = fileContent.split('\n')
	readingNotesArray.shift();
	readingNotesArray = readingNotesArray.join('\n').split(NOTE_SEPARATOR);
	// parse reading note
	// first contains the ref info
	/*const firstNote = readingNotesArray.shift();
	let firstNoteLines = firstNote.split('\n')
*/
	// readingNotesArray 
	const titleAndAuthor = mainMetadata.split('|')[1];
	const title = titleAndAuthor.split('>>')[0].replace(/<|>/g, '');
	const authors = titleAndAuthor.split('>>')?.[1];
	/*firstNoteLines = firstNoteLines.reverse()
	firstNoteLines.push('\n');
	firstNoteLines = firstNoteLines.reverse();
	readingNotesArray = readingNotesArray.reverse()
	readingNotesArray.push(firstNote);
	readingNotesArray = readingNotesArray.reverse();*/
	//readingNotesArray = readingNotesArray.filter(note => note.contains('【Original Text】'));
	const referenceInfo: ReferenceNoteDetails = {
		title,
		authors,
	};
	// parse chapters
	const readingNotesArrayObj = parseChapters(readingNotesArray);
	const referenceNoteId = await createReferenceNote(vault, settings, referenceInfo);
	for (const readingNote of readingNotesArrayObj){
		const noteDetails = parseNote(readingNote);
		await createZettelNotes(vault, settings, referenceNoteId, referenceInfo, noteDetails);
		
	}
}

const parseChapters = (readingNotesArray: Array<string>): Array<ReadingNoteDetails> => {
	let currentChapter;
	const readingNotes = [];
	for (const note of readingNotesArray){
		const noteLines = note.split('\n').filter(line=> line !== '');
		// trying to parse the creation date 
		const fullFirstLine = noteLines[0];
		const creationTimeCandidate = fullFirstLine?.split('|')[0].trim();
		const creationTimeCandidateDate = new Date(creationTimeCandidate);
		if (creationTimeCandidateDate.toString() === 'Invalid Date'){
			currentChapter = fullFirstLine
			noteLines.splice(0,1);
		}
		readingNotes.push({
			section: currentChapter,
			raw: noteLines.join('\n')
		})
	}
	return readingNotes;
}

export const extractOnyxReadingNotes = async (vault: any, settings: OnyxBooxExtractorSettings, fileContent: string) => {
	if (isVersion2) await extractOnyxReadingNotesV2(vault, settings, fileContent)
	else await extractOnyxReadingNotesV1(vault, settings, fileContent)

}
