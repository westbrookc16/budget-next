"use client";
import * as sentry from "@sentry/nextjs";
import type { Metadata } from "next";

/*import {
  isActiveAtom,
  loadingAtom,
  refreshDateAtom,
  budgetAtom,
  categoriesAtom,
  totalAtom,
} from "@/types/atoms";*/

import { Fade } from "@progress/kendo-react-animation";
import { useQuery } from "@tanstack/react-query";
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
import { budget } from "@/types/budget";
import { category } from "@/types/category";
import { useUser } from "@clerk/nextjs";

/*export function generateMetadata({ params }): Metadata {
  //
  const { month, year } = params;
  return { title: `Budget for ${month}/${year}` };
}*/
export default function HandleBudgetPage() {
  //use global state context
  const { user } = useUser();
  const subscriptionStatus: string | undefined =
    user?.publicMetadata?.stripe?.subscriptionStatus;
  const isActive =
    subscriptionStatus === "active" || subscriptionStatus === "trialing";
  const [income, setIncome] = useState<number>(0);
  const { month, year } = useParams();

  const budgetInfo = useQuery({
    queryKey: ["budget", month, year],
    queryFn: () => {
      return getBudget(month as string, year as string);
    },
  });
  const budget = budgetInfo.data as budget;
  const getCategories = async (budgetId: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/categories/${budgetId}`
    );
    return res.json();
  };
  const catInfo = useQuery({
    queryKey: ["categories", budget?.id],
    queryFn: async () => getCategories(budget.id),

    enabled: !!budget?.id,
  });
  useEffect(() => {
    setIncome(budget?.income ?? 0);
  }, [budget]);
  const cats: category[] = catInfo.data as category[];
  const total = cats?.reduce((acc, cat) => acc + cat.amount, 0) ?? 0;

  const loading = budgetInfo.isFetching || catInfo.isFetching;
  //const [loading, setLoading] = useAtom(loadingAtom);
  //const [refreshDate, setRefreshDate] = useAtom(refreshDateAtom);
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

  const initialState: any = { message: "" };
  const [formState, formAction] = useFormState(updateBudget, initialState);

  const router = useRouter();

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
      setDdlMonth(e.target.value);
      //router.push(`/budget/${e.target.value.value}/${ddlYear}`);
    } else {
      setDdlYear(e.target.value);
      //router.push(`/budget/${realMonth}/${e.target.value}`);
    }
  };
  useEffect(() => {
    document.title = `Budget for ${month}/${year}`;
  }, [month, year]);
  const selectBudget = () => {
    router.push(`/budget/${realMonth}/${ddlYear}`);
  };
  const [success, setSuccess] = useState<boolean>(false);

  const [totalLeft, setTotalLeft] = useState<number>(0);
  const [refreshBudget, setRefreshBudget] = useState<Date>(new Date());

  /*useEffect(() => {
    if (!budget) return;
    setTotalLeft(budget.income - Number(total));
  }, [budget, cats, total]);*/

  useEffect(() => {
    if ("message" in formState && formState.message) {
      setSuccess(true);
      budgetInfo.refetch();
      //refresh the categories
      if (formState.message.includes("categories")) {
        catInfo.refetch();
      }
      //clear the message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formState]);
  const getBudget = async (month: string, year: string) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/budget/${month}/${year}`
    );
    return response.json();
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
          <button onClick={selectBudget}>Select</button>
          <NumericTextBox
            id="income"
            format="c2"
            name="income"
            value={income ?? 0}
            onChange={(e) => {
              setIncome(e.value ?? 0);
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
          <CatList
            budgetID={budget.id}
            cats={cats}
            refreshGrid={catInfo.refetch}
          />
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
