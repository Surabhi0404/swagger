const express = require ('express');
const app = express();
const port = 3001;
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const { check, validationResult,body } = require('express-validator');

const mariadb = require ('mariadb');
const pool = mariadb.createPool({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'sample',
	port: 3306,
	connectionLimit: 5
});

const options = {
	swaggerDefinition: {
		info: {
			title: 'REST-like API',
			version: '1.0.0',
			description: 'REST-like API autogenerated by Swagger',
		},
		host: '159.65.239.163:3001',
		basePath: '/',	
	},
	apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

/**
 * @swagger
 * /studentreport:
 *    get:
 *      description: Return all student reports
 *      produces: 
 *          - application/json
 *      responses:
 *          200:
 *              description: Object student report containing all entries from studentreport table
 */     
app.get('/studentreport', (req, res)=>{
	//app.set('json spaces', 2);
		
		pool.getConnection()
		.then(conn =>{
			//perform req (sql)      
			conn.query("SELECT * FROM studentreport")
			.then((rows)=>{
				//add header
				res.set('Content-Type', 'application/json');
				//JSON response
				res.json(rows);
				conn.end();
				})
				.catch(err =>{
					console.log(err);
					conn.end();
					res.status(500).send(res);
				});
		}).catch(err=>{
			console.log(err);
			res.status(500).send(res);	
		});                                               
                                                
});


/**
 * @swagger
 * /agents/{agent_code}:
 *    get:
 *      description: Return agent information
 *      parameters:
 *          - in: path
 *            name: agent_code
 *            schema:
 *              type: integer
 *            required: true
 *            description: Agent code
 *      produces: 
 *          - application/json
 *      responses:
 *          200:
 *              description: Object containing information for requested agent
 */
app.get('/agents/:agent_code', (req, res)=>{
        //app.set('json spaces', 2);
                pool.getConnection()
                .then(conn =>{
                        //perform req (sql)
                        conn.query("SELECT * FROM agents WHERE AGENT_CODE='"+[req.params.agent_code]+"  '")
                        .then((rows)=>{
                                //add header
                                res.set('Content-Type', 'application/json');
                                //JSON response
                                res.json(rows);
                                conn.end();
                                })
                                .catch(err =>{
                                        console.log(err);
                                        conn.end();
					res.status(500).send(res);
                                });
                }).catch(err=>{
                        console.log(err);
			res.status(500).send(res);
                });

});


/**
 * @swagger
 * /customer/orders/{agent_code}:
 *    get:
 *      description: Return customers and their order information
 *      parameters:
 *          - in: path
 *            name: agent_code
 *            schema:
 *              type: integer
 *            required: true
 *            description: Agent code 
 *      produces: 
 *          - application/json
 *      responses:
 *          200:
 *              description: Object customers and order served by the agent
 */
app.get('/customer/orders/:agent_code', (req, res)=>{                                                                
        //app.set('json spaces', 2);                                                                          
                pool.getConnection()                                                                        
                .then(conn =>{                                                                              
                        //perform req (sql)                                                                 
                        conn.query("SELECT customer.CUST_NAME, customer.CUST_CITY, daysorder.ORD_DESCRIPTION, daysorder.ORD_AMOUNT, daysorder.ORD_DATE FROM customer INNER JOIN daysorder ON customer.CUST_CODE=daysorder.CUST_CODE WHERE daysorder.AGENT_CODE='"+[req.params.agent_code]+"  '") 
                        .then((rows)=>{                                                                     
                                //add header                                                                
                                res.set('Content-Type', 'application/json');                             
                                //JSON response                                                             
                                res.json(rows);                                                             
                                conn.end();                                                                 
                                })                                                                          
                                .catch(err =>{                                                              
                                        console.log(err);                                                   
                                        conn.end();
					res.status(500).send(res);                                                         
                                });                                                                         
                }).catch(err=>{                                                                             
                        console.log(err);
			res.status(500).send(res);                                                                   
                });   

});


/**
 * @swagger
 * /company:
 *    post:
 *      description: Create new company
 *      parameters:
 *          - in: body
 *            name: company
 *            description: The company to create
 *            required: true
 *            schema:
 *              type: object
 *              required:
 *                  - id
 *              properties:
 *                  id:
 *                      type: string
 *                  name:
 *                      type: string
 *                  city:
 *                      type: string             
 *      produces: 
 *          - application/json
 *      responses:
 *          200:
 *              description: Object company created
 */
app.post('/company', jsonParser, [check('id').trim().not().isEmpty().isLength({ max: 10 }).isAlphanumeric().withMessage('Add valid company id'), check('name').trim().not().isEmpty().isString().isAlpha().withMessage('Add valid Company Name'), check('city').trim().not().isEmpty().isString().isAlpha().withMessage('Add valid city')], (req, res)=>{
        //app.set('json spaces', 2);
                const errors = validationResult(req);
		if(!errors.isEmpty()){
			return res.status(400).json({errors: errors.array()});
		}
		const  company_id  = req.body.id;
                const  company_name = req.body.name;
                const  company_city = req.body.city;
		pool.getConnection()
                .then(conn =>{
                        //perform req (sql)
                        conn.query("INSERT INTO company VALUES ('"+ company_id+ "', '"+ company_name+"' , '"+ company_city+"')")
				.then((rows) =>{
                                //add header
                                res.set('Content-Type', 'application/json');
                                //JSON response
				res.json("Added new Company with companyID= "+company_id);
                                conn.end();
                                })
                                .catch(err =>{
                                        console.log(err);
                                        conn.end();
					res.status(500).send(res);
                                });
                }).catch(err=>{
                        console.log(err);
			res.status(500).send(res);
                });
		
});


/**
 * @swagger
 * /foods/{item_id}/{item_name}:
 *    put:
 *      description: Update ITEM_NAME
 *      parameters:
 *          - in: path
 *            name: item_id
 *            schema:
 *              type: string
 *            required: true
 *            description: Item ID
 *          - in: path
 *            name: item_name
 *            schema: 
 *              type: string
 *            required: true
 *            description: Item name
 *          - in: body
 *            name: Foods
 *            description: Food object is created
 *            required: true  
 *            schema:
 *              type: object
 *              properties:
 *                  item_unit:
 *                      type: string
 *                  company_id:
 *                      type: string
 *      produces:
 *          - application/json
 *      responses:
 *          200:
 *              description: ITEM_ID 1 Updated successfully
 */
app.put('/foods/:item_id/:item_name', jsonParser, [check('item_unit').trim().not().isEmpty().isString().isLength({min:3}).isAlpha().withMessage('Must be valid unit name'), check('company_id').isString().isLength({min:1}).withMessage('Must be valid Company id')], (req, res)=>{                                                                                               
        //app.set('json spaces', 2);
		const errors = validationResult(req);                          
		if(!errors.isEmpty()){                                          
        		return res.status(400).json({errors: errors.array()}); 
		}                                                                                                                                                                                                                                              pool.getConnection()                                                                                             
                .then(conn =>{                                                                                                   
                        //perform req (sql)                                                                                      
                        conn.query("INSERT INTO foods VALUES ('"+[req.params.item_id]+"','"+[req.params.item_name]+"','"+[req.body.item_unit]+"','"+req.body.company_id+"') ON DUPLICATE KEY UPDATE ITEM_NAME = '"+[req.params.item_name]+"'") 
                                .then((rows) =>{                                                                                 
                                //add header                                                                                     
                                res.set('Content-Type', 'application/json');                                                     
                                //JSON response                                                                                  
                                res.json("Successfully put Food item "+[req.params.item_id]+"with ITEM_NAME:"+ [req.params.item_name]);                                                                                  
                                conn.end();                                                                                      
                                })                                                                                               
                                .catch(err =>{                                                                                   
                                        console.log(err);                                                                        
                                        conn.end();
					res.status(500).send(res);                                                                              
                                });                                                                                              
                }).catch(err=>{                                                                                                  
                        console.log(err);
			res.status(500).send(res);                                                                                        
                });                                                                                                              
                                                                                                                                 
}); 

/**
 * @swagger
 * /listofitem/{itemname}/{itemcode}:
 *    patch:
 *      description: Update ITEM_NAME for existing ITEM_CODE
 *      parameters:
 *          - in: path
 *            name: itemname
 *            schema:
 *              type: string
 *            required: true
 *            description: Item name to be inserted
 *          - in: path
 *            name: itemcode
 *            schema:
 *              type: integer
 *            required: true
 *            description: Item code 
 *      produces: 
 *          - application/json
 *      responses:
 *          200:
 *              description: Object food containing array of all food obj with prices
 */
app.patch('/listofitem/:itemname/:itemcode', (req, res)=>{                                                                            
        //app.set('json spaces', 2);                                                                                  
                pool.getConnection()                                                                                  
                .then(conn =>{                                                                                        
                        //perform req (sql)                                                                           
                        conn.query("UPDATE listofitem SET ITEMNAME = '"+ [req.params.itemname] + "' WHERE ITEMCODE = '"+ [req.params.itemcode]+"'")
                                .then((rows) =>{                                                                      
                                //add header                                                                          
                                res.set('Content-Type', 'application/json');                                          
                                //JSON response                                                                       
                                res.json("Updated "+[req.params.itemcode]+" with ITEM_NAME "+[req.params.itemname]);                                                                       
                                conn.end();                                                                           
                                })                                                                                    
                                .catch(err =>{                                                                        
                                        console.log(err);                                                             
                                        conn.end();
					res.status(500).send(res);                                                                   
                                });                                                                                   
                }).catch(err=>{                                                                                       
                        console.log(err);
			res.status(500).send(res);                                                                             
                });                                                                                                   
                                                                                                                      
});                                                                                                                   


/**
 * @swagger
 * /orders/{ord_num}:
 *    delete:
 *      description: Delete order number from orders table
 *      parameters:
 *          - in: path
 *            name: ord_num
 *            schema:
 *              type: integer
 *            required: true
 *            description: Order number to be deleted 
 *      produces: 
 *          - application/json
 *      responses:
 *          200:
 *              description: Order deleted successfully
 */                                                                                                                                                                                                                                            app.delete('/orders/:ord_num', (req, res)=>{                                                                                                                        
                pool.getConnection()                                          
                .then(conn =>{                                                
                        //perform req (sql)                                   
                        conn.query("DELETE FROM orders WHERE ORD_NUM = '"+[req.params.ord_num]+"'")             
                        .then((rows)=>{                                       
                                //add header                                  
                                res.set('Content-Type', 'application/json');  
                                //JSON response                               
                                res.json("Deleted order with order number = "+[req.params.ord_num]);                               
                                conn.end();                                   
                                })                                            
                                .catch(err =>{                                
                                        console.log(err);                     
                                        conn.end();
					res.status(500).send(res);                           
                                });                                           
                }).catch(err=>{                                               
                        console.log(err);
			res.status(500).send(res);                                     
                });                                                           
                                                                              
});                                                                                                                                                            
                                         
app.listen(port, ()=>{
	console.log(`Example app listening to http://localhost:${port}`)
});
