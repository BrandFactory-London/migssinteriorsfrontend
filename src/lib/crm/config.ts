/**
 * Where this site's leads go in the shared BrandFactory Contacts CRM.
 *
 * The CRM holds every client's contacts on one list, told apart by Owner. A
 * different client site reusing `lib/crm` changes only `CRM_OWNER_PAGE_ID`.
 * Neither value is a secret; the integration key is `NOTION_TOKEN`, read from
 * the environment on the server only.
 */

/** Notion database "Contacts CRM". */
export const CRM_DATABASE_ID = "6ef22a2650144a889313f0faaee45a7e";

/** The Owner relation's page for Migss Interiors in the Clients database. */
export const CRM_OWNER_PAGE_ID = "4083cf592e4381a8aac3f87e93ac2f7f";
