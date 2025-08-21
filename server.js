var express = require('express');
var app = express();
var server = require('http').createServer(app);
var porta = process.env.PORT || 3000;
var cors = require('cors');

// BodyParser para fazer o parse do json
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Cors da aplicação
var corsOptions = {
    origin: 'http://localhost:4200',
    optionsSuccessStatus: 200
}
app.use(cors());

app.use(express.static(__dirname + '/public'));

// Config SQL
var mysql = require('mysql');

var conSql = mysql.createConnection({
    host: "mysql995.umbler.com",
    port: 41890,
    user: "caioamerico",
    password: "lalaop13",
    database: "todo"
});

conSql.connect(function (err) {
    if (err) console.log('Sql não conectado');
    else console.log("Sql Conectado!");
});

//Paginas - Rotas
app.get('/home', function (request, response, next) {
    response.sendfile('public/index.html');
});

app.get('/listaTask', cors(corsOptions), function (request, response) {
    var sql = "select * from Cadastro";
    var tasksArray = [];

    conSql.query(sql, function (err, result) {
        if (err) console.log(err);
        else {
            for (var key in result) {
                tasksArray.push(result[key].task);
            }
            response.status(200).send(tasksArray);
        }
    });
});

app.post('/criarTask', cors(corsOptions), function (request, response) {
    var sql = "insert into Cadastro(task) values ?";

    var values = [[request.body.name]];

    conSql.query(sql, [values], function (err, result) {
        if (err) response.status(400).send({ error: err });
        else response.status(200).send({ status: 'ok' });
    });
});

app.post('/deletarTask', cors(corsOptions), function (request, response) {
    var sql = "delete from Cadastro where task='" + request.body.name + "'";

    conSql.query(sql, function (err, result) {
        if (err) response.status(400).send({ error: err });
        else response.status(200).send({ status: 'ok' });
    });
});

// Update task
app.post('/updateTask', cors(corsOptions), function (request, response) {
    var sql = "UPDATE from Cadastro set task= '"+ request.body.newname + "' where task='" + request.body.oldname + "'";

    conSql.query(sql, function (err, result) {
        if (err) response.status(400).send({ error: err });
        else response.status(200).send({ status: 'ok' });
    });
});

app.get('*', function (request, response) {
    response.sendfile('public/index.html');
});


app.listen(porta, function () {
    console.log("server on in: " + porta)
});