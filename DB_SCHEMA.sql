-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.auth_tokens (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_whatsapp_number character varying NOT NULL,
  token_hash text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT auth_tokens_pkey PRIMARY KEY (id),
  CONSTRAINT auth_tokens_user_whatsapp_number_fkey FOREIGN KEY (user_whatsapp_number) REFERENCES public.users(whatsapp_number)
);
CREATE TABLE public.cameo_personas (
  user_whatsapp_number character varying NOT NULL,
  cameo_name character varying NOT NULL,
  system_prompt text NOT NULL,
  image_url text,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  status boolean,
  CONSTRAINT cameo_personas_pkey PRIMARY KEY (user_whatsapp_number),
  CONSTRAINT cameo_personas_user_whatsapp_number_fkey FOREIGN KEY (user_whatsapp_number) REFERENCES public.users(whatsapp_number)
);
CREATE TABLE public.documents (
  id bigint NOT NULL DEFAULT nextval('documents_id_seq'::regclass),
  content text,
  metadata jsonb,
  embedding USER-DEFINED,
  CONSTRAINT documents_pkey PRIMARY KEY (id)
);
CREATE TABLE public.documents_details (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_whatsapp_number character varying NOT NULL,
  file_name text NOT NULL,
  status USER-DEFINED NOT NULL DEFAULT 'uploaded'::processing_status,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now(),
  file_url text,
  CONSTRAINT documents_details_pkey PRIMARY KEY (id),
  CONSTRAINT documents_user_whatsapp_number_fkey FOREIGN KEY (user_whatsapp_number) REFERENCES public.users(whatsapp_number)
);
CREATE TABLE public.n8n_chat_histories (
  id integer NOT NULL DEFAULT nextval('n8n_chat_histories_id_seq'::regclass),
  session_id character varying NOT NULL,
  message jsonb NOT NULL,
  CONSTRAINT n8n_chat_histories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.otp_codes (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_whatsapp_number character varying NOT NULL,
  code character varying NOT NULL,
  expires_at timestamp with time zone NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT otp_codes_pkey PRIMARY KEY (id),
  CONSTRAINT otp_codes_user_whatsapp_number_fkey FOREIGN KEY (user_whatsapp_number) REFERENCES public.users(whatsapp_number)
);
CREATE TABLE public.users (
  whatsapp_number character varying NOT NULL,
  name character varying,
  email character varying UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT users_pkey PRIMARY KEY (whatsapp_number)
);