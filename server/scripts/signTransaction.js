const secp = require("ethereum-cryptography/secp256k1");
const{toHex}=require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

const sender="287a2afd13d6542c8802c29b3b24369df1157eb8"
const recipient="b1ccf2a8343eea4316ceefe74571cf0ba393802b"
const amount=5
//const data=`${sender} sends ${amount} ether to ${recipient}`
const PRIVATE_KEY ='e531aae4a71539344ccaa5ce0e46a638b94ed1cb9215321cde2912ee7e8d5d05'

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
//const data=`${sender} sends ${amount} ether to ${recipient} nonce:${nonces[0].nonce}`



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

function getSign(sender,amount,recipient){ 
console.log("Msg:",createTxMsg(sender,amount,recipient))
const msghash=keccak256(utf8ToBytes(createTxMsg(sender,amount,recipient)))       
console.log("Message Hash: ",toHex(msghash))
return secp.sign(msghash, PRIVATE_KEY, { recovered: true })
}
//The keyword async before a function makes the function return a promise:
async function main(){
    const signature=  await getSign(sender,amount,recipient)
    console.log("SIGN: ",signature)
    console.log("Signature is:",toHex(signature[0]))
    console.log("Recovery bit: ",signature[1])

  }

  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

