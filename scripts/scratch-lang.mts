import dotenv from 'dotenv'
dotenv.config({ path: '.env.local', override: true })
const res = await fetch(`https://${process.env.PRISMIC_REPOSITORY_NAME}.prismic.io/api/v2`)
const api = await res.json() as { languages: Array<{ id: string; name: string; master: boolean }> }
console.log(api.languages.map((l) => `${l.id}${l.master ? ' (master)' : ''} — ${l.name}`).join('\n'))
