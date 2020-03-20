CREATE TABLE bi_contant(
   contant_id serial PRIMARY KEY,
   title VARCHAR (150),
   contant VARCHAR(800),
   type VARCHAR (255),
   categories VARCHAR (150),
   date VARCHAR (100),
   author VARCHAR (255),
   higlight VARCHAR (50),
   resume VARCHAR (800),
   comment VARCHAR (50),
   updated_at timestamp without time zone,
   status VARCHAR (10),
   created_by integer,
   pdf VARCHAR(150)
);