
SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;

SET default_with_oids = false;


--
-- Name: passport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE passport (
    id integer NOT NULL,
    password character varying(255) DEFAULT NULL::character varying,
    provider character varying(255) DEFAULT NULL::character varying,
    identifier character varying(255) DEFAULT NULL::character varying,
    tokens json,
    profile json,
    "user" character varying(255) DEFAULT NULL::character varying NOT NULL,
    protocol character varying(255) DEFAULT NULL::character varying,
    created_at date NOT NULL,
    updated_at date NOT NULL
);


--
-- Name: passport_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE passport_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: passport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE passport_id_seq OWNED BY passport.id;


--
-- Name: brand_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE brand_user (
    uid character varying(255) NOT NULL,
    user_name character varying(255),
    email character varying(255),
    first_name character varying(255),
    last_name character varying(255),
    status integer,
    created_at date,
    updated_at date,
    passports character varying(255)[]
);


--
-- Name: brand_user_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE brand_user_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

--
-- Name: id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY passport ALTER COLUMN id SET DEFAULT nextval('passport_id_seq'::regclass);


--
-- Name: passport_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY passport
    ADD CONSTRAINT passport_pkey PRIMARY KEY (id);


--
-- Name: pk_brand_user; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY brand_user
    ADD CONSTRAINT pk_brand_user PRIMARY KEY (uid);


--
-- Name: brand_user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY brand_user
    ADD CONSTRAINT brand_user_email_key UNIQUE (email);


--
-- Name: brand_user_user_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY brand_user
    ADD CONSTRAINT brand_user_user_name_key UNIQUE (user_name);
