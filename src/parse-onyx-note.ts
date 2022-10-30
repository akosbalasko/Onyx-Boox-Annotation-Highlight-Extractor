import { ReadingNoteDetails } from "./models";
import { getStringBetween } from "./utils";
import { isVersion2 } from "./utils/is-version-2";

export const parseNote = (readingNote: ReadingNoteDetails): ReadingNoteDetails => {
	return (readingNote.raw && isVersion2(readingNote.raw))
		? parseNoteV2(readingNote)
		: parseNoteV1(readingNote)
	
}

const parseNoteV1 = (readingNoteObj: ReadingNoteDetails): ReadingNoteDetails => {
	const readingNote = readingNoteObj?.raw;
	const readingNoteLines = readingNote.split('\n');

	return {
		section: readingNoteLines[1],
		creationTime: new Date(getStringBetween(readingNote,'Time：', '【Original Text】').trim()),
		originalText: getStringBetween(readingNote,'【Original Text】', '【Annotations】'),
		annotation: getStringBetween(readingNote, '【Annotations】', '【Page Number】'),
		page: Number(getStringBetween(readingNote,'【Page Number】', '\n').trim()),
	};
}


const parseNoteV2 = (readingNoteObj: ReadingNoteDetails): ReadingNoteDetails => {
	const readingNote = readingNoteObj?.raw;

	const readingNoteLines = readingNote.split('\n');
	const firstNoteLine = readingNoteLines[0]
	readingNoteLines.shift() // remove metadata

	return {
		section: readingNoteObj.section,
		creationTime: new Date(firstNoteLine.split('|')[0].trim()),
		originalText: readingNoteLines.join('\n').split('【Note】')[0],
		annotation: (readingNote.split('【Note】').length > 0) ? readingNote.split('【Note】')[1]: undefined ,
		page: Number(firstNoteLine.split('Page No.:')[1].trim()),
	};
}
