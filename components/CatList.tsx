'use client';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { useEffect,useRef,useState } from "react";
import AddCategory from "./AddCategory";
import { Grid, GridColumn as Column, GridCellProps } from "@progress/kendo-react-grid";
import { Checkbox } from "@progress/kendo-react-inputs";
import { useFormState } from 'react-dom';
import { updateCategory } from '@/app/actions/categories';
export default function CatList({budgetID}){
const originalState={message:''};
const [deleteFormState,deleteAction]=useFormState(updateCategory,originalState);
//calculate the total amount of the categories
const totalBudgeted=()=>{let total=0;
cats.forEach(cat=>total+=cat.amount);
return total;
}

const [cats,setCats]=useState([]);    
//state for the add category dialog
 const [addCat,setAddCat]=useState(false);
const [refreshDate,setRefreshDate]=useState("");
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

},[budgetID,refreshDate]);

    const checkboxCell=(props: GridCellProps) => {
const isRecurring=props.dataItem[props.field]; 
return (<td><Checkbox disabled checked={isRecurring}/></td>)
    }
const [editCat,setEditCat]=useState({});
const [deleteCat,setDeleteCat]=useState({});
const [isEditing,setIsEditing]=useState(false);
const[isDeleting,setIsDeleting]=useState(false);
const editCell=(props:GridCellProps)=>{
return (<td><button onClick={e=>{
    setIsEditing(true);
        setEditCat(props.dataItem);
        

    

}}>Edit</button></td>);


}
const deleteCell=(props:GridCellProps)=>{
    return (<td><button onClick={e=>{
        setIsDeleting(true);
            setDeleteCat(props.dataItem);
            
    
        
    
    }}>Delete</button></td>);
    
    
    }
    
const refreshGrid=()=>{
setRefreshDate(new Date());
 
}

const closeDialog=()=>{
    setIsEditing(false);
    
}
const closeDeleteDialog=()=>{setIsDeleting(false);}

//if an item has been deleted, close the dialog
useEffect(()=>{
if (isDeleting&&deleteFormState.message){
setIsDeleting(false);
refreshGrid();

}
},[deleteFormState.message]);
return(<div>
<h1>List of Categories</h1>
<Grid data={cats}>
<Column field="name" title="name"/>
<Column field="amount" format="{0:c2}" title="amount"/>
<Column field="isRecurring" title="Is Recurring" cell={checkboxCell}/>

<Column title="Edit" cell={editCell}/>
<Column title='Delete' cell={deleteCell}/>
</Grid>
{isEditing&&<Dialog title="Edit Category" onClose={closeDialog}>
    <AddCategory mode="Edit" budgetId={budgetID} category={editCat} refresh={refreshGrid} closeDialog={closeDialog} />
    </Dialog>}
{isDeleting&&(<Dialog title="Confirm deletion">
Are you sure you wish to delete {deleteCat.name}?
<DialogActionsBar>
<button autoFocus onClick={e=>{
setIsDeleting(false);

}}>No</button>
<form action={deleteAction}>
<input type="hidden" name="action" value="delete"/>
<input type="hidden" name="id" value={deleteCat.id}/>
<button type="submit">Yes</button>
</form>
</DialogActionsBar>
</Dialog>)}
<button onClick={e=>{
setAddCat(true);

}}>Add Category</button>
{addCat&&<Dialog title="Add Category" onClose={e=>{setAddCat(false);}}>
<AddCategory budgetId={budgetID} category={{name:'',amount:0,isRecurring:false,id:''}} mode="Add" refresh={refreshGrid} closeDialog={()=>{setAddCat(false);}}/>   
</Dialog>}
<div aria-live='polite'>Total Budgeted: {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalBudgeted())}</div>
</div>)
}