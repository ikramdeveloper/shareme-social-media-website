import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";
import { signInWithGoogle } from "../firebase";
import { client } from "../client";

const Login = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    signInWithGoogle()
      .then((result) => {
        const { displayName, email, photoURL, uid, stsTokenManager } =
          result.user;
        localStorage.setItem(
          "user",
          JSON.stringify({ displayName, email, photoURL, uid, stsTokenManager })
        );
        const doc = {
          _id: uid,
          _type: "user",
          username: displayName,
          image: photoURL,
        };

        client
          .createIfNotExists(doc)
          .then(() => navigate("/", { replace: true }))
          .catch((err) => console.log("there is an error creating doc: ", err));
      })

      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
      </div>

      <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
        <figure className="p-5">
          <img src={logo} alt="logo" width="130px" />
        </figure>
        <div className="shadow-2xl">
          <button
            type="button"
            className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none"
            onClick={handleSignIn}
          >
            <FcGoogle className="mr-4" /> Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
