"use client";
import { useUser } from "@clerk/nextjs";

import { formatCurrency } from "@/utils/money";
import type { category } from "@/types/category";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { useState } from "react";
import AddCategory from "./AddCategory";
import {
  Grid,
  GridColumn as Column,
  GridCustomCellProps,
} from "@progress/kendo-react-grid";
import { Checkbox } from "@progress/kendo-react-inputs";
import { useFormState } from "react-dom";
import { updateCategory } from "@/app/actions/categories";
import Link from "next/link";

export default function CatList({ budgetID, cats, refreshGrid }: any) {
  const { user } = useUser();
  const subscriptionStatus: string | undefined =
    user?.publicMetadata?.stripe?.subscriptionStatus;
  const originalState = { message: "" };
  const [deleteFormState, deleteAction] = useFormState(
    updateCategory,
    originalState
  );

  //state for the add category dialog
  const [addCat, setAddCat] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const editTransactionsCell = (props: GridCustomCellProps) => {
    return (
      <td {...props.tdProps} colSpan={1}>
        <Link href={`/transactions/${props.dataItem.id}`}>
          Edit Transactions
        </Link>
      </td>
    );
  };
  const checkboxCell = (props: GridCustomCellProps) => {
    const isRecurring = props.dataItem[props.field ?? ""];
    return (
      <td {...props.tdProps} colSpan={1}>
        <Checkbox disabled checked={isRecurring} />
      </td>
    );
  };
  const [editCat, setEditCat] = useState<category>({
    id: "",
    name: "",
    amount: 0,
    isRecurring: false,
    budgetId: "",
    totalSpent: 0,
  });
  const [deleteCat, setDeleteCat] = useState<category>({
    id: "",
    name: "",
    amount: 0,
    isRecurring: false,
    budgetId: "",
    totalSpent: 0,
  });

  const editCell = (props: GridCustomCellProps) => {
    return (
      <td {...props.tdProps} colSpan={1}>
        <button
          className={`font-semibold text-blue-500 px-4 py-2 border rounded-md hover:bg-blue-200 transition transition-delay: 300ms`}
          onClick={(e) => {
            setIsEditing(true);
            setEditCat(props.dataItem);
          }}
          tabIndex={0}
        >
          Edit
        </button>
      </td>
    );
  };
  const deleteCell = (props: GridCustomCellProps) => {
    return (
      <td {...props.tdProps} colSpan={1}>
        <button
          className="font- text-red-500 px-4 py-2 border-2 rounded transition transition-delasemiboldy: 300ms; hover:bg-red-200"
          onClick={(e) => {
            setIsDeleting(true);
            setDeleteCat(props.dataItem);
          }}
        >
          Delete
        </button>
      </td>
    );
  };

  const closeDialog = () => {
    setIsEditing(false);
  };

  const closeDeleteDialog = () => {
    setIsDeleting(false);
  };
  const isActive =
    subscriptionStatus === "active" || subscriptionStatus === "trialing";

  return (
    <div className="flex justify-center items-center flex-col p-5">
      <h1 className="text-xl font-semibold p-5">Categories</h1>
      <Grid data={cats} className=" xl:w-2/3 md:w-full">
        <Column field="name" title="Name" className="text-lg" />
        <Column
          field="amount"
          format="{0:c2}"
          title="Amount"
          className="text-lg"
        />
        <Column
          field="isRecurring"
          title="Is Recurring"
          cells={{ data: checkboxCell }}
        />
        {isActive && (
          <Column
            field="totalSpent"
            title="Total Spent"
            format="{0:c2}"
            cells={{
              data: (e: GridCustomCellProps) => (
                <td {...e.tdProps} colSpan={1}>
                  {formatCurrency(e.dataItem["totalSpent"] ?? 0)}
                </td>
              ),
            }}
          />
        )}
        <Column title="Edit" cells={{ data: editCell }} />
        <Column title="Delete" cells={{ data: deleteCell }} />
        {isActive && (
          <Column
            title="Edit Transactions"
            cells={{ data: editTransactionsCell }}
          />
        )}
      </Grid>
      {isEditing && (
        <Dialog
          title="Edit Category"
          className="font-semibold"
          onClose={closeDialog}
        >
          <AddCategory
            mode="Edit"
            budgetId={budgetID}
            category={editCat}
            refresh={refreshGrid}
            closeDialog={closeDialog}
          />
        </Dialog>
      )}
      {isDeleting && (
        <Dialog onClose={closeDeleteDialog} title="Confirm deletion">
          Are you sure you wish to delete <b>{deleteCat.name}</b>?
          <DialogActionsBar>
            <div className="w-full flex justify-between items-center p-2">
              <button
                className="w-1/4 bg-gray-300 text-black font-semibold p-2 rounded transition transition-delay:300ms hover:bg-gray-400"
                autoFocus
                onClick={(e) => {
                  setIsDeleting(false);
                }}
              >
                No
              </button>
              <form
                action={async (data: FormData) => {
                  await deleteAction(data);
                  refreshGrid();
                  setIsDeleting(false);
                }}
                className="w-1/4 bg-red-500 text-center cursor-pointer text-white font-semibold p-2 rounded transition transition-delay:300ms hover:bg-red-600"
              >
                <input type="hidden" name="action" value="delete" />
                <input type="hidden" name="id" value={deleteCat.id} />
                <button type="submit">Yes</button>
              </form>
            </div>
          </DialogActionsBar>
        </Dialog>
      )}
      <button
        className="p-2 mt-2 bg-gray-700 text-white cursor-pointer transition transition-delay:300ms  rounded hover:bg-gray-800 "
        onClick={(e) => {
          setAddCat(true);
        }}
      >
        Add Category
      </button>
      {addCat && (
        <Dialog
          title="Add Category"
          onClose={(e) => {
            setAddCat(false);
          }}
        >
          <AddCategory
            budgetId={budgetID}
            category={{
              name: "",
              amount: 0,
              isRecurring: false,
              id: "",
              budgetId: budgetID,
              totalSpent: 0,
            }}
            mode="Add"
            refresh={refreshGrid}
            closeDialog={() => {
              setAddCat(false);
            }}
          />
        </Dialog>
      )}
    </div>
  );
}
