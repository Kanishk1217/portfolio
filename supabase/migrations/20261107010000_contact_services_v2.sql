-- Widen the service choices to the six dropdown options. Safe to run on an empty or filled table
-- only if no existing row uses a value outside the list (the first release had no real rows).
alter table public.contact_requests drop constraint if exists contact_requests_service_check;
alter table public.contact_requests add constraint contact_requests_service_check
  check (service is null or service in ('ai_chatbot','machine_learning','web_development','ai_dashboard','automation','other'));
