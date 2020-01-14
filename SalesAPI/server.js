const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dataService = require('../SalesAPI/modules/data-service');
require("dotenv").config({path:'config/config.env'});
const myData = dataService(`mongodb+srv://admin:${process.env.pass}@cluster0-odvzz.mongodb.net/sample_supplies?retryWrites=true&w=majority`);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

// ************* API Routes

// POST /api/sales (NOTE: This route must read the contents of the request body)

app.get('/',(req,res)=>
{
    res.send("testing");
})


// GET /api/sales (NOTE: This route must accept the numeric query parameters "page" and "perPage", ie: /api/sales?page=1&perPage=5 )
app.get('/api/sales', async (req,res)=>
{
    let page = req.query.page;
    let perPage = req.query.perPage
    console.log(page, perPage)
    let  sales = await myData.getAllSales(page,perPage);
    res.json(sales);    
});


// GET /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.get('/api/sales/:saleID', async (req,res)=>
{
    let _id = req.params.saleID;
    let sale = await myData.getSaleById(_id);
    console.log(sale)
    res.send(sale);
});

// PUT /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8 as well as read the contents of the request body)
app.put('/api/sales/:saleID', async (req,res)=>
{
    let _id = req.params.saleID;  
    console.log(req.body);
    await myData.updateSaleById(req.body, _id);    
    res.send(`sale ${_id} updated`)
})
// DELETE /api/sales (NOTE: This route must accept a numeric route parameter, ie: /api/sales/5bd761dcae323e45a93ccfe8)
app.delete('/api/sales/:saleID', async (req,res)=>
{
    let _id = req.params.saleID;  
    await myData.deleteSaleById(_id);
    res.send(`sale ${_id} Deleted`)
})

// ************* Initialize the Service & Start the Server

myData.initialize()
    .then(()=>{
    app.listen(HTTP_PORT, ()=>
    {
        console.log(`server listening on: ${HTTP_PORT}`);
    });
})  .catch((err)=>
{
    console.log(err);
});

