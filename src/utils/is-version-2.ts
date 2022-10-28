export const isVersion2 = (fileContent: string): boolean => {
	return !fileContent.contains('【Original Text】')

}
