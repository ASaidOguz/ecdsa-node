import { Fragment } from "react"


function TransactionInfo({message}){
   let messages=[]
   messages.push(...messages,message)
   console.log(JSON.stringify(messages))
    return(
    <div className="container transfer">
        <ul> <h1>Latest Transaction</h1>
        {messages.map(message=>
        <Fragment key={message}>
        <h2>Transaction Id:{message.nonce}</h2>
        <li key={message.sender}><h3>from:</h3>{message.sender}</li> 
        <li  key={message.recipient}><h3>to:</h3>{message.recipient}</li>
        <li  key={message.amount}><h3>amount:</h3>{message.amount}</li>
        </Fragment>
         )}
        </ul>
    </div>
)
}
export default TransactionInfo