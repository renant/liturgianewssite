import { mock, test, expect } from "bun:test";

const calls = { contacts: [], emails: [], failContacts: false, failEmails: false };
mock.module("resend", () => ({ Resend: class {
  contacts = { create: async payload => { calls.contacts.push(payload); return calls.failContacts ? { error: { message: "Mock transport error" } } : { data: { id: "test-contact-id" } }; } };
  emails = { send: async payload => { calls.emails.push(payload); return calls.failEmails ? { error: { message: "Mock transport error" } } : { data: { id: "test-email-id" } }; } };
} }));
const { subscribe } = await import("../app/(app)/actions.ts");
const { sendContact } = await import("../app/contact/actions.tsx");
const formData = values => { const data = new FormData(); for (const [key,value] of Object.entries(values)) data.set(key,value); return data; };

test("inscrição inválida retorna erro de campo sem acessar o transporte", async () => {
  const before = calls.contacts.length;
  const result = await subscribe(formData({ email: "invalid" }));
  expect(result.success).toBe(false);
  expect(result.errors.email.length).toBeGreaterThan(0);
  expect(calls.contacts.length).toBe(before);
});

test("inscrição preserva double opt-in usando apenas transporte simulado", async () => {
  const result = await subscribe(formData({ email: "reader@example.invalid" }));
  expect(result.success).toBe(true);
  expect(result.data.id).toBe("test-contact-id");
  expect(calls.contacts.at(-1).unsubscribed).toBe(true);
});

test("falha simulada de cadastro retorna mensagem recuperável", async () => {
  calls.failContacts = true;
  try { const result = await subscribe(formData({ email: "reader@example.invalid" })); expect(result.success).toBe(false); expect(result.message).toContain("tente novamente"); }
  finally { calls.failContacts = false; }
});

test("contato inválido identifica campos sem enviar e-mail", async () => {
  const before = calls.emails.length;
  const result = await sendContact(formData({ name: "", email: "invalid", subject: "", message: "" }));
  expect(result.success).toBe(false);
  expect(Object.keys(result.errors)).toEqual(["name","email","subject","message"]);
  expect(calls.emails.length).toBe(before);
});

test("contato válido e falha de envio usam somente o transporte simulado", async () => {
  const data = formData({ name: "Leitor de teste", email: "reader@example.invalid", subject: "Teste local", message: "Mensagem de teste sem envio real." });
  const result = await sendContact(data);
  expect(result.success).toBe(true);
  calls.failEmails = true;
  try { const failed = await sendContact(data); expect(failed.success).toBe(false); expect(failed.message).toContain("tente novamente"); }
  finally { calls.failEmails = false; }
});
