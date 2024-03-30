"use client";

const HomePage = () => {
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}`;
  console.log(`redirecting: `, url);
  return (
    <div
      style={{ background: "rgb(250, 249, 246)" }}
      className="flex justify-center items-center flex-col mt-10 h-screen"
    >
      <h1 className="font-semibold text-xl lg:text-2xl mb-5 xl:text-3xl">
        Budget Management
      </h1>
      <div className="h-full">
        <div className="flex justify-center items-center flex-col px-3">
          <p
            className="text-sm w-full text-center rounded-md 2xl lg:text-lg"
            style={{ lineHeight: 2 }}
          >
            Welcome to my budget management app. Sign in with google or your
            email address, then click budget management and select a month/year.
            From there, enter your income for the month and click submit. Then
            you can split that income into categories such as rent, utilities,
            or whatever you would like. Subscribe for the ability to enter
            transactions for each category so you can see where you stand at the
            end of the month.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
