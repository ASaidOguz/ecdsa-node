
const secp = require("ethereum-cryptography/secp256k1");
const{toHex}=require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;


app.use(cors());
app.use(express.json());

const balances = {
  "1fd330bb5b065fe0bbdf9edd47e0e4edd1c3cdcb": 100,//0x1 address was here!!
  "b1ccf2a8343eea4316ceefe74571cf0ba393802b": 50, //0x2 address was here!!
  "287a2afd13d6542c8802c29b3b24369df1157eb8": 75, //0x3 address was here!!
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});
let nonces=[
  {
    sender:"1fd330bb5b065fe0bbdf9edd47e0e4edd1c3cdcb",
    nonce:0
  },
  {
    sender:"b1ccf2a8343eea4316ceefe74571cf0ba393802b",
    nonce:0
  },
  {
    sender:"287a2afd13d6542c8802c29b3b24369df1157eb8",
    nonce:0
    
  }
]


app.post("/send", (req, res) => {
  const { sender, recipient, amount,signature,recoverybit } = req.body;

  let message=createTxMsg(sender,amount,recipient)
  console.log("message:",message )
  if (!Validation(sender,signature,recoverybit,message,res)){
    res.status(400).send({ message: "Transaction Validation failed!" });    
    return 
  }else{
  setInitialBalance(sender);
  setInitialBalance(recipient);
  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender],message:message });
    nonces.map((nonce)=>{
      if(nonce.sender==sender){
        nonce.nonce++
        console.log("new nonce: ",nonce)
      }
    })
  }
}});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
function createTxMsg(sender,amount,recipient){
  let sendernonce=0
  nonces.map(nonce=>{
    if(nonce.sender==sender){
        sendernonce=nonce.nonce
    }
  })
  
  return  JSON.stringify({
    sender: sender,
    amount: amount,
    recipient: recipient,
    nonce:sendernonce
  });
}
 function Validation(sender,signature,recoverybit,data,res){
  
          try {
          const dataHash=keccak256(utf8ToBytes(data))
          const public_key = secp.recoverPublicKey(dataHash,signature,recoverybit)
          const address=keccak256(public_key.slice(1)).slice(-20)
          console.log("Address: ",address)
          console.log("Sender: ",sender)
          if(sender===toHex(address)){
           
            return true
          }
          return false      
          } catch (error) {
            res.status(400).send({ message: "Transaction Validation failed!" });
            console.log("Error Log :",error)
            return false
          }
          
}