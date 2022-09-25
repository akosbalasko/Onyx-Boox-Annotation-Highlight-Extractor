import { OnyxBooxExtractorSettings, ReferenceNoteDetails, ReadingNoteDetails } from "./models";
import { generateZettelId, generateNoteFileName, NoteType, createLiteratureNoteContent, createPermanentNoteContent } from "./utils";

export const createZettelNotes = async (vault: any, settings: OnyxBooxExtractorSettings, referenceNoteId: string, referenceInfo: ReferenceNoteDetails, noteDetails: ReadingNoteDetails): Promise<void> => {
	const zettelId = generateZettelId(noteDetails.creationTime);
	const litId = generateNoteFileName(settings, NoteType.Literature, referenceInfo.title, zettelId);

	const literatureNoteContent = createLiteratureNoteContent(noteDetails, referenceNoteId, referenceInfo);
	await vault.create(`${litId}.md`, literatureNoteContent);
	const permanentNoteContent = createPermanentNoteContent(noteDetails, litId, referenceNoteId, referenceInfo);
	const permanentNoteFileName = generateNoteFileName( settings, NoteType.Permanent, '', zettelId)
	if (permanentNoteContent)
		await vault.create(`${permanentNoteFileName}.md`, permanentNoteContent);
}
