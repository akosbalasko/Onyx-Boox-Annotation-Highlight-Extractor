import { App, Plugin, PluginSettingTab, Setting, TAbstractFile } from 'obsidian';
import { customAlphabet } from 'nanoid'

// Remember to rename these classes and interfaces!

interface OnyxBooxExtractorSettings {
	permanentNotePrefix: string;
	permanentNoteTemplatePath: string;
	referenceNotePrefix: string;
	referenceNoteTemplatePath: string;
	literatureNotePrefix: string;
	literatureNoteTemplatePath: string;
	createReferenceNote: boolean;
	
}

const DEFAULT_SETTINGS: OnyxBooxExtractorSettings = {
	permanentNotePrefix: 'perm.',
	permanentNoteTemplatePath: '',
	literatureNotePrefix: 'lit.',
	literatureNoteTemplatePath: '',
	referenceNotePrefix: 'ref.',
	referenceNoteTemplatePath: '',
	createReferenceNote: true,
}

export default class OnyxBooxExtractorPlugin extends Plugin {
	settings: OnyxBooxExtractorSettings;

	async onload() {
		await this.loadSettings();

		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				menu.addItem((item) => {
					item.setTitle("Extract Onyx file")
						.setIcon("document")
						.onClick(async () => {
								await extractOnyxReadingNotesByFile(file)
						});
				});
			})
	);


		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new OnyxBooxExtractorSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class OnyxBooxExtractorSettingTab extends PluginSettingTab {
	plugin: OnyxBooxExtractorPlugin;

	constructor(app: App, plugin: OnyxBooxExtractorPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Settings'});

		new Setting(containerEl)
			.setName('Permanent note id prefix')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('pre.')
				.setValue(this.plugin.settings.permanentNotePrefix)
				.onChange(async (value) => {
					this.plugin.settings.permanentNotePrefix = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Permanent note template path')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('/templates/onyx_permanent.md')
				.setValue(this.plugin.settings.permanentNoteTemplatePath)
				.onChange(async (value) => {
					this.plugin.settings.permanentNoteTemplatePath = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Literature note id prefix')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('lit.')
				.setValue(this.plugin.settings.literatureNotePrefix)
				.onChange(async (value) => {
					this.plugin.settings.literatureNotePrefix = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Literature note template path')
			.setDesc('Example: /templates/onyx_literature.md')
			.addText(text => text
				.setValue(this.plugin.settings.literatureNoteTemplatePath)
				.onChange(async (value) => {
					this.plugin.settings.literatureNoteTemplatePath = value;
					await this.plugin.saveSettings();
				}));
	new Setting(containerEl)
			.setName('Create Reference Notes?')
			.setDesc('')
			.addToggle(text => text
				.setValue(this.plugin.settings.createReferenceNote)
				.onChange(async (value) => {
					this.plugin.settings.createReferenceNote = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('References note id prefix')
			.setDesc('')
			.addText(text => text
				.setPlaceholder('ref.')
				.setValue(this.plugin.settings.referenceNotePrefix)
				.onChange(async (value) => {
					this.plugin.settings.referenceNotePrefix = value;
					await this.plugin.saveSettings();
				}));
		new Setting(containerEl)
			.setName('Reference note template path')
			.setDesc('Example: /templates/onyx_reference.md')
			.addText(text => text
				.setValue(this.plugin.settings.referenceNoteTemplatePath)
				.onChange(async (value) => {
					this.plugin.settings.referenceNoteTemplatePath = value;
					await this.plugin.saveSettings();
				}));
	}
}
async function extractOnyxReadingNotesByFile(file: TAbstractFile) {
	const fileContent = await this.app.vault.cachedRead(file)
	await extractOnyxReadingNotes(fileContent);
}
async function extractOnyxReadingNotes(fileContent: string){
	const NOTE_SEPARATOR = '-------------------';
	let readingNotesArray = fileContent.split(NOTE_SEPARATOR);
	// parse reading note
	// first contains the ref info
	const firstNote = readingNotesArray.shift();
	let firstNoteLines = firstNote.split('\n')

	// readingNotesArray 
	const title = firstNoteLines.shift().split('|')[1].replace(/<<|>>/g,'');
	const authors = firstNoteLines.shift();
	firstNoteLines.reverse().push('\n');
	firstNoteLines = firstNoteLines.reverse();
	readingNotesArray.push(firstNote);
	readingNotesArray = readingNotesArray.filter(note => note.contains('【Original Text】'));
	const referenceInfo: ReferenceNoteDetails = {
		title,
		authors,
	};
	const referenceNoteId = await createReferenceNote(referenceInfo);
	for (const readingNote of readingNotesArray){
		const noteDetails = parseNote(readingNote);
		await createZettelNotes(referenceNoteId, referenceInfo, noteDetails);
		
	}
}

async function createReferenceNote(referenceInfo: ReferenceNoteDetails): Promise<string> {
	const zettelId = generateZettelId();
	const creferenceNoteContent = `

Title: ${referenceInfo.title}
Authors: ${referenceInfo.authors}
`
	await this.app.vault.create(`ref.${referenceInfo.title.trim().replace(/\s/g,'_').toLowerCase()}.${zettelId}.md`, creferenceNoteContent);

	return `ref.${referenceInfo.title.trim().replace(/\s/g,'_').toLowerCase()}.${zettelId}`;

}
function createLiteratureNoteContent(litId: string, noteDetails: ReadingNoteDetails, referenceNoteId: string, referenceInfo: ReferenceNoteDetails): string {
	return `---
_Source: ${referenceInfo.title}
_Section_: ${noteDetails.section}
_Page Number_: ${noteDetails.page}
_Time_: ${noteDetails.creationTime.toISOString()}

---

> ${noteDetails.originalText}

---

_Reference Note_: [[${referenceNoteId}]]

---`

}
function createPermanentNoteContent(zettelId: string, noteDetails: ReadingNoteDetails,literatureFileName: string, referenceNoteId: string, referenceInfo: ReferenceNoteDetails): string {
	return (noteDetails.annotation?.replace(/\n/g,'').trim() === '')
		? undefined
		: `---

tags: 
  - permanent_note
  - ${referenceInfo.title.replace(/ /g,'_')}

---

${noteDetails.annotation}

---

_Literature Note_: [[${literatureFileName}]]
_Reference Note_: [[${referenceNoteId}]]

---
`;
}

async function createZettelNotes(referenceNoteId: string, referenceInfo: ReferenceNoteDetails, noteDetails: ReadingNoteDetails): Promise<void> {
	const zettelId = generateZettelId(noteDetails.creationTime);
	const litId = `lit.${referenceInfo.title.trim().replace(/\s/g,'_').toLowerCase()}.${zettelId}`
	const literatureNoteContent = createLiteratureNoteContent(litId, noteDetails, referenceNoteId, referenceInfo)
	await this.app.vault.create(`${litId}.md`, literatureNoteContent);
	const permanentNoteContent = createPermanentNoteContent(zettelId, noteDetails, litId, referenceNoteId, referenceInfo)
	if (permanentNoteContent)
		await this.app.vault.create(`perm.${zettelId}.md`, permanentNoteContent);
}

function generateZettelId(zettelDate?: Date): string {
	const nanoid = customAlphabet('1234567890abcdef', 10)
	
	if (!zettelDate)
		zettelDate = new Date();
	return `${zettelDate.toISOString().replace(/-|:|\./g,'')}-${nanoid(5)}`;
}
interface ReadingNoteDetails {
	section: string;
	creationTime: Date;
	page: number;
	originalText: string;
	annotation: string;
}
interface ReferenceNoteDetails {
	title: string,
	authors: string,
}

function parseNote(readingNote: string): ReadingNoteDetails {
	const readingNoteLines = readingNote.split('\n');

	return {
		section: readingNoteLines[1],
		creationTime: new Date(getStringBetween(readingNote,'Time：', '【Original Text】').trim()),
		originalText: getStringBetween(readingNote,'【Original Text】', '【Annotations】'),
		annotation: getStringBetween(readingNote, '【Annotations】', '【Page Number】'),
		page: Number(getStringBetween(readingNote,'【Page Number】', '\n').trim()),
	};
}

function getStringBetween(text: string, after: string, before: string): string {
	const textArray =text.split(after);

	return (textArray.length > 0)
		? textArray[1].split(before)[0]
		: ''

}
