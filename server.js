const express=require('express');
const fs=require('fs');
const path = require('path');//necesario para manejar json
const app=express();
const port=3000;
const axios=require('axios');
const xml2js=require('xml2js');
app.use(express.static(path.join(__dirname, 'public')));//usar path

app.get('/',(req,res)=>{//devuelve el index
    var contenido=fs.readFileSync('public/index.html');
    res.setHeader('Content-type','text/html');
    res.send(contenido);
});
app.get('/json',(req,res)=>{
    fs.readFile('resultado.json','utf8',(err,data)=>{
        if(err){
            console.error('Error al leer el archivo JSON',err);
            res.status(500).send('Error interno del servidor');
        }else{
            const jsonData=JSON.parse(data);
            res.json(jsonData);
        }
    });
});
app.get('/rssMarca',async(req,res)=>{
    try{
        const response=await axios.get('https://e00-telva.uecdn.es/rss/moda.xml');
        const xml=response.data;

        xml2js.parseString(xml,{explicitArray:false},(err,result)=>{
            if(err){
                throw err;
            }
            res.json(result);
        });
    }catch(error){
        res.status(500).send('Error al obtener el feed RSS');
    }
});
app.get('/atom', async (req, res) => {
    try {
        const response = await axios.get('https://www.bbc.com/mundo/ultimas_noticias/index.xml');
        const xml = response.data;
        
        xml2js.parseString(xml, { explicitArray: false }, (err, result) => {
            if (err) {
                console.error('Error al parsear XML:', err);
                res.status(500).send('Error al parsear el feed RSS');
            } else {
                res.json(result);
            }
        });
    } catch (error) {
        console.error('Error al obtener el feed RSS:', error.message);
        res.status(500).send('Error al obtener el feed RSS');
    }
});
app.listen(port,()=>{
    console.log(`Servidor escuchando en localhost:${port}`);
})