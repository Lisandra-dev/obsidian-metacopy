import {App, FuzzySuggestModal, TFile} from "obsidian";
import {MetaCopySettings} from "./settings";
import {copy, createLink} from "./src/utils";
import {getAllMeta} from "./src/metadata";
import { t } from "./i18n";


interface CopyMetaModal {
	key: string;
	value: string;
}


export class CopyMetaSuggester extends FuzzySuggestModal<CopyMetaModal> {
	app: App;
	file: TFile;
	settings: MetaCopySettings;

	constructor(app: App, settings: MetaCopySettings, file: TFile) {
		super(app);
		this.file = file;
		this.settings = settings;
	}

	getItemText(item: CopyMetaModal): string {
		return item.key;
	}

	getItems(): CopyMetaModal[] {
		return getAllMeta(this.app, this.file, this.settings);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	onChooseItem(item: CopyMetaModal, evt: MouseEvent | KeyboardEvent): void {
		item.value = item.value.toString();
		if (item.value.split(",").length > 1) {
			item.value = "- " + item.value.replaceAll(",", "\n- ");
		}
		let contents = item.value;
		const cmd = t("command.suggesterCopyURL") as string;
		if (item.key === cmd) {
			contents = createLink(
				this.file,
				this.settings,
				{frontmatterKey: item.key, correspondingValue: item.value},
				this.app
			);
		}
		
		copy(contents, item.key, this.settings).then();
	}
}
