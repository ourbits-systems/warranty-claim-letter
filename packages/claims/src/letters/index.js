import de from './de.js'
import en from './en.js'
import es from './es.js'
import fr from './fr.js'
import nl from './nl.js'

// Letter templates per output language. Packs other than English are
// translations of the English structure written as native business letters;
// they never cite statutes (legalReviewed: false) until a legal translation
// has been reviewed.
export const LETTER_PACKS = { en, de, fr, es, nl }

export const LETTER_LANGUAGES = Object.keys(LETTER_PACKS)
