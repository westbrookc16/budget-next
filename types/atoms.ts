// import { atom } from "jotai";
// import { budget } from "./budget";
// import { category } from "./category";
// import { transaction } from "./transaction";
// export const budgetAtom = atom<budget>({
//   id: "",
//   month: 1,
//   year: 2024,
//   income: 0,
// });
// export const categoriesAtom = atom<category[]>([]);
// export const transactionsAtom = atom<transaction[]>([]);
// export const totalAtom = atom<number>((get) => {
//   const categories = get(categoriesAtom);
//   return categories.reduce((acc, cat) => acc + cat.amount, 0);
// });
// export const refreshDateAtom = atom<Date>(new Date());
// export const loadingAtom = atom<boolean>(false);
// export const subscriptionStatusAtom = atom<string>("");
// export const customerIdAtom = atom<string>("");
// export const isActiveAtom = atom<boolean>((get) => {
//   const status = get(subscriptionStatusAtom);
//   return status === "active" || status === "trialing";
// });
