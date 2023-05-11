import React, { useState } from "react";
import { AiOutlineDownload, AiOutlineUser } from "react-icons/ai";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { FaHandshake } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { BiDonateHeart } from "react-icons/bi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";
import Image from "next/image";
import AdoptersTable from "~/components/adoptersTable";
import DonorsTable from "~/components/DonorsTable";
import PetsTable from "~/components/PetsTable";

const data = [
  {
    title: "Total Revenue",
    icon: <FiDollarSign className="h-6 w-6" />,
    cardValue: "$ 102,000",
  },
  {
    title: "Adopters",
    icon: <AiOutlineUser className="h-6 w-6" />,
    cardValue: 22,
  },
  {
    title: "Donors",
    icon: <BiDonateHeart className="h-6 w-6" />,
    cardValue: 9,
  },
  {
    title: "Successful Matches",
    icon: <FaHandshake className="h-6 w-6" />,
    cardValue: 13,
  },
];

const chartData = [
  { month: "June", revenue: 800 },
  { month: "July", revenue: 1100 },
  { month: "August", revenue: 950 },
  { month: "September", revenue: 850 },
  { month: "October", revenue: 1300 },
  { month: "November", revenue: 700 },
  { month: "December", revenue: 1150 },
  { month: "January", revenue: 500 },
  { month: "February", revenue: 1000 },
  { month: "March", revenue: 750 },
  { month: "April", revenue: 900 },
  { month: "May", revenue: 1200 },
];

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month">
          <Label value="Months" offset={0} position="bottom" />
        </XAxis>
        <YAxis>
          <Label value="Revenue ($)" angle={-90} position="insideLeft" />
        </YAxis>
        <Tooltip />
        <Bar dataKey="revenue" fill="#60A5FA" />
      </BarChart>
    </ResponsiveContainer>
  );
};

enum ViewState {
  Overview = "Overview",
  Pets = "Pets",
  Adopters = "Adopters",
  Donors = "Donors",
}
const Tab = ({
  view,
  setView,
}: {
  view: ViewState;
  setView: React.Dispatch<React.SetStateAction<ViewState>>;
}) => {
  const [animationParent] = useAutoAnimate();
  return (
    <div className="mx-auto flex h-fit w-full max-w-xl flex-row items-center justify-center rounded-lg bg-base-200 p-1 text-xs" ref={animationParent}>
      {view === "Overview" ? (
        <button
          className="btn-sm btn w-1/4 text-xs capitalize"
          onClick={() => setView(ViewState.Overview)}
        >
          Overview
        </button>
      ) : (
        <p
          className="flex w-1/4 cursor-pointer items-center justify-center"
          onClick={() => setView(ViewState.Overview)}
        >
          Overview
        </p>
      )}

      {view === "Pets" ? (
        <button
          className="btn-sm btn w-1/4 text-xs capitalize"
          onClick={() => setView(ViewState.Pets)}
        >
        Pets
        </button>
      ) : (
        <p
          className="flex w-1/4 cursor-pointer items-center justify-center"
          onClick={() => setView(ViewState.Pets)}
        >
          Pets
        </p>
      )}

      {view === "Adopters" ? (
        <button
          className="btn-sm btn w-1/4 text-xs capitalize"
          onClick={() => setView(ViewState.Adopters)}
        >
          Adopters
        </button>
      ) : (
        <p
          className="flex w-1/4 cursor-pointer items-center justify-center"
          onClick={() => setView(ViewState.Adopters)}
        >
          Adopters
        </p>
      )}

      {view === "Donors" ? (
        <button
          className="btn-sm btn w-1/4 text-xs capitalize"
          onClick={() => setView(ViewState.Donors)}
        >
          Donors
        </button>
      ) : (
        <p
          className="flex w-1/4 cursor-pointer items-center justify-center"
          onClick={() => setView(ViewState.Donors)}
        >
          Donors
        </p>
      )}
    </div>
  );
};

type CardProps = {
  title: string;
  icon: React.JSX.Element;
  cardValue: string | number;
};

const DashCard = ({ title, cardValue, icon }: CardProps) => {
  return (
    <div className="card mx-auto my-3 h-32 w-full max-w-xs border border-base-300 bg-base-200 bg-opacity-50 shadow-sm md:my-5">
      <div className="card-body">
        <div className="flex flex-row items-center justify-between">
          <p className="text font-semibold text-slate-500">{title}</p>
          {icon}
        </div>
        <p className="text-xl font-bold">{cardValue}</p>
      </div>
    </div>
  );
};
const Overview = () => {
  return (
    <>
      {" "}
      <div className="grid h-fit w-full gap-x-5 gap-y-5 md:grid-cols-2 xl:grid-cols-4 ">
        {data.map((t) => (
          <DashCard
            key={t.title}
            title={t.title}
            cardValue={t.cardValue}
            icon={t.icon}
          />
        ))}
      </div>
      <div className="mt-10 flex h-fit w-full flex-col items-center justify-between gap-3 lg:flex-row">
        <div className="card flex h-[28rem] w-full max-w-lg border border-base-200 shadow-sm">
          <div className="flex w-full flex-col gap-2 p-5 md:p-10">
            <h2 className="card-title">Recent Matches</h2>
            <p className="text-sm font-light text-slate-600">
              You have made 2 matches this month
            </p>

            <div className="my-3 flex flex-row items-center justify-between gap-4 ">
              <div className="flex flex-row items-center justify-center gap-3">
                <Image
                  src="https://randomuser.me/api/portraits/men/36.jpg"
                  alt="profile"
                  height={40}
                  width={40}
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex flex-col">
                  <p>John Doe</p>
                  <p className="text-xs font-thin">johndoe@gmail.com</p>
                </div>
              </div>

              <Image
                src="https://res.cloudinary.com/dhciks96e/image/upload/v1683297454/IMG-20220722-WA0009_hj2avg.jpg"
                alt="profile"
                height={40}
                width={40}
                className="h-8 w-8 rounded-full"
              />
            </div>
            <div className="my-2 flex flex-row items-center justify-between gap-4 ">
              <div className="flex flex-row items-center justify-center gap-3">
                <Image
                  src="https://res.cloudinary.com/dhciks96e/image/upload/v1683701494/christopher-campbell-rDEOVtE7vOs-unsplash_1_u1czux.jpg"
                  alt="profile"
                  height={40}
                  width={40}
                  className="h-8 w-8 rounded-full"
                />
                <div className="flex flex-col">
                  <p>Jane Doe</p>
                  <p className="text-xs font-thin">janedoe@gmail.com</p>
                </div>
              </div>

              <Image
                src="https://res.cloudinary.com/dhciks96e/image/upload/v1683701358/jojo_gejnfl.jpg"
                alt="profile"
                height={40}
                width={40}
                className="h-8 w-8 rounded-full"
              />
            </div>
          </div>
        </div>
        <div className="card flex h-[28rem]  w-full max-w-xl items-center  justify-center border border-base-200 px-3 shadow-sm">
          <RevenueChart data={chartData} />
        </div>
      </div>
    </>
  );
};
const Dashboard = () => {
  const [view, setView] = useState(ViewState.Overview);
  const [animationParent] = useAutoAnimate();
  return (
    <>
   
      <div className="flex h-fit min-h-screen w-full  items-center justify-center p-5 md:px-10">
        <div className="card h-full min-h-[42rem] w-full rounded-lg border border-base-200 bg-base-100 shadow-xl">
          <div className="card-body" >
            <div className="flex items-center justify-between">
              <h2 className="card-title">Dashboard</h2>
              <button className="btn-sm btn w-fit gap-2 px-3 text-xs capitalize">
                <AiOutlineDownload className="h-5 w-5" /> Download
              </button>
            </div>
            <div className="flex flex-col w-full h-full gap-2" ref={animationParent}>
            <Tab view={view} setView={setView} />
            {view==="Overview" && <Overview />}
            {view==="Adopters" && <AdoptersTable />}
            {view==="Donors" && <DonorsTable />}
            {view==="Pets" && <PetsTable />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
