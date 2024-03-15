'use client';

const HomePage = () => {
  return (
    <div className='flex justify-center items-center flex-col mt-10'>
      <h1 className='font-semibold text-2xl mb-5 xl:text-3xl'>
        Budget Management
      </h1>
      <div className='flex justify-center items-center flex-col px-20 py-5  h-full'>
        <p
          className='text-lg w-full text-center bg-blue-50 px-4 py-2 border rounded-md 2xl:w-1/2'
          style={{ lineHeight: 2 }}
        >
          Welcome to my budget management app. Sign in with google or your email
          address, then click budget management and select a month/year. From
          there, enter your income for the month and click submit. Then you can
          split that income into categories such as rent, utilities, or whatever
          you would like.Subscribe for the ability to enter transactions for
          each category so you can see where you stand at the end of the month.
        </p>
      </div>
    </div>
  );
};

export default HomePage;
