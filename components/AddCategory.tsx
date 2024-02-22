'use client';
import {useState,useEffect} from "react";
export default function({budgetId,category,mode}){
const [categoryState,setCategory]=useState(category);
const [modeState,setModeState]=useState(mode);
const handleChange=(e)=>{
const {name,value}=e.target;
setCategory((c)=>{
return {...c,[name]:value};

})
}
const {name,isRecurring,amount,id}=categoryState;    
if (modeState==="add"){
return(<div>
<h1>Add Category</h1>

<form method="post" action="/api/categories">

    <label htmlFor="name">Name</label>
<input type="text" id="name" value={name} onChange={handleChange} name="name"/>
<label htmlFor="amount">Amount</label>
<input type="numberf" id="amount" value={amount} onChange={handleChange} name="amount"/>
<label htmlFor="isRecurring">Is Recurring</label>
<input type="checkbox" id="isRecurring" checked={isRecurring} onChange={handleChange} name="isRecurring"/>
<input type="hidden" name="budgetId" value={budgetId}/>
<input type="submit" value="add"/>
</form>

</div>);
}
else if (modeState==='edit'){
    return (<>
    <form>
    <tr key={id}>
        
        <td><input type="text" onChange={handleChange} value={name} name="name"/></td>
        <td><input type="number" onChange={handleChange} value={amount} name="amount"/></td>
        <td><input type="checkbox" checked={isRecurring} name="isRecurring" onChange={handleChange}/></td>
    
    <td><input type="submit" value="Update"/></td>
    </tr>
    <input type="hidden" name="id" value={id}/>
    </form>
    </>
    )


}
else if (modeState==='readonly'){
//we are readonly so make a table row
return (<tr key={id}>
    <td>{name}</td>
    <td>{amount}</td>
    <td><input type="checkbox" disabled checked={isRecurring}/></td>
<td><button onClick={e=>{
setModeState('edit');

}}>Edit</button></td>

</tr>)
}
}