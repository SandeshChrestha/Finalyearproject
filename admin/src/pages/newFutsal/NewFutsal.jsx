import "./newFutsal.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { futsalInputs } from "../../formSource";
import useFetch from "../../hooks/useFetch";
import axios from "axios";

const NewFutsal = () => {
  const [files, setFiles] = useState([]);  // ✅ Fix: Use array instead of an empty string
  const [info, setInfo] = useState({});
  const [slots, setSlots] = useState([]);
  const { data, loading, error } = useFetch("/slots");

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setSlots(value);
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      // ✅ Ensure `cheapestprice` is provided
      if (!info.cheapestprice) {
        alert("Cheapest price is required!");
        return;
      }

      // ✅ Fix: Convert FileList to array before mapping
      const list = await Promise.all(
        Array.from(files).map(async (file) => {
          const data = new FormData();
          data.append("file", file);
          data.append("upload_preset", "upload");

          const uploadRes = await axios.post(
            "https://api.cloudinary.com/v1_1/dn4go0m25/image/upload",
            data
          );

          return uploadRes.data.url;
        })
      );

      const newfutsal = {
        ...info,
        slots,
        photos: list,
        cheapestprice: info.cheapestprice, // ✅ Ensure it's included
      };

      await axios.post("/futsals", newfutsal);
      alert("Futsal added successfully!");
    } catch (err) {
      console.error("Error adding futsal:", err);
      alert("Failed to add futsal. Please check your inputs.");
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Futsal</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files.length > 0
                  ? URL.createObjectURL(files[0])
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt="Futsal"
            />
          </div>
          <div className="right">
            <form>
              {/* Image Upload */}
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(Array.from(e.target.files))}
                  style={{ display: "none" }}
                />
              </div>

              {/* Dynamic Inputs */}
              {futsalInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

              {/* Cheapest Price Input */}
              <div className="formInput">
                <label>Cheapest Price</label>
                <input
                  id="cheapestprice"
                  onChange={handleChange}
                  type="number"
                  placeholder="Enter the cheapest price"
                />
              </div>

              {/* Featured Dropdown */}
              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange}>
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>

              {/* Slot Selection */}
              <div className="selectSlots">
                <label>Slots</label>
                <select id="slots" multiple onChange={handleSelect}>
                  {loading ? (
                    "Loading..."
                  ) : (
                    data?.map((slot) => (
                      <option key={slot._id} value={slot._id}>
                        {slot.title}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewFutsal;
