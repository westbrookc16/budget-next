'use client';
import type { category } from '@/types/category';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';
import { useEffect,useRef,useState } from "react";
import AddCategory from "./AddCategory";
import { Grid, GridColumn as Column, GridCellProps } from "@progress/kendo-react-grid";
import { Checkbox } from "@progress/kendo-react-inputs";
import { useFormState } from 'react-dom';
import { updateCategory } from '@/app/actions/categories';
export default function CatList({budgetID,cats,refreshGrid}: {budgetID:string,cats:category[],refreshGrid:()=>void}){
const originalState={message:''};
const [deleteFormState,deleteAction]=useFormState(updateCategory,originalState);

//state for the add category dialog
const [addCat,setAddCat]=useState(false);

const checkboxCell=(props: GridCellProps) => {
    const isRecurring = props.dataItem[props.field as string] as boolean; // Type assertion to ensure it's not undefined
    return (<td><Checkbox disabled checked={isRecurring}/></td>)
}

const [editCat,setEditCat]=useState<category>({id:'',name:'',amount:0,budgetId:'',isRecurring:false});
const [deleteCat,setDeleteCat]=useState<category>({id:'',name:'',amount:0,budgetId:'',isRecurring:false});
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
},[deleteFormState.message,refreshGrid]);
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
<AddCategory budgetId={budgetID} category={{name:'',amount:0,isRecurring:false,id:'',budgetId:budgetID}} mode="Add" refresh={refreshGrid} closeDialog={()=>{setAddCat(false);}}/>   
</Dialog>}

</div>)
}