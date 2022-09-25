
export const getStringBetween = (text: string, after: string, before: string): string => {
	const textArray =text.split(after);

	return (textArray.length > 0)
		? textArray[1].split(before)[0]
		: ''

}
