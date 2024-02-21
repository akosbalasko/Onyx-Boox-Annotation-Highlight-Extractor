import { App, Plugin, PluginSettingTab, Setting, TAbstractFile } from 'obsidian';
import { DEFAULT_SETTINGS, OnyxBooxExtractorSettings } from 'src/models';
import { extractOnyxReadingNotes } from 'src/extract-onyx-notes';
import {FileSuggest, FileSuggestMode} from "./src/utils/suggesters/FileSuggester";
import {FolderSuggest} from "./src/utils/suggesters/FolderSuggester";

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
								await extractOnyxReadingNotesByFile(this.settings, file)
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
				.setPlaceholder('perm.')
				.setValue(this.plugin.settings.permanentNotePrefix)
				.onChange(async (value) => {
					this.plugin.settings.permanentNotePrefix = value;
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
				}))


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

		containerEl.createEl('h2', {text: 'Template Settings'});

		new Setting(this.containerEl)
			.setName("Template folder location")
			.setDesc("Files in this folder will be available as templates.")
			.addSearch((cb) => {
				new FolderSuggest(cb.inputEl);
				cb.setPlaceholder("Example: folder1/folder2")
					.setValue(this.plugin.settings.templatesFolder)
					.onChange((new_folder) => {
						this.plugin.settings.templatesFolder = new_folder;
						this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Permanent note template')
			.setDesc('')
			.addSearch((cb) => {
				new FileSuggest(cb.inputEl,this.plugin, FileSuggestMode.TemplateFiles);
				cb.setPlaceholder('permanent note.md')
					.setValue(this.plugin.settings.permanentNoteTemplatePath)
					.onChange(async (value) => {
						this.plugin.settings.permanentNoteTemplatePath = value;
						await this.plugin.saveSettings();
					});
			});
		new Setting(containerEl)
			.setName('Literature note template')
			.setDesc('')
			.addSearch((cb) => {
				new FileSuggest(cb.inputEl,this.plugin, FileSuggestMode.TemplateFiles);
				cb.setPlaceholder('literature note.md')
					.setValue(this.plugin.settings.literatureNoteTemplatePath)
					.onChange(async (value) => {
						this.plugin.settings.literatureNoteTemplatePath = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName('Reference note template')
			.setDesc('')
			.addSearch((cb) => {
				new FileSuggest(cb.inputEl,this.plugin, FileSuggestMode.TemplateFiles);
				cb.setPlaceholder('reference note.md')
					.setValue(this.plugin.settings.referenceNoteTemplatePath)
					.onChange(async (value) => {
						this.plugin.settings.referenceNoteTemplatePath = value;
						await this.plugin.saveSettings();
					});
			});

	}
}

async function extractOnyxReadingNotesByFile(settings: OnyxBooxExtractorSettings, file: TAbstractFile) {
	const fileContent = await this.app.vault.cachedRead(file)
	await extractOnyxReadingNotes(this.app.vault, settings, fileContent);
}



