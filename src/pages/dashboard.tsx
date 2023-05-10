import React, { useState } from "react";
import { AiOutlineDownload, AiOutlineUser } from "react-icons/ai";
import { FaHandshake } from "react-icons/fa";
import { FiDollarSign } from "react-icons/fi";
import { BiDonateHeart } from "react-icons/bi";
import { Nav } from "~/components/Nav";

const data = [
  {
    title: "Total Revenue",
    icon: <FiDollarSign className="h-6 w-6" />,
    cardValue: "$ 12,000",
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
  { month: "January", revenue: 500 },
  { month: "February", revenue: 1000 },
  { month: "March", revenue: 750 },
  { month: "April", revenue: 900 },
  { month: "May", revenue: 1200 },
];

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
        <Tooltip
        
        />
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
  return (
    <div className="mx-auto flex h-fit w-full max-w-xl flex-row items-center justify-center rounded-lg bg-base-200 p-1 text-xs">
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
          Order Files
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
    <div className="bg-base-200 card mx-auto my-3 h-32 w-full max-w-xs border border-base-300 shadow-sm md:my-5">
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
const Dashboard = () => {
  const [view, setView] = useState(ViewState.Overview);
  return (
    <>
      <Nav />
      <div className="flex h-fit min-h-screen w-full items-center justify-center p-5 md:px-10">
        <div className="card h-full w-full rounded-lg border border-base-200 bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <h2 className="card-title">Dashboard</h2>
              <button className="btn-sm btn w-fit gap-2 px-3 text-xs capitalize">
                <AiOutlineDownload className="h-5 w-5" /> Download
              </button>
            </div>
            <Tab view={view} setView={setView} />
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
            <div className="mt-10 flex h-fit w-full flex-col items-center justify-between gap-3 md:flex-row">
              <div className="card flex h-[28rem] w-full max-w-lg border border-base-200 shadow-sm">
                <div className="w-full p-5 md:p-10 flex flex-col gap-2">
                  <h2 className="card-title">Recent Matches</h2>
                  <p className="text-sm font-light text-slate-600">
                    You have made 2 matches this month
                  </p>
                  
                  <div className="items-center my-3 flex flex-row justify-between gap-4 ">
                  <div className="flex flex-row gap-3 justify-center items-center">
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
                  <div className="items-center my-2 flex flex-row justify-between gap-4 ">
                  <div className="flex flex-row gap-3 justify-center items-center">
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
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
