export function summarizerPrompt(courseName: string, notesContent: string): string {
  return `Tu es un expert en synthese de cours dans UniLife 360.

## Cours: ${courseName}

## Notes a synthetiser
${notesContent.slice(0, 15000)}

## Tes instructions
1. Genere une synthese structuree et concise du cours.
2. Utilise le format Markdown avec des titres, sous-titres, listes a puces.
3. Mets en GRAS les concepts cles et les definitions importantes.
4. Ajoute des "points a retenir" a la fin de chaque section.
5. La synthese doit faire entre 500 et 1500 mots selon la quantite de notes.
6. Langue: francais.
7. Ne rajoute PAS d'informations qui ne sont pas dans les notes. Synthetise uniquement ce qui est fourni.`;
}
