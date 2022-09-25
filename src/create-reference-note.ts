import { OnyxBooxExtractorSettings, ReferenceNoteDetails } from "./models";
import { generateZettelId, createReferenceNoteContent, generateNoteFileName, NoteType } from "./utils";


export const createReferenceNote = async (vault: any, settings: OnyxBooxExtractorSettings, referenceInfo: ReferenceNoteDetails): Promise<string> => {
	const zettelId = generateZettelId();
	const referenceNoteContent = createReferenceNoteContent(referenceInfo);
	const referenceNoteFileName = generateNoteFileName(settings, NoteType.Reference, referenceInfo.title, zettelId);
	await vault.create(`${referenceNoteFileName}.md`, referenceNoteContent);

	return referenceNoteFileName;

}
