import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../../utils/utils';

function UpdateCloth() {

  const { id } = useParams();
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("") // ✅ New category field
  const [image, setImage] = useState("")
  const [imagePreview, setImagePreview] = useState("")
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClothData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/cloth/${id}`, {
          withCredentials: true,
        })
        console.log(data)
        setTitle(data.cloth.title)
        setDescription(data.cloth.description)
        setPrice(data.cloth.price)
        setCategory(data.cloth.category) // ✅ Set category
        setImagePreview(data.cloth.image.url)
        setLoading(false)
      } catch (error) {
        console.log(error)
        toast.error("Failed to fetch cloth data");
        setLoading(false)
      }
    }
    fetchClothData();
  }, [id])

  const changePhotoHandler = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      setImagePreview(reader.result)
      setImage(file)
    }
  }

  const handleUpdateCloth = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title)
    formData.append("description", description)
    formData.append("price", price)
    formData.append("category", category) // ✅ Append category
    if (image) {
      formData.append("image", image);
    }

    const admin = JSON.parse(localStorage.getItem("admin"))
    const token = admin?.token;
    if (!token) {
      navigate("/admin/login")
      return;
    }

    try {
      const response = await axios.put(`${BACKEND_URL}/cloth/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        withCredentials: true
      })
      console.log(response.data)
      toast.success(response.data.message || "Cloth updated successfully")
      navigate("/admin/our-cloths")
      setTitle("")
      setPrice("")
      setDescription("")
      setCategory("")
      setImage("")
      setImagePreview("")
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.errors || error.response?.data?.message || "Error updating cloth")
    }
  }

  return (
    <div>
      <div className="min-h-screen py-10">
        <div className="max-w-4xl mx-auto p-6 border rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Update Cloth</h3>
          <form onSubmit={handleUpdateCloth} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg">Title</label>
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
              <label className="block text-lg">Price</label>
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
              <input
                type="text"
                placeholder="e.g. Men, Women, Kids"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-lg">Cloth Image</label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Cloth"
                  className="w-full max-w-sm h-auto rounded-md object-cover"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="w-full px-3 py-2 border border-gray-400 rounded-md outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 cursor-pointer"
            >
              Update Cloth
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UpdateCloth;
