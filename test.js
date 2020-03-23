CREATE TABLE bi_contant(
   contant_id serial PRIMARY KEY,
   title VARCHAR (150),
   contant text,
   type VARCHAR (255),
   categories VARCHAR (150),
   date VARCHAR (100),
   author VARCHAR (255),
   higlight VARCHAR (50),
   resume VARCHAR (800),
   comment text,
   updated_at timestamp without time zone,
   status VARCHAR (10),
   created_by integer,
   pdf VARCHAR(150)
);

if (result) {
                              const resdata = {
                                 id         : res.rows[0].id,
                                 title         : info.title,
                                 written_on    : written_on_date,
                                 auther        : info.auther,
                                 description   : info.description,
                                 editor        : info.editor,
                                 image         : info.image,
                                 embed         : info.embed,
                                 quotations    : info.quotations,
                                 subcat_id     : info.subcat_id,
                                 cat_id        : info.cat_id,
                                 audio         : info.audio

                              }
                              redisClient.hmset('bi_contant', res.rows[0].title, JSON.stringify(resdata), function (err, data) {
                                  if(err){
                                    resolve(message.SOMETHINGWRONG);
                                  }else{
                                    if(data == 'OK'){
                                       resolve(message.UPDATEDSUCCESS);
                                    }else{
                                       resolve(message.NOTUPDATED);
                                    }
                                  }
                              })    
                           }else{
                              resolve(message.NOTUPDATED);
                           }