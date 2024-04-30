import MonthComponent from "@/components/footer/monthComponent";
import { refreshBudgetByUrl } from "@/app/actions/budget";
import SubmitButton from "@/components/submitButton";
import CopyMonthsButton from "@/components/copyCatButton";
import { refreshBudget } from "@/app/actions/budget";

import { getBudget } from "@/app/actions/budget";
import { getCategoriesByMonthYear } from "@/app/actions/categories";
import * as sentry from "@sentry/nextjs";
import type { Metadata } from "next";

import { Fade } from "@progress/kendo-react-animation";
import { useQuery } from "@tanstack/react-query";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { updateBudget } from "@/app/actions/budget";

import { DropDownList } from "@progress/kendo-react-dropdowns";

import CatList from "@/components/CatList";
import { NumericTextBox } from "@progress/kendo-react-inputs";

import Loader from "@/common/Loader";
import { budget } from "@/types/budget";
import { category } from "@/types/category";
import { createClient } from "@/utils/supabase/server";
import { Database, Tables } from "@/types/supabase";
import { getSubscriptionStatus } from "@/app/actions/user";

/*export function generateMetadata({ params }): Metadata {
  //
  const { month, year } = params;
  return { title: `Budget for ${month}/${year}` };
}*/
export default async function HandleBudgetPage({
  params,
  searchParams,
}: {
  params: { month: string; year: string };
  searchParams: { message: string };
}) {
  const supabase = createClient();

  const subscriptionStatus = await getSubscriptionStatus();

  const isActive =
    subscriptionStatus === "active" || subscriptionStatus === "trialing";

  const { month, year } = params;

  const budget = await getBudget(month, year);
  //const budget = budgetInfo.data as budget;
  const getCategories = async (budgetId: string) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/categories/${budgetId}`
    );
    return res.json();
  };
  /*const catInfo = useQuery({
    queryKey: ["categories", budget?.id],
    queryFn: async () => getCategories(budget.id),

    enabled: !!budget?.id,
  });*/

  const cats: Tables<"category_with_total_spent">[] =
    await getCategoriesByMonthYear(+month, +year);

  const total = cats?.reduce((acc, cat) => acc + (cat.amount ?? 0), 0) ?? 0;

  const loading = false;
  //const loading = false;
  //const [loading, setLoading] = useAtom(loadingAtom);
  //const [refreshDate, setRefreshDate] = useAtom(refreshDateAtom);

  return (
    <div className=" h-screen">
      <h1 className="text-center text-xl font-semibold p-5">
        Budget Management
      </h1>
      <div className=" flex justify-center items-center p-5">
        <form
          action={updateBudget}
          id="budgetForm"
          className="flex justify-center item-center gap-6 text-lg font-semibold"
        >
          <MonthComponent month={+month} />
          <DropDownList
            id="ddlYear"
            name="year"
            data={["2024", "2025", "2026"]}
            defaultValue={year}
            label="Year"
          />
          <button formAction={refreshBudget}>Select</button>
          <NumericTextBox
            id="income"
            format="c2"
            name="income"
            defaultValue={budget.income ?? 0}
            label="Income"
          />
          <input type="hidden" name="budgetId" value={budget?.id || ""} />
          <SubmitButton />
          &nbsp;{budget?.id && isActive && <CopyMonthsButton />}
        </form>
      </div>
      <div aria-busy={loading} role="status">
        <NotificationGroup
          style={{
            right: 0,
            bottom: 0,
            alignItems: "flex-start",
            flexWrap: "wrap-reverse",
          }}
        >
          <Fade>
            {searchParams.message && (
              <Notification
                type={{ style: "success", icon: true }}
                closable={false}
              >
                {searchParams.message}
              </Notification>
            )}
          </Fade>
        </NotificationGroup>
      </div>
      <div aria-live="off">
        {budget?.id && (
          <CatList
            budgetID={budget?.id}
            cats={cats}
            refreshGrid={async () => {
              "use server";
              await refreshBudgetByUrl(month, year);
            }}
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
            }).format(budget?.income ?? 0)}
            .
          </b>
        </div>

        <div aria-live="polite" aria-busy={loading}>
          You have{" "}
          <b>
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format((budget?.income ?? 0) - (total ?? 0))}{" "}
          </b>
          left to budget.
        </div>
      </div>
      {loading && (
        <div className="flex justify-center items-center">
          <Loader />
        </div>
      )}
    </div>
  );
}
//}
