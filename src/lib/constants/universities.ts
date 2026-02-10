// UniLife 360 — Liste des universités et hautes écoles (BE + FR)

export interface University {
  name: string;
  shortName?: string;
  city: string;
  country: "BE" | "FR";
  type: "universite" | "haute_ecole" | "grande_ecole";
}

export const UNIVERSITIES: University[] = [
  // ═══════════════════════════════════════
  // BELGIQUE — Universités
  // ═══════════════════════════════════════
  { name: "Université libre de Bruxelles", shortName: "ULB", city: "Bruxelles", country: "BE", type: "universite" },
  { name: "UCLouvain", shortName: "UCLouvain", city: "Louvain-la-Neuve", country: "BE", type: "universite" },
  { name: "Université de Liège", shortName: "ULiège", city: "Liège", country: "BE", type: "universite" },
  { name: "Vrije Universiteit Brussel", shortName: "VUB", city: "Bruxelles", country: "BE", type: "universite" },
  { name: "KU Leuven", shortName: "KU Leuven", city: "Leuven", country: "BE", type: "universite" },
  { name: "Universiteit Gent", shortName: "UGent", city: "Gent", country: "BE", type: "universite" },
  { name: "Universiteit Antwerpen", shortName: "UAntwerpen", city: "Antwerpen", country: "BE", type: "universite" },
  { name: "Université de Namur", shortName: "UNamur", city: "Namur", country: "BE", type: "universite" },
  { name: "Université Saint-Louis - Bruxelles", shortName: "USL-B", city: "Bruxelles", country: "BE", type: "universite" },
  { name: "Université de Mons", shortName: "UMons", city: "Mons", country: "BE", type: "universite" },
  { name: "Hasselt University", shortName: "UHasselt", city: "Hasselt", country: "BE", type: "universite" },

  // ═══════════════════════════════════════
  // BELGIQUE — Hautes Écoles
  // ═══════════════════════════════════════
  { name: "EPHEC", shortName: "EPHEC", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "ICHEC Brussels Management School", shortName: "ICHEC", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Haute École Léonard de Vinci", shortName: "HE Vinci", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Haute École Libre de Bruxelles - Ilya Prigogine", shortName: "HELB", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Haute École Louvain en Hainaut", shortName: "HELHa", city: "Mons", country: "BE", type: "haute_ecole" },
  { name: "HENALLUX", shortName: "HENALLUX", city: "Namur", country: "BE", type: "haute_ecole" },
  { name: "Haute École de Bruxelles", shortName: "HE Bruxelles", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Haute École de la Province de Liège", shortName: "HEPL", city: "Liège", country: "BE", type: "haute_ecole" },
  { name: "Haute École Charlemagne", shortName: "HECh", city: "Liège", country: "BE", type: "haute_ecole" },
  { name: "HELMO", shortName: "HELMo", city: "Liège", country: "BE", type: "haute_ecole" },
  { name: "Haute École Robert Schuman", shortName: "HERS", city: "Arlon", country: "BE", type: "haute_ecole" },
  { name: "Haute École de la Province de Namur", shortName: "HEPN", city: "Namur", country: "BE", type: "haute_ecole" },
  { name: "Haute École en Hainaut", shortName: "HEH", city: "Mons", country: "BE", type: "haute_ecole" },
  { name: "Haute École Francisco Ferrer", shortName: "HEFF", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Haute École Galilée", shortName: "HE Galilée", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Haute École Albert Jacquard", shortName: "HEAJ", city: "Namur", country: "BE", type: "haute_ecole" },
  { name: "ECAM Brussels Engineering School", shortName: "ECAM", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "IHECS - Institut des Hautes Études des Communications Sociales", shortName: "IHECS", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "ESA Saint-Luc Bruxelles", shortName: "Saint-Luc BXL", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "ESA Saint-Luc Liège", shortName: "Saint-Luc LG", city: "Liège", country: "BE", type: "haute_ecole" },
  { name: "La Cambre", shortName: "La Cambre", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "LUCA School of Arts", shortName: "LUCA", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Thomas More", shortName: "Thomas More", city: "Mechelen", country: "BE", type: "haute_ecole" },
  { name: "Odisee", shortName: "Odisee", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Erasmushogeschool Brussel", shortName: "EhB", city: "Bruxelles", country: "BE", type: "haute_ecole" },
  { name: "Artevelde University of Applied Sciences", shortName: "Artevelde", city: "Gent", country: "BE", type: "haute_ecole" },
  { name: "Hogeschool Gent", shortName: "HoGent", city: "Gent", country: "BE", type: "haute_ecole" },
  { name: "AP Hogeschool Antwerpen", shortName: "AP", city: "Antwerpen", country: "BE", type: "haute_ecole" },
  { name: "Karel de Grote Hogeschool", shortName: "KdG", city: "Antwerpen", country: "BE", type: "haute_ecole" },
  { name: "Solvay Brussels School", shortName: "Solvay", city: "Bruxelles", country: "BE", type: "haute_ecole" },

  // ═══════════════════════════════════════
  // FRANCE — Universités
  // ═══════════════════════════════════════
  { name: "Sorbonne Université", shortName: "Sorbonne", city: "Paris", country: "FR", type: "universite" },
  { name: "Université Paris-Saclay", shortName: "Paris-Saclay", city: "Gif-sur-Yvette", country: "FR", type: "universite" },
  { name: "Université PSL", shortName: "PSL", city: "Paris", country: "FR", type: "universite" },
  { name: "Université Paris Cité", shortName: "UPC", city: "Paris", country: "FR", type: "universite" },
  { name: "Université de Strasbourg", shortName: "Unistra", city: "Strasbourg", country: "FR", type: "universite" },
  { name: "Aix-Marseille Université", shortName: "AMU", city: "Marseille", country: "FR", type: "universite" },
  { name: "Université de Bordeaux", shortName: "UBx", city: "Bordeaux", country: "FR", type: "universite" },
  { name: "Université de Lyon", shortName: "UdL", city: "Lyon", country: "FR", type: "universite" },
  { name: "Université Claude Bernard Lyon 1", shortName: "Lyon 1", city: "Lyon", country: "FR", type: "universite" },
  { name: "Université Lumière Lyon 2", shortName: "Lyon 2", city: "Lyon", country: "FR", type: "universite" },
  { name: "Université Jean Moulin Lyon 3", shortName: "Lyon 3", city: "Lyon", country: "FR", type: "universite" },
  { name: "Université de Lille", shortName: "ULille", city: "Lille", country: "FR", type: "universite" },
  { name: "Université de Nantes", shortName: "UN", city: "Nantes", country: "FR", type: "universite" },
  { name: "Université Toulouse III - Paul Sabatier", shortName: "UT3", city: "Toulouse", country: "FR", type: "universite" },
  { name: "Université Toulouse 1 Capitole", shortName: "UT1", city: "Toulouse", country: "FR", type: "universite" },
  { name: "Université de Montpellier", shortName: "UM", city: "Montpellier", country: "FR", type: "universite" },
  { name: "Université Grenoble Alpes", shortName: "UGA", city: "Grenoble", country: "FR", type: "universite" },
  { name: "Université de Rennes", shortName: "UR", city: "Rennes", country: "FR", type: "universite" },
  { name: "Université de Lorraine", shortName: "UL", city: "Nancy", country: "FR", type: "universite" },
  { name: "Université Côte d'Azur", shortName: "UCA", city: "Nice", country: "FR", type: "universite" },
  { name: "Université de Rouen Normandie", shortName: "URN", city: "Rouen", country: "FR", type: "universite" },
  { name: "Université de Poitiers", shortName: "UP", city: "Poitiers", country: "FR", type: "universite" },
  { name: "Université de Tours", shortName: "UT", city: "Tours", country: "FR", type: "universite" },
  { name: "Université de Caen Normandie", shortName: "UNICAEN", city: "Caen", country: "FR", type: "universite" },
  { name: "Université de Dijon", shortName: "uB", city: "Dijon", country: "FR", type: "universite" },
  { name: "Université de Reims Champagne-Ardenne", shortName: "URCA", city: "Reims", country: "FR", type: "universite" },
  { name: "Université de La Réunion", shortName: "UR", city: "Saint-Denis", country: "FR", type: "universite" },
  { name: "Université des Antilles", shortName: "UA", city: "Pointe-à-Pitre", country: "FR", type: "universite" },

  // ═══════════════════════════════════════
  // FRANCE — Grandes Écoles
  // ═══════════════════════════════════════
  { name: "École Polytechnique", shortName: "X", city: "Palaiseau", country: "FR", type: "grande_ecole" },
  { name: "HEC Paris", shortName: "HEC", city: "Jouy-en-Josas", country: "FR", type: "grande_ecole" },
  { name: "ESSEC Business School", shortName: "ESSEC", city: "Cergy", country: "FR", type: "grande_ecole" },
  { name: "Sciences Po Paris", shortName: "Sciences Po", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "CentraleSupélec", shortName: "CS", city: "Gif-sur-Yvette", country: "FR", type: "grande_ecole" },
  { name: "École Normale Supérieure", shortName: "ENS", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "ENS Lyon", shortName: "ENS Lyon", city: "Lyon", country: "FR", type: "grande_ecole" },
  { name: "ESCP Business School", shortName: "ESCP", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "Mines ParisTech", shortName: "Mines", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "INSA Lyon", shortName: "INSA Lyon", city: "Lyon", country: "FR", type: "grande_ecole" },
  { name: "INSA Toulouse", shortName: "INSA Toulouse", city: "Toulouse", country: "FR", type: "grande_ecole" },
  { name: "Arts et Métiers ParisTech", shortName: "ENSAM", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "AgroParisTech", shortName: "AgroParisTech", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "Télécom Paris", shortName: "Télécom", city: "Palaiseau", country: "FR", type: "grande_ecole" },
  { name: "EDHEC Business School", shortName: "EDHEC", city: "Lille", country: "FR", type: "grande_ecole" },
  { name: "EM Lyon Business School", shortName: "EM Lyon", city: "Lyon", country: "FR", type: "grande_ecole" },
  { name: "KEDGE Business School", shortName: "KEDGE", city: "Bordeaux", country: "FR", type: "grande_ecole" },
  { name: "SKEMA Business School", shortName: "SKEMA", city: "Lille", country: "FR", type: "grande_ecole" },
  { name: "Audencia", shortName: "Audencia", city: "Nantes", country: "FR", type: "grande_ecole" },
  { name: "NEOMA Business School", shortName: "NEOMA", city: "Reims", country: "FR", type: "grande_ecole" },
  { name: "École 42", shortName: "42", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "Epitech", shortName: "Epitech", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "EPITA", shortName: "EPITA", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "EFREI Paris", shortName: "EFREI", city: "Paris", country: "FR", type: "grande_ecole" },
  { name: "Sup de Pub", shortName: "Sup de Pub", city: "Paris", country: "FR", type: "grande_ecole" },
];

/** Recherche fuzzy d'universités par nom, shortName ou ville */
export function searchUniversities(query: string): University[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  return UNIVERSITIES.filter((u) => {
    const name = u.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const short = (u.shortName || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const city = u.city.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return name.includes(q) || short.includes(q) || city.includes(q);
  }).slice(0, 10);
}

/** Label formaté pour affichage */
export function universityLabel(u: University): string {
  return u.shortName ? `${u.shortName} — ${u.name}` : u.name;
}
