/**
 * Validation des variables d'environnement au démarrage.
 * Échoue tôt avec un message clair si la config est incomplète.
 */

interface EnvSchema {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_WHATSAPP_NUMBER?: string;
}

const REQUIRED_KEYS: (keyof EnvSchema)[] = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'];

export function validateEnv(): EnvSchema {
  const missing = REQUIRED_KEYS.filter((key) => !import.meta.env[key]);

  if (missing.length > 0) {
    const msg = [
      '[ENV] Variables d\'environnement manquantes :',
      missing.map((k) => `  - ${k}`).join('\n'),
      '',
      'Créez un fichier .env.local à la racine du projet avec :',
      'VITE_SUPABASE_URL=https://xxx.supabase.co',
      'VITE_SUPABASE_ANON_KEY=eyJ...',
      'VITE_WHATSAPP_NUMBER=229XXXXXXXXX  # optionnel',
    ].join('\n');

    if (import.meta.env.DEV) {
      console.error(msg);
    }
    throw new Error(msg);
  }

  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
    VITE_WHATSAPP_NUMBER: import.meta.env.VITE_WHATSAPP_NUMBER,
  };
}

export const env = validateEnv();