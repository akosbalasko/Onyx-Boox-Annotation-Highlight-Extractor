
export interface OnyxBooxExtractorSettings {
	templatesFolder: string;
	permanentNotePrefix: string;
	referenceNotePrefix: string;
	literatureNotePrefix: string;
	createReferenceNote: boolean;
	permanentNoteTemplatePath: string;
	literatureNoteTemplatePath: string;
	referenceNoteTemplatePath: string;

}

export const DEFAULT_SETTINGS: OnyxBooxExtractorSettings = {
	templatesFolder: '',
	permanentNotePrefix: 'perm.',
	literatureNotePrefix: 'lit.',
	referenceNotePrefix: 'ref.',
	createReferenceNote: true,
	permanentNoteTemplatePath: '',
	literatureNoteTemplatePath: '',
	referenceNoteTemplatePath: '',
}
