import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BACKEND_URL } from '../../utils/utils';

function CreateCloth() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState(""); // ✅ new state
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCloth = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category); // ✅ append category
    formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin?.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `${BACKEND_URL}/cloth/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      console.log(response.data);
      toast.success(response.data.message || "Item Created Successfully");
      navigate("/admin/our-cloths");

      // Reset form
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory(""); // ✅ clear category
      setImage("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.errors ||
        error?.response?.data?.message ||
        "Error while creating item"
      );
    }
  };

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-8">Add New Cloth</h3>

        <form onSubmit={handleCreateCloth} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-lg">Cloth Title</label>
            <input
              type="text"
              placeholder="Enter cloth title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Description</label>
            <input
              type="text"
              placeholder="Enter cloth description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Price (₹)</label>
            <input
              type="number"
              placeholder="Enter cloth price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            >
              <option value="">Select Category</option>
              <option value="men">men</option>
              <option value="women">women</option>
              <option value="kids">kids</option>
              <option value="trending">treding</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-lg">Cloth Image</label>
            <div className="flex items-center justify-center">
              <img
                src={imagePreview ? imagePreview : "/imgPL.webp"}
                alt="Cloth Preview"
                className="w-full max-w-sm h-auto rounded-md object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={changePhotoHandler}
              className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 cursor-pointer"
          >
            Add Cloth
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateCloth;
