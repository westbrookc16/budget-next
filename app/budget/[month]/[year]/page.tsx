"use client";
import * as sentry from "@sentry/nextjs";
import { useAtom, useAtomValue } from "jotai";
import {
  isActiveAtom,
  loadingAtom,
  refreshDateAtom,
  budgetAtom,
  categoriesAtom,
  totalAtom,
} from "@/types/atoms";

import { Fade } from "@progress/kendo-react-animation";

import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { updateBudget } from "@/app/actions/budget";
import { useFormState, useFormStatus } from "react-dom";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useEffect, useState } from "react";
import CatList from "@/components/CatList";
import { NumericTextBox } from "@progress/kendo-react-inputs";

import Loader from "@/common/Loader";

export default function HandleBudgetPage() {
  //use global state context
  const isActive = useAtomValue(isActiveAtom);

  const [loading, setLoading] = useAtom(loadingAtom);
  const [refreshDate, setRefreshDate] = useAtom(refreshDateAtom);
  const SubmitButton = () => {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        value={pending ? "Submitting" : "Submit"}
        disabled={pending}
        className="bg-blue-600 h-9 w-100 text-sm p-2 rounded text-white mt-4 cursor-pointer hover:bg-blue-700 transition transition-duration: 500ms;"
        name="submit"
      >
        Submit
      </button>
    );
  };
  const CopyMonthsButton = () => {
    const { pending } = useFormStatus();
    return (
      <button
        type="submit"
        value="Copy Categories from Previous Month"
        disabled={pending}
        className="bg-blue-600 h-9 w-100 text-sm p-2 rounded text-white mt-4 cursor-pointer hover:bg-blue-700 transition transition-duration: 500ms;"
        name="submit"
      >
        Copy Categories from Previous Month
      </button>
    );
  };
  const [budget, setBudget] = useAtom(budgetAtom);
  const [cats, setCats] = useAtom(categoriesAtom);
  const total = useAtomValue(totalAtom);
  const initialState: any = { message: "" };
  const [formState, formAction] = useFormState(updateBudget, initialState);

  const router = useRouter();
  const { month, year } = useParams();

  const [realMonth, setRealMonth] = useState(month);

  const months = [
    { name: "Jan", value: 1 },
    { name: "Feb", value: 2 },
    { name: "Mar", value: 3 },
    { name: "Apr", value: 4 },
    { name: "May", value: 5 },
    { name: "Jun", value: 6 },
    { name: "Jul", value: 7 },
    { name: "Aug", value: 8 },
    { name: "Sep", value: 9 },
    { name: "Oct", value: 10 },
    { name: "Nov", value: 11 },
    { name: "Dec", value: 12 },
  ];
  const [ddlMonth, setDdlMonth] = useState(
    months.filter((v) => v.value === parseInt(month.toString()))[0]
  );
  const [ddlYear, setDdlYear] = useState<string>(year.toString());

  const changeBudget = (e: any) => {
    if (e.target.name === "month") {
      setRealMonth(e.target.value.value);
      router.push(`/budget/${e.target.value.value}/${ddlYear}`);
    } else {
      setDdlYear(e.target.value);
      router.push(`/budget/${realMonth}/${e.target.value}`);
    }
  };
  const [success, setSuccess] = useState<boolean>(false);

  const [totalLeft, setTotalLeft] = useState<number>(0);
  const [refreshBudget, setRefreshBudget] = useState<Date>(new Date());

  useEffect(() => {
    if (!budget) return;
    setTotalLeft(budget.income - Number(total));
  }, [budget, cats, total]);

  useEffect(() => {
    if ("message" in formState && formState.message) {
      setSuccess(true);
      setRefreshBudget(new Date());
      //refresh the categories
      if (formState.message.includes("categories")) {
        setRefreshDate(new Date());
      }
      //clear the message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
  }, [formState, setRefreshDate]);

  useEffect(() => {
    setLoading(true);
    async function fetchData() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}api/budget/${month}/${year}`
      );
      const budget = await res.json();
      setBudget(budget);
      if (!budget.id || budget.id === "") {
        //clear categories if no budget is retrieved

        setCats([]);

        setLoading(false);
        return;
      }

      try {
        const catsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}api/categories/${budget.id}`
        );
        const data = await catsRes.json();

        setCats(data);
      } catch (e) {
        console.error(e);
        sentry.captureException(e);
      }
      setLoading(false);
    }
    fetchData();
  }, [setBudget, setLoading, month, year, refreshBudget, setCats, refreshDate]);

  const refreshGrid = () => {
    const newDate = new Date();
    setRefreshDate(newDate);
  };

  if (loading) {
    return (
      //implement a loader
      <div className="flex justify-center items-center mt-80">
        <Loader />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-center text-xl font-semibold p-5">
        Budget Management
      </h1>
      <div className=" flex justify-center items-center p-5">
        <form
          action={formAction}
          id="budgetForm"
          className="flex justify-center item-center gap-6 text-lg font-semibold"
        >
          <DropDownList
            id="ddlMonth"
            name="month"
            value={ddlMonth}
            onChange={changeBudget}
            data={months}
            textField="name"
            dataItemKey="value"
            label="Month"
          />
          <input
            type="hidden"
            id="realMonth"
            name="realMonth"
            value={realMonth}
          />
          <DropDownList
            id="ddlYear"
            name="year"
            data={["2024", "2025", "2026"]}
            value={ddlYear}
            onChange={changeBudget}
            label="Year"
          />
          <NumericTextBox
            id="income"
            format="c2"
            name="income"
            value={budget.income}
            onChange={(e) => {
              setBudget({ ...budget, income: e.value ?? 0 });
            }}
            label="Income"
          />
          <input type="hidden" name="budgetId" value={budget.id} />
          <SubmitButton />
          &nbsp;{budget.id && isActive && <CopyMonthsButton />}
        </form>
      </div>
      <div aria-live="assertive" aria-atomic="false" aria-busy={loading}>
        <NotificationGroup
          style={{
            right: 0,
            bottom: 0,
            alignItems: "flex-start",
            flexWrap: "wrap-reverse",
          }}
        >
          <Fade>
            {success && (
              <Notification
                type={{ style: "success", icon: true }}
                closable={false}
                onClose={() => {
                  setSuccess(false);
                }}
              >
                {formState?.message}
              </Notification>
            )}
          </Fade>
        </NotificationGroup>
      </div>
      <div aria-live="off">
        {budget.id && (
          <CatList budgetID={budget.id} cats={cats} refreshGrid={refreshGrid} />
        )}
      </div>
      <div className="text-md p-5 flex justify-center items-center flex-col gap-3 md:text-xl">
        <div>
          Total Budget:{" "}
          <b>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(total)}
            .
          </b>
        </div>

        <div>
          Total Income:{" "}
          <b>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(budget.income ?? 0)}
            .
          </b>
        </div>

        <div aria-live="polite" aria-busy={loading}>
          You have{" "}
          <b>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format((budget.income ?? 0) - (total ?? 0))}{" "}
          </b>
          left to budget.
        </div>
      </div>
    </div>
  );
}
//}
