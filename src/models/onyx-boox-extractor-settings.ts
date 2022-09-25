
export interface OnyxBooxExtractorSettings {
	permanentNotePrefix: string;
	referenceNotePrefix: string;
	literatureNotePrefix: string;
	createReferenceNote: boolean;
	
}

export const DEFAULT_SETTINGS: OnyxBooxExtractorSettings = {
	permanentNotePrefix: 'perm.',
	literatureNotePrefix: 'lit.',
	referenceNotePrefix: 'ref.',
	createReferenceNote: true,
}
