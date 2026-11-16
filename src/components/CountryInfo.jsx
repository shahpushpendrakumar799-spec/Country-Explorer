import { useState } from "react";
import {
  FaGlobeAsia,
  FaSearch,
  FaMapMarkerAlt,
  FaGlobe,
  FaUsers,
  FaCoins,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Axios from "axios";

function CountryInfo() {
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [countryData, setCountryData] = useState(null);

  const fetchCountryDetails = async () => {
    try {
      if (country.trim() === "") {
        setErrors("Please Enter Country Name");
        setCountryData(null);
        return;
      }

      setLoading(true);
      setErrors("");

      const apikey = import.meta.env.VITE_API_KEY;
      const baseUrl = import.meta.env.VITE_BASE_URL;

      const res = await Axios.get(`${baseUrl}/names.common?q=${country}`, {
        headers: {
          Authorization: `Bearer ${apikey}`,
        },
      });

      let countriesInfo = res.data.data.objects;
      console.log(countriesInfo);

      if (!countriesInfo || countriesInfo.length === 0) {
        setErrors("Country Not Found");
        setCountryData(null);
        return;
      }

      const result =
        countriesInfo.find(
          (c) => c.names.common.toLowerCase() === country.toLowerCase(),
        ) || countriesInfo[0];

      setCountryData(result);
    } catch (error) {
      setErrors("Something Went Wrong");
      setCountryData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEnterBtn = (e) => {
    if (e.key === "Enter") {
      fetchCountryDetails();
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-sky-100 to-indigo-200 flex justify-center items-center p-5">
      <div className="w-full max-w-2xl bg-white/80 rounded-3xl shadow-2xl border border-white p-8">
        <h1 className="text-4xl font-bold text-center text-sky-700 mb-8 flex items-center justify-center gap-3">
          <FaGlobeAsia className="text-sky-600" size={35} /> Country Explorer
        </h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search Country..."
              className="w-full border-2 border-sky-300 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-sky-600 transition-all duration-300 font-medium"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              onKeyDown={handleEnterBtn}
            />
          </div>

          <button
            onClick={fetchCountryDetails}
            className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-3 rounded-xl font-semibold transition duration-300 text-xl disabled: opacity-60"
            disabled={loading}
          >
            {loading ? (
              <AiOutlineLoading3Quarters className="animate-spin" />
            ) : (
              "Search"
            )}
          </button>
        </div>

        {errors && (
          <div className="mt-6 bg-red-100 border border-red-300 rounded-3xl p-4 text-center text-red-700 font-semibold">
            {errors}
          </div>
        )}

        {loading && (
          <div className="text-center mt-8">
            <AiOutlineLoading3Quarters className="animate-spin text-sky-600 mx-auto" />
            <p className="mt-3 text-sky-700 font-semibold animate-pulse">
              Fetching Country Details...
            </p>
          </div>
        )}

        {countryData && (
          <div className="mt-10 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 hover:shadow-2xl transition duration-300">
            <img
              src={countryData.flag.url_png}
              alt="Image Loading"
              className="w-full h-72 object-cover"
            />

            <div className="p-8">
              <h2 className="text-4xl font-bold text-center text-sky-700">
                {countryData.names.common}
              </h2>
              <p className="text-center text-gray-500 mt-2">
                Explore Country Information
              </p>
              <div className="grid md:grid-cols-2 gap-5 mt-8">
                <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-2xl shadow-sm">
                  <FaMapMarkerAlt className="text-red-500" size={30} />
                  <div>
                    <p className="text-gray-500 text-sm">Capital</p>
                    <h3 className="font-bold text-lg">
                      {countryData.capitals[0].name}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-2xl shadow-sm">
                  <FaGlobe className="text-blue-500" size={30} />
                  <div>
                    <p className="text-gray-500 text-sm">Region</p>
                    <h3 className="font-bold text-lg">{countryData.region}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-2xl shadow-sm">
                  <FaUsers className="text-green-500" size={30} />
                  <div>
                    <p className="text-gray-500 text-sm">Population</p>
                    <h3 className="font-bold text-lg">
                      {countryData.population.toLocaleString()}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-sky-50 p-4 rounded-2xl shadow-sm">
                  <FaCoins className="text-yellow-500" size={30} />
                  <div>
                    <p className="text-gray-500 text-sm">Currency</p>
                    <h3 className="font-bold text-md">
                      {countryData.currencies[0].symbol} (
                      {countryData.currencies[0].name})
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CountryInfo;
