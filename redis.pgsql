PGDMP     	    )                 x            redis     12.1 (Ubuntu 12.1-1.pgdg18.04+1)     12.1 (Ubuntu 12.1-1.pgdg18.04+1)     w           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false            x           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false            y           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            z           1262    16384    redis    DATABASE     k   CREATE DATABASE redis WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_IN' LC_CTYPE = 'en_IN';
    DROP DATABASE redis;
                postgres    false            �            1259    16400    usertbl    TABLE       CREATE TABLE public.usertbl (
    user_id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    status character varying(25) NOT NULL,
    rollid character varying(10)
);
    DROP TABLE public.usertbl;
       public         heap    postgres    false            �            1259    16398    usertbl_user_id_seq    SEQUENCE     �   CREATE SEQUENCE public.usertbl_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public.usertbl_user_id_seq;
       public          postgres    false    203            {           0    0    usertbl_user_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public.usertbl_user_id_seq OWNED BY public.usertbl.user_id;
          public          postgres    false    202            �
           2604    16403    usertbl user_id    DEFAULT     r   ALTER TABLE ONLY public.usertbl ALTER COLUMN user_id SET DEFAULT nextval('public.usertbl_user_id_seq'::regclass);
 >   ALTER TABLE public.usertbl ALTER COLUMN user_id DROP DEFAULT;
       public          postgres    false    203    202    203            t          0    16400    usertbl 
   TABLE DATA           U   COPY public.usertbl (user_id, username, password, email, status, rollid) FROM stdin;
    public          postgres    false    203   �       |           0    0    usertbl_user_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public.usertbl_user_id_seq', 11, true);
          public          postgres    false    202            �
           2606    16408    usertbl usertbl_username_key 
   CONSTRAINT     [   ALTER TABLE ONLY public.usertbl
    ADD CONSTRAINT usertbl_username_key UNIQUE (username);
 F   ALTER TABLE ONLY public.usertbl DROP CONSTRAINT usertbl_username_key;
       public            postgres    false    203            t   �   x�]�;�0  й=3i��l"j@�ĥ%��@���7����LА� 5�*a$E�-W�W����gC8̪�ݞ�n���f�+��OU�^I:}Q-������ �A�A���#m�x��ǔ����}ݳ��̙��:qt:�ܛĤYU�����E���	8L     