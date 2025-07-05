import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND_URL } from '../../utils/utils';

function OurCloths() {
  const [cloths, setCloths] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    if (!token) {
      toast.error("Please login as admin");
      navigate("/admin/login");
      return;
    }

    const fetchCloths = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/cloth/cloths`, {
          withCredentials: true,
        });
        setCloths(response.data.cloths);
      } catch (error) {
        toast.error("Failed to fetch cloths");
        console.error("Error in fetchCloths: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCloths();
  }, [navigate]);

  const handleDeleteCloth = async (id) => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;

    try {
      const response = await axios.delete(
        `${BACKEND_URL}/cloth/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCloths = cloths.filter((cloth) => cloth._id !== id);
      setCloths(updatedCloths);
    } catch (error) {
      console.log("Error in deleting cloth", error);
      toast.error(error.response?.data?.message || "Error in deleting cloth");
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <div className="bg-gray-100 p-8 space-y-4">
      <h1 className="text-3xl font-bold text-center mb-8">All Cloth Items</h1>
      <Link
        className="bg-orange-400 py-2 px-4 rounded-lg text-white hover:bg-orange-950 duration-300"
        to={"/admin/dashboard"}
      >
        Go to dashboard
      </Link>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
        {cloths.map((cloth) => (
          <div key={cloth._id} className="bg-white shadow-md rounded-lg p-4 w-90">
            <img
              src={cloth?.image?.url}
              alt={cloth.title}
              className="object-cover w-90 rounded-t-lg"
            />
            <h2 className="text-xl font-semibold mt-4 text-gray-800">
              {cloth.title}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
              {cloth.description.length > 200
                ? `${cloth.description.slice(0, 200)}...`
                : cloth.description}
            </p>
            <div className="flex justify-between mt-4 text-gray-800 font-bold">
              <div>
                ${cloth.price}{" "}
                <span className="line-through text-gray-500">$999</span>
              </div>
              <div className="text-green-600 text-sm mt-2">Special Offer</div>
            </div>
            <div className="flex justify-between">
              <Link
                to={`/admin/update-cloth/${cloth._id}`}
                className="bg-orange-500 text-white py-2 px-4 mt-4 rounded hover:bg-blue-600 cursor-pointer"
              >
                Update
              </Link>
              <button
                onClick={() => handleDeleteCloth(cloth._id)}
                className="bg-red-500 text-white py-2 px-4 mt-4 rounded hover:bg-red-600 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OurCloths;
