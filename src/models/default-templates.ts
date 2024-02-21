export const defaultPermanentTemplate = `---

	tags:
- {{referenceInfo.titleSlug}}

---
	<% await tp.file.move("/" + tp.file.title) %>

{{noteDetails.annotation}}

---

	_Literature Note_: [[{{literatureNote}}]]
_Reference Note_: [[{{referenceNote}}]]

---`

export const defaultLiteratureTemplate = `---
Source: {{referenceInfo.title}}
Section: {{noteDetails.section}}
Page Number: {{noteDetails.page}}
Time: {{noteDetails.isoCreationTime}}

---


<% await tp.file.move("/" + tp.file.title) %>

> {{noteDetails.originalText}}

---

Reference Note: [[{{referenceNote}}]]

---
`

export const defaultReferenceTemplate = `---
Title: {{referenceInfo.title}}
Authors: {{referenceInfo.authors}}
---
<% await tp.file.move("/" + tp.file.title) %>
`
