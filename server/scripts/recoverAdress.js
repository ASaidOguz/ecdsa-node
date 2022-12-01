
const secp = require("ethereum-cryptography/secp256k1");
const{toHex}=require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");



async function main(){
    const message= "8ff9964b750a1221bef3add6d1dbf3ebadd8461b552ec8c7cf2ccf16ad85c6b3"   
    const signature=("304402201c1f49b34fbefc210cb9d3fa63938bd60f630ae7fb6a601efe78e2f55b1d425e02201a3683b0a83d90e9f4312604564b02d835893cb1095a92995fd3507f05bfb925")
    const recoveryBit=1
    const publickey=await recoverKey(message,signature,recoveryBit)
    console.log("Address : ",toHex(publickey))
    
    async function recoverKey(message, signature, recoveryBit) {
      
        const public_key = secp.recoverPublicKey(message,signature,recoveryBit)
        const address=keccak256(public_key.slice(1)).slice(-20)
        return address
    }
}
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });