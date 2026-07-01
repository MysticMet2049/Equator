import http from "../httpClient";
import { cleanObject, extractCustomerAccountId } from "./customerAccountUtils";
import { getAddressFromCustomer, getPersonalInfoFromCustomer } from "./customerAccountPayload";

// Routes de création historiques conservées, même si elles peuvent être absentes selon l'environnement.
const CREATE_ACCOUNT_PATHS = [
  "/api/customers/account/create",
  "/api/customers/account/projected/create",
];

// Crée un compte client dans un store quand le backend expose une route compatible.
export async function createCustomerAccountForStore({ storeId, customer } = {}) {
  if (!storeId) return null;

  const payload = cleanObject({
    storeId: Number(storeId),
    customerAccountType: "PERSON",
    personalInfo: getPersonalInfoFromCustomer(customer),
    address: getAddressFromCustomer(customer),
  });

  let lastError = null;

  for (const path of CREATE_ACCOUNT_PATHS) {
    try {
      console.log(`[CREATE CUSTOMER ACCOUNT PAYLOAD] ${path}`, JSON.stringify(payload, null, 2));
      const response = await http.post(path, payload);
      console.log(`[CREATE CUSTOMER ACCOUNT RESPONSE] ${path}`, JSON.stringify(response, null, 2));

      const customerAccountId = extractCustomerAccountId(response);
      if (customerAccountId) return customerAccountId;

      console.warn(`[customerAccountApi] ${path} a répondu sans customerAccountId exploitable.`, response);
    } catch (err) {
      lastError = err;
      console.warn(`[customerAccountApi] ${path} failed:`, err);
    }
  }

  throw lastError || new Error("Impossible de créer le compte client.");
}
