import { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

import { categories } from "../utils/data";
import { client } from "../client";
import Spinner from "./Spinner";

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [destination, setDestination] = useState("");
  const [fields, setFields] = useState(null);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [isWrongImageType, setIsWrongImageType] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const selectedFile = e.target.files[0];
    const imageTypes = [
      "image/png",
      "image/svg",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/tiff",
    ];

    if (imageTypes.includes(selectedFile.type)) {
      setIsWrongImageType(false);
      setIsLoading(true);
      client.assets
        .upload("image", selectedFile, {
          contentType: selectedFile.type,
          filename: selectedFile.name,
        })
        .then((document) => setImageAsset(document))
        .catch((err) => console.log("image upload error", err))
        .finally(() => setIsLoading(false));
    } else {
      setIsWrongImageType(true);
      setIsLoading(false);
    }
  };

  const savePin = (e) => {
    e.preventDefault();

    if (title && about && imageAsset._id && category) {
      const doc = {
        _type: "pin",
        title,
        about,
        ...(destination && { destination }),
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
        category,
      };

      client
        .create(doc)
        .then(() => navigate("/"))
        .catch((err) => console.log(err));

      setTitle("");
      setAbout("");
      setDestination("");
      setImageAsset(null);
      setCategory(null);
    } else {
      setFields(true);
      setTimeout(() => setFields(false), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {fields && (
        <p className="text-red-500 mb-5 text-xl transition-all duration-150 ease-in ">
          Please add all fields.
        </p>
      )}

      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">
        <section className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex flex-col items-center justify-center border-2 border-dotted border-gray-300 p-3 w-full h-420">
            {isLoading && <Spinner />}
            {isWrongImageType && <p>It&apos;s wrong file type</p>}
            {!imageAsset ? (
              <label>
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="flex flex-col items-center justify-center">
                    <p className="font-bold text-2xl">
                      <AiOutlineCloudUpload />
                    </p>
                    <p className="text-lg">Click to upload</p>
                  </div>

                  <p className="mt-32 text-gray-400">
                    Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or
                    TIFF less than 20MB
                  </p>
                </div>
                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <article className="relative h-full">
                <img
                  src={imageAsset?.url}
                  alt="uploaded-pic"
                  className="h-full w-full"
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
                  onClick={() => setImageAsset(null)}
                >
                  <MdDelete />
                </button>
              </article>
            )}
          </div>
        </section>

        <form
          className="flex flex-col flex-1 gap-6 lg:pl-5 mt-5 w-full"
          onSubmit={savePin}
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add your title"
            className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
            required
          />

          {user && (
            <article className="flex gap-2 mt-2 mb-2 items-center bg-white rounded-lg">
              <img
                src={user.image}
                alt="user-profile"
                className="w-10 h-10 rounded-full"
              />
              <p className="font-bold">{user.username}</p>
            </article>
          )}

          <input
            type="text"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="Tell everyone what your Pin is about"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
            required
          />

          {/* <input
            type="url"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Add a destination link"
            className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
          /> */}

          <section className="flex flex-col">
            <article>
              <p className="mb-2 font-semibold text:lg sm:text-xl">
                Choose Pin Category
              </p>
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
              >
                <option value="others" className="sm:text-bg bg-white ">
                  Select Category
                </option>
                {categories.map((item) => (
                  <option
                    key={item.name}
                    value={item.name}
                    className="text-base border-0 outline-none capitalize bg-white text-black"
                  >
                    {item.name}
                  </option>
                ))}
              </select>
            </article>

            <div className="flex justify-end items-end mt-5">
              <button
                type="submit"
                className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
              >
                Save Pin
              </button>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
};

export default CreatePin;
