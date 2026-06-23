# Paiement FedaPay — déploiement des Edge Functions

Deux fonctions :

- **`create-payment`** — appelée par l'app. Crée une transaction FedaPay (clé secrète côté serveur, montant recalculé serveur) et renvoie l'URL de paiement.
- **`fedapay-webhook`** — appelée par FedaPay. Re-vérifie la transaction auprès de l'API FedaPay puis crédite la contribution (idempotent). À déployer **sans vérification JWT**.

## 1. Base de données
Lance les migrations dans **Supabase → SQL Editor** (dans l'ordre) :
`0001_tontine_savings.sql`, `0002_one_active_plan.sql`, `0003_payment_idempotency.sql`.

## 2. CLI Supabase
```bash
npm i -g supabase
supabase login
supabase link --project-ref <project-ref>   # le ref est dans l'URL de ton projet
```

## 3. Secrets (jamais côté client)
```bash
# Sandbox pour tester, puis https://api.fedapay.com en production
supabase secrets set FEDAPAY_SECRET_KEY=sk_sandbox_xxxxxxxx
supabase secrets set FEDAPAY_BASE_URL=https://sandbox-api.fedapay.com
supabase secrets set APP_URL=http://localhost:3000   # puis ton domaine en prod
```
`SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` sont fournis automatiquement aux fonctions — ne pas les définir.

## 4. Déploiement
```bash
supabase functions deploy create-payment
supabase functions deploy fedapay-webhook --no-verify-jwt   # FedaPay n'a pas de token Supabase
```

## 5. Webhook côté FedaPay
Dashboard FedaPay → **Webhooks → Créer un webhook** :
- URL : `https://<project-ref>.supabase.co/functions/v1/fedapay-webhook`
- Événements : au minimum **`transaction.approved`** (tu peux tout cocher)

## 6. Test (sandbox)
1. Connecte-toi à l'app → `/epargne` → ouvre un plan → **Verser**.
2. Tu es redirigé vers la page FedaPay (mobile money / carte de test sandbox).
3. Après paiement, retour sur la page du plan (`?payment=return`). Le webhook crédite la contribution → la progression monte (clique **Actualiser** si besoin, le webhook est asynchrone).

## Sécurité
- La clé secrète FedaPay ne quitte jamais le serveur.
- Le montant est recalculé côté serveur (le client ne peut pas le falsifier).
- Le webhook **ne fait pas confiance au payload** : il re-interroge l'API FedaPay (source de vérité) et lit `plan_id`/`user_id` dans le `custom_metadata` qu'on a posé à la création.
- Insertion **idempotente** via `contributions.reference` (= id de transaction) → pas de double crédit sur les renvois de webhook.
- Durcissement possible : vérifier en plus la signature `X-FEDAPAY-SIGNATURE` (le re-fetch reste la garantie principale).
