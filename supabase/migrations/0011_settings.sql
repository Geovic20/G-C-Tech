-- =====================================================================
-- G&C Tech — Editable settings (key/value)
-- Run this in Supabase → SQL Editor (after 0006, which defines is_admin()).
--
-- Generic settings store. First use: the Product Savings terms (Markdown, FR/EN)
-- shown and accepted before starting a plan, editable from the admin back-office.
-- Public read, admin-only write.
-- =====================================================================

create table if not exists public.settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

create policy "settings: public read"  on public.settings for select using (true);
create policy "settings: admin insert" on public.settings for insert with check (public.is_admin());
create policy "settings: admin update" on public.settings for update using (public.is_admin()) with check (public.is_admin());

-- Seed the savings terms (Markdown, FR + EN). Dollar-quoting keeps the multi-line
-- text readable; jsonb_build_object escapes it safely into JSON.
insert into public.settings (key, value) values
(
  'savings_terms',
  jsonb_build_object(
    'fr', $fr$# Conditions générales de l'Épargne Produit G&C Tech

En souscrivant à l'offre *Épargne Produit* de G&C Tech, je reconnais avoir pris connaissance des présentes conditions et m'engage à les respecter.

## 1. Principe de l'épargne

L'Épargne Produit permet au client d'épargner progressivement en vue de l'achat d'un produit disponible sur la plateforme G&C Tech.

Le produit sera remis au client uniquement après le paiement intégral du montant requis, sauf disposition contraire expressément prévue par G&C Tech.

## 2. Engagement du client

Le client s'engage à :

* Fournir des informations exactes et à jour lors de son inscription.
* Effectuer ses versements selon le rythme qu'il a choisi (quotidien, hebdomadaire ou mensuel).
* Vérifier régulièrement l'état de son épargne depuis son espace personnel.

## 3. Montant des versements

Le client est libre d'effectuer ses versements avant ou à la date prévue.

Le non-respect d'une échéance n'entraîne pas automatiquement l'annulation de l'épargne, mais peut retarder la date à laquelle le produit pourra être retiré.

## 4. Disponibilité et évolution des prix

Les prix des produits peuvent évoluer en fonction des conditions du marché.

Si le prix du produit augmente avant la fin de l'épargne, le client devra compléter la différence avant la livraison.

Si le prix du produit diminue, le montant restant à payer sera ajusté en conséquence ou l'excédent sera porté au crédit du client, selon la politique de G&C Tech.

En cas d'indisponibilité définitive du produit choisi, G&C Tech proposera au client :

* un produit équivalent ;
* un changement de produit ;
* ou le maintien de son épargne pour un futur achat.

## 5. Paiements

Les versements effectués sont enregistrés dans le compte d'épargne du client et un historique est disponible depuis son espace personnel.

Le client est responsable de vérifier que chaque paiement a bien été validé.

## 6. Annulation

Le client peut demander l'annulation de son plan d'épargne.

Selon la politique commerciale de G&C Tech, des frais administratifs peuvent être appliqués avant tout remboursement.

Les éventuels frais applicables seront communiqués au client avant le traitement de sa demande.

## 7. Livraison du produit

Le produit sera remis ou expédié uniquement après :

* le paiement intégral du montant dû ;
* la validation du dossier du client, si nécessaire ;
* la disponibilité du produit.

Les frais de livraison, lorsqu'ils s'appliquent, restent à la charge du client, sauf mention contraire.

## 8. Sécurité du compte

Le client est responsable de la confidentialité de son compte et de ses identifiants.

Toute activité réalisée depuis son compte est présumée avoir été effectuée par lui, sauf preuve contraire.

## 9. Modification des présentes conditions

G&C Tech se réserve le droit de modifier les présentes conditions afin de tenir compte de l'évolution de ses services ou des obligations légales.

Les modifications ne remettent pas en cause les droits déjà acquis sur les épargnes en cours.

## 10. Acceptation

En cochant la case « J'accepte les conditions de l'Épargne Produit », je confirme avoir lu, compris et accepté l'ensemble des présentes conditions.$fr$,
    'en', $en$# G&C Tech Product Savings — Terms & Conditions

By subscribing to G&C Tech's **Product Savings** offer, I acknowledge that I have read these terms and agree to comply with them.

## 1. Savings principle

Product Savings lets the customer save gradually toward the purchase of a product available on the G&C Tech platform.

The product is handed over to the customer only after full payment of the required amount, unless otherwise expressly provided by G&C Tech.

## 2. Customer commitment

The customer agrees to:

* Provide accurate and up-to-date information when registering.
* Make contributions according to the pace they chose (daily, weekly or monthly).
* Regularly check the status of their savings from their personal area.

## 3. Contribution amounts

The customer is free to make contributions before or on the scheduled date.

Missing a due date does not automatically cancel the savings plan, but may delay the date on which the product can be collected.

## 4. Availability and price changes

Product prices may change according to market conditions.

If the product price increases before the end of the savings plan, the customer must pay the difference before delivery.

If the product price decreases, the remaining amount to pay will be adjusted accordingly, or the surplus credited to the customer, according to G&C Tech's policy.

If the chosen product becomes permanently unavailable, G&C Tech will offer the customer:

* an equivalent product;
* a product change;
* or keeping their savings for a future purchase.

## 5. Payments

Contributions made are recorded in the customer's savings account and a history is available from their personal area.

The customer is responsible for verifying that each payment has been validated.

## 6. Cancellation

The customer may request cancellation of their savings plan.

Depending on G&C Tech's commercial policy, administrative fees may apply before any refund.

Any applicable fees will be communicated to the customer before their request is processed.

## 7. Product delivery

The product will be handed over or shipped only after:

* full payment of the amount due;
* validation of the customer's file, if necessary;
* product availability.

Delivery fees, where applicable, remain the customer's responsibility, unless otherwise stated.

## 8. Account security

The customer is responsible for the confidentiality of their account and credentials.

Any activity carried out from their account is presumed to have been performed by them, unless proven otherwise.

## 9. Changes to these terms

G&C Tech reserves the right to modify these terms to reflect changes in its services or legal obligations.

Changes do not affect rights already acquired on ongoing savings.

## 10. Acceptance

By checking the box "I accept the Product Savings terms", I confirm that I have read, understood and accepted all of these terms.$en$
  )
)
on conflict (key) do nothing;
