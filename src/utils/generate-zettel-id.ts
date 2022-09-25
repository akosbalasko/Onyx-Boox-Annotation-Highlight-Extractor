import { customAlphabet } from "nanoid";

export const generateZettelId = (zettelDate?: Date): string => {
	const nanoid = customAlphabet('1234567890abcdef', 10)
	
	if (!zettelDate)
		zettelDate = new Date();
	return `${zettelDate.toISOString().replace(/-|:|\./g,'')}-${nanoid(5)}`;
}
