import {OnyxBooxExtractorSettings, ReferenceNoteDetails} from "./models";
import { generateZettelId, createReferenceNoteContent, generateNoteFileName, NoteType } from "./utils";
import {TFile} from "obsidian";
import {replacePlaceholders} from "./create-zettel-notes";
import {defaultReferenceTemplate} from "./models/default-templates";

export const createReferenceNoteWithTemplater = async (app: any, templater: any, settings: OnyxBooxExtractorSettings, referenceInfo: ReferenceNoteDetails): Promise<string> => {
	const zettelId = generateZettelId();
	const refTemplateName = settings.referenceNoteTemplatePath; // Path to literature note template

	const referenceNoteFileName = generateNoteFileName(settings, NoteType.Reference, referenceInfo.title, zettelId);
	await createRefNoteFromTemplate(app, templater, refTemplateName, referenceNoteFileName, referenceInfo);

	return referenceNoteFileName;

}

async function createRefNoteFromTemplate(app: any, templater: any, templatePath: string, fileName: string, referenceInfo: ReferenceNoteDetails) {
	let templateContent;
	const templateFile = app.vault.getAbstractFileByPath(templatePath);

	if (templateFile && templateFile instanceof TFile) {
		templateContent = await app.vault.read(templateFile);
	} else {
		console.warn(`Template file not found at ${templatePath}`);
		templateContent = defaultReferenceTemplate;
	}

	let populatedTemplate = replacePlaceholders(templateContent, {}, fileName, referenceInfo, "");

	const folder = app.fileManager.getNewFileParent('');
	await templater.create_new_note_from_template(populatedTemplate, folder, fileName);
}

export const createReferenceNote = async (vault: any, settings: OnyxBooxExtractorSettings, referenceInfo: ReferenceNoteDetails): Promise<string> => {
	const zettelId = generateZettelId();
	const referenceNoteContent = createReferenceNoteContent(referenceInfo);
	const referenceNoteFileName = generateNoteFileName(settings, NoteType.Reference, referenceInfo.title, zettelId);
	await vault.create(`${referenceNoteFileName}.md`, referenceNoteContent);

	return referenceNoteFileName;

}
