export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { base, candidates } = req.body;

  if (!base || !candidates) {
    return res.status(400).json({ error: "Missing base or candidates" });
  }

  const prompt = `Tu es expert en mise en relation humaine au sein de "La Capitainerie", un écosystème qui réunit des personnes partageant la même mécanique de pensée, orienté développement personnel et entrepreneurial.

Voici le profil de référence :
- Nom : ${base.name}
- Âge : ${base.age} ans
- Ville : ${base.city}
- Situation pro : ${base.status}
- Statut familial : ${base.family || "Non renseigné"}
- Style de vie : ${base.lifestyle || "Non renseigné"}
- Passion principale : ${base.passion1 || "Non renseigné"}
- Passion secondaire : ${base.passion2 || "Non renseigné"}
- Domaines d'investissement : ${base.investment || "Non renseigné"}
- Déclencheur d'entrée : ${base.trigger}
- Ce qu'il/elle apporte : ${base.brings}
- Ce qu'il/elle cherche : ${base.needs}
- Mots clés personnalité : ${base.words}
- Informations complémentaires : ${base.extra || "Non renseigné"}

Voici les candidats à évaluer :
${candidates.map((m, i) => `[${i}]
- Nom : ${m.name}
- Âge : ${m.age} ans
- Ville : ${m.city}
- Situation pro : ${m.status}
- Statut familial : ${m.family || "Non renseigné"}
- Style de vie : ${m.lifestyle || "Non renseigné"}
- Passion principale : ${m.passion1 || "Non renseigné"}
- Passion secondaire : ${m.passion2 || "Non renseigné"}
- Domaines d'investissement : ${m.investment || "Non renseigné"}
- Déclencheur d'entrée : ${m.trigger}
- Ce qu'il/elle apporte : ${m.brings}
- Ce qu'il/elle cherche : ${m.needs}
- Mots clés personnalité : ${m.words}
- Informations complémentaires : ${m.extra || "Non renseigné"}`).join('\n\n')}

Évalue la compatibilité entre le profil de référence et chaque candidat en appliquant exactement ces critères et pondérations :

CRITÈRES PRINCIPAUX (80%) :
1. Complémentarité apports/besoins (30%) — ce qu'un membre apporte correspond à ce que l'autre cherche, dans les deux sens
2. Résonance des déclencheurs (25%) — moments de vie similaires ou complémentaires qui créent des liens profonds
3. Compatibilité de personnalité (15%) — les profils se complètent ou se ressemblent de façon cohérente
4. Potentiel de valeur mutuelle long terme (10%) — qualité de la relation dans la durée

CRITÈRES SECONDAIRES (20%) :
5. Passions communes ou complémentaires (7%)
6. Style de vie compatibles - casanier vs voyageur (5%)
7. Statut familial compatible (4%)
8. Domaines d'investissement communs ou complémentaires (4%)

Réponds UNIQUEMENT en JSON valide sans markdown ni explication :
{"matches":[{"index":0,"score":85,"reasoning":"2-3 phrases en français expliquant précisément pourquoi ce match est pertinent en référençant les critères les plus forts"}]}

Trie par score décroissant. Scores entre 0 et 100.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
