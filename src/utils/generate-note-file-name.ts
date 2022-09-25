import { OnyxBooxExtractorSettings } from "src/models";

export enum NoteType {
	Reference = 'referenceNotePrefix',
	Literature = 'literatureNotePrefix',
	Permanent = 'permanentNotePrefix',
}

export const generateNoteFileName = (settings: OnyxBooxExtractorSettings, noteType: NoteType, fileName: string, uniquePostfix: string): string => {
	if (noteType === NoteType.Permanent)
		return `${settings[noteType]}${uniquePostfix}`;

	const fileNamePart = fileName.trim().replace(/\s/g,'_').toLowerCase();
	return `${settings[noteType]}${fileNamePart}.${uniquePostfix}`;
	
}
