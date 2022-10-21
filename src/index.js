const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());
app.use('/img', express.static('img'));
const candidates = [];
const usuarios = [];
const votes = [];

function conta(x){
  let contar = 0;
  for(let s = 0; s < votes.length; s++ ){
    let vote = votes[s];
    if(vote.candidateId == x.candidateId){
      contar++

    }
  }
  console.log(contar);
  return contar;
 };
// cadastrando usuario
app.post('/usuario', (request, response) => {
const { name , username } = request.body;
const usuarioId = usuarios.find((usuario) => usuario.username=== username);
if(usuarioId){
  return response.status(400).json({ error: "Usuario ja existe!"})
}
  const usuario =
    { 
      username,
      name,  
  }
  usuarios.push(usuario);
  return response.status(201).json(usuario);
})
//cadastrando os candidatos
app.post("/candidato", (request, response) => {
 
  const {candidateId,candidateName, partyId, partyName,imageUrl} = request.body;
  const encontrarcandidato = candidates.find((candidate) => candidate.candidateId === candidateId); 
  if(encontrarcandidato){
    return response.status(400).json({ errMsg: "candadito ja existe!"})
  }
  const  candidate = {
    candidateId,
     candidateName, 
     partyId,
     partyName,
     imageUrl
   }
   candidates.push(candidate);
   return response.status(201).json(candidate);
 });

 //buscando todos candidatos
 app.get("/listdecandidatos/id", (request, response) => {
  return response.json(candidates);
 })
 // buscando um candidato
 app.get("/candidates/:candidateId",(request,response)=>{
    const username = request.headers["x-bolovo-username"];
    const {candidateId} = request.params;

    const candidato = candidates.find((candidate) => candidate.candidateId == candidateId); 
    if(candidato == null){
      return response.status(400).json({ errMsg: "numero nao encontrado!"})
    }
    const usuarioId = usuarios.find((usuario) => usuario.username === username);
   console.log(usuarioId);
  console.log(" no "+  new Date().toLocaleString() + " o cidadao " + `${username}` + " Pesquisa de candidatos ")  
console.log(candidato) 

 
  return response.json(candidato); 
 });
 
//voto
 app.post("/votes/:candidateId", (request, response) => {
 const  username = request.headers["x-bolovo-username"];
 const {candidateId} = request.params;
 const { candidateName, partyName} = request.body;

 const candidate= candidates.find((candidate) => candidate.candidateId == candidateId); 
 console.log(candidate);
 if(candidate == null){
  const vote = {
    "username": username,
    "candidateId":  null, 
    "partyName": null,
    "partyId": null,
 }
 votes.push(vote);
 conta(vote);
 console.log(vote);
 return response.json({errMsg : "numero do candidato nao encontrado"}); 

}else{
  const vote = {
    "username": username,
    "candidateId":  candidate.candidateId, 
    "candidateName": candidate.candidateName,
    "partyName": candidate.partyName,
    "partyId": candidate.partyId,

}
votes.push(vote);
conta(vote);
console.log(`${username}, seu voto foi confirmado no ${candidateName} do partido ${partyName}`);
console.log(" no dia "+  new Date().toLocaleString() + " o cidadao " + `${username}` + " Confirmação do voto");
}
return response.json({ msg: `${username}, seu voto foi confirmado no candidato ${candidateName} do partido ${partyName}` })
 });

app.listen(8888);