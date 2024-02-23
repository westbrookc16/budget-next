'use client';
import { Dialog } from '@progress/kendo-react-dialogs';
import { useEffect,useRef,useState } from "react";
import AddCategory from "./AddCategory";
import { Grid, GridColumn as Column, GridCellProps } from "@progress/kendo-react-grid";
import { Checkbox } from "@progress/kendo-react-inputs";
export default function({budgetID}){

const [cats,setCats]=useState([]);    
const focusRef=useRef(null);
useEffect(()=>{
async function fetchData(){
try{
    const catsRes=await fetch(`/api/categories/${budgetID}`);
setCats(await catsRes.json());
}
catch(e){
console.log(e);

}
}
fetchData();

},[budgetID]);

    const checkboxCell=(props: GridCellProps) => {
const isRecurring=props.dataItem[props.field]; 
return (<td><Checkbox disabled checked={isRecurring}/></td>)
    }
const [editCat,setEditCat]=useState({});
const [isEditing,setIsEditing]=useState(false);
const editCell=(props:GridCellProps)=>{
return (<td><button onClick={e=>{
    setIsEditing(true);
        setEditCat(props.dataItem);
        

    

}}>Edit</button></td>);


}
return(<div>
<h1>List of Categories</h1>
<Grid data={cats}>
<Column field="name" title="name"/>
<Column field="amount" format="{0:c2}" title="amount"/>
<Column field="isRecurring" title="Is Recurring" cell={checkboxCell}/>

<Column title="Edit" cell={editCell}/>
</Grid>
{isEditing&&<Dialog title="Edit Category" onClose={()=>{
setIsEditing(false);

}} >
    <AddCategory mode="Edit" budgetId={budgetID} category={editCat} focusRef={focusRef}/>
    </Dialog>}
</div>)
}