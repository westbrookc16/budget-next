"use client";
import * as sentry from "@sentry/nextjs";
import dynamic from "next/dynamic";
import type { transaction } from "@/types/transaction";
import type { globalState } from "@/types/globalState";
import AddTransaction from "@/components/addTransaction";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import {
  GridCustomCellProps,
  GridColumn as Column,
} from "@progress/kendo-react-grid";
import { deleteTransaction } from "@/app/actions/transactions";
import type { category } from "@/types/category";
import React, { useCallback, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { useGlobalState } from "@/components/globalState";

export default function DisplayTransactions() {
  const Grid: any = dynamic(
    () =>
      import("@progress/kendo-react-grid").then((module) => module.Grid) as any,
    {
      ssr: false,
    }
  );
  const cats = useGlobalState((state: globalState) => state.cats);
  const transactions = useGlobalState(
    (state: globalState) => state.transactions
  );
  const setTransactions = useGlobalState(
    (state: globalState) => state.setTransactions
  );
  const { categoryId } = useParams();
  //
  const selectedCat = useCallback(
    () =>
      categoryId !== "" ? cats.filter((v) => v.id === categoryId)[0] : cats[0],
    [categoryId, cats]
  );
  const [refreshDate, setRefreshDate] = useState<Date>(new Date());

  const [showAddTransaction, setShowAddTransaction] = useState<Boolean>(false);
  const [showEditTransaction, setShowEditTransaction] =
    useState<Boolean>(false);
  const [showDeleteTransaction, setShowDeleteTransaction] =
    useState<Boolean>(false);
  const [transactionToBeDeleted, setTransactionToBeDeleted] =
    useState<transaction>();
  const [editTransaction, setEditTransaction] = useState<transaction>();
  useEffect(() => {
    async function fetchData() {
      //get a list of transactions for the selected category
      try {
        if (!selectedCat()) return;

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/transactions/${
            selectedCat().id
          }`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            mode: "cors",
          }
        );
        const data = await res.json();
        setTransactions(data);
        //get a list of categories
      } catch (e) {
        console.error(e);
        sentry.captureException(e);
      }
    }
    fetchData();
  }, [setTransactions, selectedCat, refreshDate]);

  return (
    <div>
      <h1>Transactions for {selectedCat()?.name}</h1>
      <Grid data={transactions}>
        <Column field="name" title="Name" />
        <Column field="amount" title="Amount" format="{0:c2}" />
        <Column
          field="date"
          title="Date"
          cells={{
            data: (props: GridCustomCellProps) => (
              <td {...props.tdProps}>
                {new Date(props.dataItem["date"]).toDateString()}
              </td>
            ),
          }}
        />
        <Column field="description" title="Description" />
        <Column
          title="Actions"
          cells={{
            data: (props: GridCustomCellProps) => (
              <td {...props.tdProps}>
                <button
                  onClick={() => {
                    setShowEditTransaction(true);
                    setEditTransaction(props.dataItem);
                  }}
                >
                  Edit
                </button>
                &nbsp;
                <button
                  onClick={() => {
                    setShowDeleteTransaction(true);
                    setTransactionToBeDeleted(props.dataItem);
                  }}
                >
                  Delete
                </button>
              </td>
            ),
          }}
        />
      </Grid>
      <button onClick={() => setShowAddTransaction(true)}>
        Add Transaction
      </button>
      {showAddTransaction && (
        <Dialog>
          <AddTransaction
            transaction={{
              name: "",
              description: "",
              amount: 0,
              date: new Date(),
              category: selectedCat().id,
              id: "",
            }}
            categoryId={selectedCat()?.id}
            mode="Add"
            closeDialog={() => setShowAddTransaction(false)}
            refreshGrid={() => setRefreshDate(new Date())}
          />
        </Dialog>
      )}
      {showEditTransaction && editTransaction && (
        <Dialog>
          <AddTransaction
            categoryId={selectedCat()?.id}
            mode="Update"
            transaction={editTransaction}
            closeDialog={() => setShowEditTransaction(false)}
            refreshGrid={() => setRefreshDate(new Date())}
          />
        </Dialog>
      )}
      {showDeleteTransaction && (
        <Dialog>
          <h1>
            Are you sure you want to delete{" "}
            <b>{transactionToBeDeleted?.name}?</b>
          </h1>
          <DialogActionsBar>
            <button onClick={() => setShowDeleteTransaction(false)} autoFocus>
              No
            </button>
            <form
              action={async (data: FormData) => {
                await deleteTransaction(
                  { timestamp: new Date(), message: "" },
                  data
                );
                setShowDeleteTransaction(false);
                setRefreshDate(new Date());
              }}
            >
              <input
                type="hidden"
                name="id"
                value={transactionToBeDeleted?.id}
              />
              <input
                type="hidden"
                name="amount"
                value={transactionToBeDeleted?.amount}
              />
              <input type="hidden" value={categoryId} name="realCategory" />
              <button type="submit">Yes</button>
            </form>
          </DialogActionsBar>
        </Dialog>
      )}
    </div>
  );
}
