"use client";
import { DropDownList } from "@progress/kendo-react-dropdowns";
export default function MonthComponent({ month }: { month: number }) {
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
  return (
    <DropDownList
      id="ddlMonth"
      name="month"
      defaultItem={
        months.find((m) => m.value === month) || { name: "Jan", value: 1 }
      }
      data={months}
      textField="name"
      dataItemKey="value"
      label="Month"
      valueMap={(value) => (value ? value.value : "")}
    />
  );
}
