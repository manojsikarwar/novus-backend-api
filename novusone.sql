--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1 (Ubuntu 12.1-1.pgdg18.04+1)
-- Dumped by pg_dump version 12.1 (Ubuntu 12.1-1.pgdg18.04+1)

-- Started on 2020-01-23 18:27:18 IST

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 207 (class 1259 OID 16437)
-- Name: application_management; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.application_management (
    application_id integer NOT NULL,
    application_name character varying(200) NOT NULL,
    icon character varying(200) NOT NULL,
    selected_countries character varying(255) NOT NULL,
    selected_user character varying(255) NOT NULL,
    status integer,
    created_date timestamp without time zone
);


ALTER TABLE public.application_management OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16435)
-- Name: application_management_application_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.application_management_application_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.application_management_application_id_seq OWNER TO postgres;

--
-- TOC entry 2976 (class 0 OID 0)
-- Dependencies: 206
-- Name: application_management_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.application_management_application_id_seq OWNED BY public.application_management.application_id;


--
-- TOC entry 209 (class 1259 OID 16452)
-- Name: countriestbl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.countriestbl (
    countryid integer NOT NULL,
    countryname character varying(200),
    countrycode character varying(10)
);


ALTER TABLE public.countriestbl OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16450)
-- Name: countriestbl_countryid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.countriestbl_countryid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.countriestbl_countryid_seq OWNER TO postgres;

--
-- TOC entry 2977 (class 0 OID 0)
-- Dependencies: 208
-- Name: countriestbl_countryid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.countriestbl_countryid_seq OWNED BY public.countriestbl.countryid;


--
-- TOC entry 202 (class 1259 OID 16403)
-- Name: signup; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signup (
    fullname character(200),
    email character(200),
    password character(255),
    company character(200),
    address1 character(255),
    address2 character(255),
    country character(100),
    state character(100),
    city character(100),
    zipcode character(100),
    status integer,
    created_by character(100),
    created_date character(100),
    role_id integer,
    user_id integer NOT NULL
);


ALTER TABLE public.signup OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16409)
-- Name: signup_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.signup_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.signup_user_id_seq OWNER TO postgres;

--
-- TOC entry 2978 (class 0 OID 0)
-- Dependencies: 203
-- Name: signup_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.signup_user_id_seq OWNED BY public.signup.user_id;


--
-- TOC entry 211 (class 1259 OID 16458)
-- Name: statetbl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.statetbl (
    stateid integer NOT NULL,
    statename character varying(200) NOT NULL,
    countryid integer NOT NULL
);


ALTER TABLE public.statetbl OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16456)
-- Name: statetbl_stateid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.statetbl_stateid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.statetbl_stateid_seq OWNER TO postgres;

--
-- TOC entry 2979 (class 0 OID 0)
-- Dependencies: 210
-- Name: statetbl_stateid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.statetbl_stateid_seq OWNED BY public.statetbl.stateid;


--
-- TOC entry 204 (class 1259 OID 16411)
-- Name: supertbl; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supertbl (
    fullname character(100),
    email character(200),
    password character(255),
    role_id integer,
    created_date character(100),
    status integer,
    super_id integer NOT NULL
);


ALTER TABLE public.supertbl OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16417)
-- Name: supertbl_super_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supertbl_super_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.supertbl_super_id_seq OWNER TO postgres;

--
-- TOC entry 2980 (class 0 OID 0)
-- Dependencies: 205
-- Name: supertbl_super_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supertbl_super_id_seq OWNED BY public.supertbl.super_id;


--
-- TOC entry 2830 (class 2604 OID 16440)
-- Name: application_management application_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_management ALTER COLUMN application_id SET DEFAULT nextval('public.application_management_application_id_seq'::regclass);


--
-- TOC entry 2831 (class 2604 OID 16455)
-- Name: countriestbl countryid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.countriestbl ALTER COLUMN countryid SET DEFAULT nextval('public.countriestbl_countryid_seq'::regclass);


--
-- TOC entry 2828 (class 2604 OID 16419)
-- Name: signup user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signup ALTER COLUMN user_id SET DEFAULT nextval('public.signup_user_id_seq'::regclass);


--
-- TOC entry 2832 (class 2604 OID 16461)
-- Name: statetbl stateid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.statetbl ALTER COLUMN stateid SET DEFAULT nextval('public.statetbl_stateid_seq'::regclass);


--
-- TOC entry 2829 (class 2604 OID 16420)
-- Name: supertbl super_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supertbl ALTER COLUMN super_id SET DEFAULT nextval('public.supertbl_super_id_seq'::regclass);


--
-- TOC entry 2966 (class 0 OID 16437)
-- Dependencies: 207
-- Data for Name: application_management; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.application_management (application_id, application_name, icon, selected_countries, selected_user, status, created_date) FROM stdin;
1	Envirment	icon	con	user	0	2020-01-23 00:00:00
2	Population	0.25269811567770417.jpeg	[{india,australia,usa,honkong}]	[{1,2,3,4,5,6}]	0	2020-01-23 00:00:00
\.


--
-- TOC entry 2968 (class 0 OID 16452)
-- Dependencies: 209
-- Data for Name: countriestbl; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.countriestbl (countryid, countryname, countrycode) FROM stdin;
1	Afghanistan	AFG
2	Aland Islands	ALA
3	Albania	ALB
4	Algeria	DZA
5	American Samoa	ASM
6	Andorra	AND
7	Angola	AGO
8	Anguilla	AIA
9	Antarctica	ATA
10	Antigua and Barbuda	ATG
11	Argentina	ARG
12	Armenia	ARM
13	Aruba	ABW
14	Australia	AUS
15	Austria	AUT
16	Azerbaijan	AZE
17	Bahamas	BHS
18	Bahrain	BHR
19	Bangladesh	BGD
20	Barbados	BRB
21	Belarus	BLR
22	Belgium	BEL
23	Belize	BLZ
24	Benin	BEN
25	Bermuda	BMU
26	Bhutan	BTN
27	Bolivia	BOL
28	Bonaire, Sint Eustatius and Saba	BES
29	Bosnia and Herzegovina	BIH
30	Botswana	BWA
31	Bouvet Island	BVT
32	Brazil	BRA
33	British Indian Ocean Territory	IOT
34	Brunei	BRN
35	Bulgaria	BGR
36	Burkina Faso	BFA
37	Burundi	BDI
38	Cambodia	KHM
39	Cameroon	CMR
40	Canada	CAN
41	Cape Verde	CPV
42	Cayman Islands	CYM
43	Central African Republic	CAF
44	Chad	TCD
45	Chile	CHL
46	China	CHN
47	Christmas Island	CXR
48	Cocos (Keeling) Islands	CCK
49	Colombia	COL
50	Comoros	COM
51	Congo	COG
52	Cook Islands	COK
53	Costa Rica	CRI
54	Ivory Coast	CIV
55	Croatia	HRV
56	Cuba	CUB
57	Curacao	CUW
58	Cyprus	CYP
59	Czech Republic	CZE
60	Democratic Republic of the Congo	COD
61	Denmark	DNK
62	Djibouti	DJI
63	Dominica	DMA
64	Dominican Republic	DOM
65	Ecuador	ECU
66	Egypt	EGY
67	El Salvador	SLV
68	Equatorial Guinea	GNQ
69	Eritrea	ERI
70	Estonia	EST
71	Ethiopia	ETH
72	Falkland Islands (Malvinas)	FLK
73	Faroe Islands	FRO
74	Fiji	FJI
75	Finland	FIN
76	France	FRA
77	French Guiana	GUF
78	French Polynesia	PYF
79	French Southern Territories	ATF
80	Gabon	GAB
81	Gambia	GMB
82	Georgia	GEO
83	Germany	DEU
84	Ghana	GHA
85	Gibraltar	GIB
86	Greece	GRC
87	Greenland	GRL
88	Grenada	GRD
89	Guadaloupe	GLP
90	Guam	GUM
91	Guatemala	GTM
92	Guernsey	GGY
93	Guinea	GIN
94	Guinea-Bissau	GNB
95	Guyana	GUY
96	Haiti	HTI
97	Heard Island and McDonald Islands	HMD
98	Honduras	HND
99	Hong Kong	HKG
100	Hungary	HUN
101	Iceland	ISL
102	India	IND
103	Indonesia	IDN
104	Iran	IRN
105	Iraq	IRQ
106	Ireland	IRL
107	Isle 	IMN
108	Israel	ISR
109	Italy	ITA
110	Jamaica	JAM
111	Japan	JPN
112	Jersey	JEY
113	Jordan	JOR
114	Kazakhstan	KAZ
115	Kenya	KEN
116	Kiribati	KIR
117	Kosovo	---
118	Kuwait	KWT
119	Kyrgyzstan	KGZ
120	Laos	LAO
121	Latvia	LVA
122	Lebanon	LBN
123	Lesotho	LSO
124	Liberia	LBR
125	Libya	LBY
126	Liechtenstein	LIE
127	Lithuania	LTU
128	Luxembourg	LUX
129	Macao	MAC
130	Macedonia	MKD
131	Madagascar	MDG
132	Malawi	MWI
133	Malaysia	MYS
134	Maldives	MDV
135	Mali	MLI
136	Malta	MLT
137	Marshall Islands	MHL
138	Martinique	MTQ
139	Mauritania	MRT
140	Mauritius	MUS
141	Mayotte	MYT
142	Mexico	MEX
143	Micronesia	FSM
145	Monaco	MCO
147	Montenegro	MNE
152	Namibia	NAM
153	Nauru	NRU
157	New Zealand	NZL
163	North Korea	PRK
168	Palau	PLW
171	Papua New Guinea	PNG
172	Paraguay	PRY
176	Poland	POL
177	Portugal	PRT
178	Puerto Rico	PRI
179	Qatar	QAT
180	Reunion	REU
181	Romania	ROU
182	Russia	RUS
186	Saint Kitts and Nevis	KNA
192	San Marino	SMR
193	Sao Tome and Principe	STP
208	South Sudan	SSD
209	Spain	ESP
210	Sri Lanka	LKA
211	Sudan	SDN
216	Switzerland	CHE
217	Syria	SYR
218	Taiwan	TWN
231	Tuvalu	TUV
233	Ukraine	UKR
234	United Arab Emirates	ARE
235	United Kingdom	GBR
236	United States	USA
237	United States Minor Outlying Islands	UMI
246	Wallis and Futuna	WLF
247	Western Sahara	ESH
\.


--
-- TOC entry 2961 (class 0 OID 16403)
-- Dependencies: 202
-- Data for Name: signup; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.signup (fullname, email, password, company, address1, address2, country, state, city, zipcode, status, created_by, created_date, role_id, user_id) FROM stdin;
raj                                                                                                                                                                                                     	mohan@gmail.com                                                                                                                                                                                         	$2b$10$3L.NozM6/fs9/hwal.exIOqEv7wanPNhD8butGMDWaOixmw5C2.GG                                                                                                                                                                                                   	puma                                                                                                                                                                                                    	indore                                                                                                                                                                                                                                                         	indore                                                                                                                                                                                                                                                         	india                                                                                               	mp                                                                                                  	indore                                                                                              	123456                                                                                              	0	none                                                                                                	01/23/2020                                                                                          	4	1
dev                                                                                                                                                                                                     	dev@gmail.com                                                                                                                                                                                           	$2b$10$6nEuc5iEDR16mTSIxR/MHevXnZ4b.5Y86Wq0X/xibDR.WfvoQPzay                                                                                                                                                                                                   	mahendra                                                                                                                                                                                                	indore                                                                                                                                                                                                                                                         	indore                                                                                                                                                                                                                                                         	india                                                                                               	mp                                                                                                  	indore                                                                                              	123456                                                                                              	1	none                                                                                                	01/23/2020                                                                                          	4	2
\.


--
-- TOC entry 2970 (class 0 OID 16458)
-- Dependencies: 211
-- Data for Name: statetbl; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.statetbl (stateid, statename, countryid) FROM stdin;
1	ANDHRA PRADESH	102
2	ASSAM	102
3	ARUNACHAL PRADESH	102
4	BIHAR	102
5	GUJRAT	102
6	HARYANA	102
7	HIMACHAL PRADESH	102
8	JAMMU & KASHMIR	102
9	KARNATAKA	102
10	KERALA	102
11	MADHYA PRADESH	102
12	MAHARASHTRA	102
13	MANIPUR	102
14	MEGHALAYA	102
15	MIZORAM	102
16	NAGALAND	102
17	ORISSA	102
18	PUNJAB	102
19	RAJASTHAN	102
20	SIKKIM	102
21	TAMIL NADU	102
22	TRIPURA	102
23	UTTAR PRADESH	102
24	WEST BENGAL	102
25	DELHI	102
26	GOA	102
27	PONDICHERY	102
28	LAKSHDWEEP	102
29	DAMAN & DIU	102
30	DADRA & NAGAR	102
31	CHANDIGARH	102
32	ANDAMAN & NICOBAR	102
33	UTTARANCHAL	102
34	JHARKHAND	102
35	CHATTISGARH	102
\.


--
-- TOC entry 2963 (class 0 OID 16411)
-- Dependencies: 204
-- Data for Name: supertbl; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supertbl (fullname, email, password, role_id, created_date, status, super_id) FROM stdin;
superadmin                                                                                          	superadmin@gmail.com                                                                                                                                                                                    	$2b$10$ZiIoZ56/9u1v83ogDwzg1Orhq6RD0t1THFJoUQsiJPkiyY2xVcDty                                                                                                                                                                                                   	1	01/22/2020                                                                                          	0	2
\.


--
-- TOC entry 2981 (class 0 OID 0)
-- Dependencies: 206
-- Name: application_management_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.application_management_application_id_seq', 2, true);


--
-- TOC entry 2982 (class 0 OID 0)
-- Dependencies: 208
-- Name: countriestbl_countryid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.countriestbl_countryid_seq', 1, false);


--
-- TOC entry 2983 (class 0 OID 0)
-- Dependencies: 203
-- Name: signup_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.signup_user_id_seq', 2, true);


--
-- TOC entry 2984 (class 0 OID 0)
-- Dependencies: 210
-- Name: statetbl_stateid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.statetbl_stateid_seq', 35, true);


--
-- TOC entry 2985 (class 0 OID 0)
-- Dependencies: 205
-- Name: supertbl_super_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supertbl_super_id_seq', 2, true);


--
-- TOC entry 2834 (class 2606 OID 16445)
-- Name: application_management application_management_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.application_management
    ADD CONSTRAINT application_management_pkey PRIMARY KEY (application_id);


-- Completed on 2020-01-23 18:27:19 IST

--
-- PostgreSQL database dump complete
--

