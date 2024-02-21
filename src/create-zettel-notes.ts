import { OnyxBooxExtractorSettings, ReferenceNoteDetails, ReadingNoteDetails } from "./models";
import { generateZettelId, generateNoteFileName, NoteType, createLiteratureNoteContent, createPermanentNoteContent } from "./utils";
import {TFile} from "obsidian";
import {defaultLiteratureTemplate, defaultPermanentTemplate} from "./models/default-templates";

export const createZettelNotesWithTemplater = async (app: any, templater: any, settings: OnyxBooxExtractorSettings, referenceNoteId: string, referenceInfo: ReferenceNoteDetails, noteDetails: ReadingNoteDetails) => {
	const zettelId = generateZettelId(noteDetails.creationTime);
	const litTemplateName = settings.literatureNoteTemplatePath; // Path to literature note template
	const permTemplateName = settings.permanentNoteTemplatePath; // Path to permanent note template

	const literatureNoteFileName = generateNoteFileName(settings, NoteType.Literature, referenceInfo.title, zettelId);
	const permanentNoteFileName = generateNoteFileName(settings, NoteType.Permanent, '', zettelId);


	await createNoteFromTemplate(NoteType.Literature, app, templater, litTemplateName, literatureNoteFileName, noteDetails, referenceNoteId, referenceInfo, literatureNoteFileName);

	const permNoteContent = createPermanentNoteContent(noteDetails, literatureNoteFileName, referenceNoteId, referenceInfo);
	if (permNoteContent) {
		await createNoteFromTemplate(NoteType.Permanent, app, templater, permTemplateName, permanentNoteFileName, noteDetails, referenceNoteId, referenceInfo, literatureNoteFileName);
	}
};

async function createNoteFromTemplate(noteType: string, app: any, templater: any, templatePath: string, fileName: string, noteDetails: ReadingNoteDetails, referenceNoteId: string, referenceInfo: ReferenceNoteDetails, literatureNoteId: string) {
	// Locate template file
	let templateContent;
	const templateFile = app.vault.getAbstractFileByPath(templatePath);

	if (templateFile && templateFile instanceof TFile) {
		templateContent = await app.vault.read(templateFile);
	} else {
		console.warn(`Template file not found at ${templatePath}`);
		templateContent = noteType === NoteType.Literature ? defaultLiteratureTemplate : defaultPermanentTemplate;
	}

	let content = replacePlaceholders(templateContent, noteDetails, referenceNoteId, referenceInfo, literatureNoteId);

	// Create new note from template
	const folder = app.fileManager.getNewFileParent('');
	const newNote = await templater.create_new_note_from_template(content, folder, fileName);
	console.log("New Note", newNote);

}

export function replacePlaceholders(content: string, noteDetails: ReadingNoteDetails, referenceNoteId: string, referenceInfo: ReferenceNoteDetails, literatureNoteId: string) {
	return content.replace(/{{(.*?)}}/g, (match, path) => {
		// Split the path into parts (e.g., "referenceInfo.title" becomes ["referenceInfo", "title"])
		const parts = path.split('.');

		// Assuming the first part indicates the object and the second part the property
		let obj;
		if (parts[0] === 'noteDetails') obj = noteDetails;
		else if (parts[0] === 'referenceInfo') obj = referenceInfo;
		else if (parts[0] === 'referenceNote') return referenceNoteId; // Direct return for this special case
		else if (parts[0] === 'literatureNote') return literatureNoteId; // Direct return for this special case

		// Access the property dynamically
		const property = parts[1];
		if (obj && property in obj) { // @ts-ignore
			return obj[property];
		}

		// If no valid path is found, return the placeholder unchanged
		return match;
	});
}



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
