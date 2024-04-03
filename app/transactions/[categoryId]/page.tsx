"use client";
import { DateTime } from "luxon";
import * as sentry from "@sentry/nextjs";
import dynamic from "next/dynamic";
import type { transaction } from "@/types/transaction";
import AddTransaction from "@/components/addTransaction";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import {
  GridCustomCellProps,
  GridColumn as Column,
} from "@progress/kendo-react-grid";
import { deleteTransaction } from "@/app/actions/transactions";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { category } from "@/types/category";
import { useQuery } from "@tanstack/react-query";

export default function DisplayTransactions() {
  const { categoryId } = useParams();
  const getCategories = async (id: string) => {
    //get the current category id so we can get the categoreis from that budget
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/categories/getById/${id}`
    );
    const category = (await res.json()) as category;
    //get the categories for the current budget

    const res2 = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/categories/${category.budgetId}`
    );
    return res2.json();
  };
  const catInfo = useQuery({
    queryKey: ["categories", categoryId],
    queryFn: () => getCategories(categoryId as string),
  });
  const cats: category[] = catInfo.data as category[];
  const [lastElement, setLastElement] = useState<Element>();
  const Grid: any = dynamic(
    () =>
      import("@progress/kendo-react-grid").then((module) => module.Grid) as any,
    {
      ssr: false,
    }
  );

  //
  const selectedCat = useCallback(
    () =>
      categoryId !== "" ? cats?.filter((v) => v.id === categoryId)[0] : cats[0],
    [categoryId, cats]
  );

  const [showAddTransaction, setShowAddTransaction] = useState<Boolean>(false);
  const [showEditTransaction, setShowEditTransaction] =
    useState<Boolean>(false);
  const [showDeleteTransaction, setShowDeleteTransaction] =
    useState<Boolean>(false);
  const [transactionToBeDeleted, setTransactionToBeDeleted] =
    useState<transaction>();
  const [editTransaction, setEditTransaction] = useState<transaction>();
  const getTransactions = async () => {
    //get a list of transactions for the selected category
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/transactions/${categoryId}`,

        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          mode: "cors",
        }
      );
      return res.json();
    } catch (e) {
      console.error(e);
      sentry.captureException(e);
    }
  };
  const transactionInfo = useQuery({
    queryKey: ["transactions", categoryId],
    queryFn: getTransactions,
    enabled: !!categoryId,
  });
  const transactions: transaction[] = transactionInfo.data as transaction[];
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
                {DateTime.fromISO(props.dataItem.date).toUTC().toFormat("D")}
              </td>
            ),
          }}
        />
        <Column field="description" title="Description" />
        <Column
          title="Edit"
          cells={{
            data: (props: GridCustomCellProps) => (
              <td {...props.tdProps}>
                <button
                  onClick={() => {
                    setLastElement(document.activeElement ?? undefined);
                    setShowEditTransaction(true);
                    setEditTransaction(props.dataItem);
                  }}
                >
                  Edit
                </button>
              </td>
            ),
          }}
        />
        <Column
          title="Delete"
          cells={{
            data: (props: GridCustomCellProps) => (
              <td {...props.tdProps}>
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
            refreshGrid={() => {
              transactionInfo.refetch();
            }}
          />
        </Dialog>
      )}
      {showEditTransaction && editTransaction && (
        <Dialog>
          <AddTransaction
            categoryId={selectedCat()?.id}
            mode="Update"
            transaction={editTransaction}
            closeDialog={() => {
              setShowEditTransaction(false);
              //@ts-ignore
              lastElement?.focus();
            }}
            refreshGrid={() => transactionInfo.refetch()}
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
                transactionInfo.refetch();
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
