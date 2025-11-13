import React, { useState } from "react";
import axios from "axios";
import img from "./skeyy.jpg";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { WiHumidity, WiStrongWind, WiThermometer, WiBarometer, WiSunrise} from "react-icons/wi";
import { FaSearch } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,} from "recharts";

const Weather = () => {
  const [data,setData]=useState("");
  const [search,setSearch]=useState("");
  const [hourlyData,setHourlyData]=useState([]);

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if (!search) return;
    const currentRes=await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=0cf3d05c6cb443424f42856d18e090b3`);
    setData(currentRes.data);

  
    const forecastRes=await axios.get( `https://api.openweathermap.org/data/2.5/forecast?q=${search}&units=metric&appid=0cf3d05c6cb443424f42856d18e090b3`);

    const hourly=forecastRes.data.list.slice(0,8).map((item) => ({
      time: new Date(item.dt * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temp: item.main.temp,
    }));
    setHourlyData(hourly);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex flex-col items-center justify-start" style={{ backgroundImage: `url(${img})` }}>
      <form onSubmit={handleSubmit} className="mt-10">
        <div className="flex flex-col items-center space-y-5 bg-black/40 backdrop-blur-md p-6 rounded-2xl shadow-lg">
          <div className="flex items-center space-x-3">
            <TiWeatherPartlySunny className="text-yellow-300 text-4xl animate-pulse" />
            <h1 className="font-extrabold text-4xl text-white tracking-wide drop-shadow-lg">WEATHER
            </h1>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm" />
            <input type="text" value={search || ""} name="search" className="pl-10 bg-white/90 w-56 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-500 shadow" placeholder="Search a city" onChange={handleChange} />
          </div>
          <button className="bg-gradient-to-r from-blue-300 to-blue-600 hover:from-blue-500 hover:to-blue-700 w-24 rounded-xl text-white font-semibold shadow-md transition-transform duration-200 hover:scale-105 w-20 h-8">Search
          </button>
        </div>
      </form>

      {data && data.main && (
        <div className="mt-10 bg-white/20 backdrop-blur-md rounded-3xl p-6 shadow-xl text-center text-white w-80 animate-fadeIn">
          <h1 className="text-2xl font-bold mb-2 drop-shadow">
            📍{data.name}
          </h1>
          <p className="text-lg mb-4">
            {data.weather && data.weather[0]?.main}
          </p>
          <div className="flex flex-col items-center space-y-3">
            <div className="flex items-center space-x-2">
              <WiThermometer className="text-red-300 text-4xl" />
              <h1 className="text-3xl font-semibold">{data.main.temp}°C</h1>
            </div>

            <div className="flex justify-center space-x-5 mt-2 flex-wrap">
              <div className="flex flex-col items-center">
                <WiHumidity className="text-cyan-300 text-3xl" />
                <p>{data.main.humidity}% humidity</p>
              </div>
              <div className="flex flex-col items-center">
                <WiStrongWind className="text-green-300 text-3xl" />
                <p>{data.wind.speed} m/s</p>
              </div>

              <div className="flex flex-col items-center">
                <WiBarometer className="text-blue-300 text-3xl" />
                <p>{data.main.pressure} hPa</p>
              </div>

              <div className="flex flex-col items-center">
                <WiSunrise className="text-yellow-300 text-3xl" />
                <p>
                  {new Date(data.sys.sunrise * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm italic"> Feels like {data.main.feels_like}°C
            </p>
          </div>
        </div>
      )}

      {hourlyData.length > 0 && (
        <div className="mt-10 bg-black/40 p-6 rounded-2xl w-[90%] max-w-3xl text-white mb-10 shadow-lg">
          <h3 className="text-center text-xl font-bold mb-6 tracking-wide"> 🌡️ Temperature vs Time (Next Hours)
          </h3>
          <ResponsiveContainer width="100%" height={300}> <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis dataKey="time" stroke="#fff" />
              <YAxis stroke="#fff" unit="°C" />
              <Tooltip contentStyle={{ backgroundColor: "#1e293b", border: "none" }}labelStyle={{ color: "#fff" }} />
              <Line type="monotone"dataKey="temp"stroke="#facc15"strokeWidth={3}dot={{ r: 5, fill: "#facc15" }}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default Weather;

