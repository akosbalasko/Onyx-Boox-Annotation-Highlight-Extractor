## Onyx Boox Annotation & Highlight Extractor 

With this plugin, you can extract your highlights and annotations taken in your Onyx Boox eink device, and convert them to classic Zettelkasten notes. 


## What will you get? 

- If you have read a book in your Onyx Boox, this plugin will generate a `Reference Note` with its metadata (title and author)
- If you highlight a text within the book, this text is going to be a `Literature Note` linked to the Reference note and having metainfo (creation time, page number, section title, book title) stored in the frontmatter.
- If you annotate the highlighted text, the annotation will be a `Permanent Note` linked to the Literature note and the Reference note as well. 

The main benefit is that you can write your thoughts directly into the book what you currently read, and the plugin will integrate them into your Second Brain. 

## Current note formats:

The plugin generated the different notes as follows: 

### Reference notes: 

```

Title: <your book's title>
Authors: <author>

```

### Literature notes:
```
---
_Source_: <Book title>
_Section_: <Section's title>
_Page Number_: <Page number>
_Time_: <highlight creation time>

---

> <the highlighted text>

---

_Reference Note_: <link_to_the_reference_note>

---
```



### Permanent notes: 

```
---

tags: 
  - <book_title_with_underscores_instead_of_spaces>

---

<your annotation>

---

_Literature Note_: <link_to_your_literature_note>
_Reference Note_: <link_to_your_reference_note>

---
```
## Export and extract process from Onyx Boox to Obsidian 

As Onyx Boox provides Android-based eink devices, Obsidian can be installed directly onto them via Google Play. Then, after you set your vault, your sync optionally, and installed and enabled this plugin, the process would be as follows:

1. Export your annotations from your epub locally. You can do this by tapping 'TOC' in the book, then navigate to Annotations in the menu below, select all notes and highlighs, then tap the export icon and select 'Export to local storage'.
2. Then as the appearing pop-up allowing you, 'jump' to that folder in where the exported file has been created. 
3. Change the exported file's extension from txt to md in order to make it visible in Obsidian. You can do it by long tapping the file itself, and tapping 'Rename' button. 
4. Then move the file to the vault's folder. 
5. Then open Obsidian
6. Long-tap the exported file, and select 'Extract Onyx file'.
7. You're done!

If you don't want to install Obsidian onto your Onyx Boox device, you can send the annotation export to yourself via mail, download it to your local machine, change it's extension and put into your Obsidian vault there. 

## Roadmap & Known 'issues'

- The plugin currently generates the files in the root folder of the vault. It can be customized in the upcoming release. 
- No templates-feature still. It will be added soon.
- Tags in Permanent notes are hardcoded, they can be customized in the future.

## Feedback, Appreciation, Donation:
If you have an idea on how to improve the plugin or face any problems, feel free to raise an issue, or even contribute!
If this plugin makes your like easier, pleaes consider giving a star here on github, or supporting me via <a href="https://www.buymeacoffee.com/akosbalasko" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/default-yellow.png" alt="Buy Me A Coffee" height="41" width="174"></a>.

Thanks a lot! 
