import { ReadingNoteDetails } from "./models";
import { getStringBetween } from "./utils";

export const parseNote = (readingNote: string): ReadingNoteDetails => {
	const readingNoteLines = readingNote.split('\n');

	return {
		section: readingNoteLines[1],
		creationTime: new Date(getStringBetween(readingNote,'Time：', '【Original Text】').trim()),
		originalText: getStringBetween(readingNote,'【Original Text】', '【Annotations】'),
		annotation: getStringBetween(readingNote, '【Annotations】', '【Page Number】'),
		page: Number(getStringBetween(readingNote,'【Page Number】', '\n').trim()),
	};
}
