import React, { useRef, useState } from "react";
import Header from "./Header";
import { checkValidateData } from "../utils/validate";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();

  const name = useRef(null);
  const email = useRef(null);
  const password = useRef(null);

  const handleFormValidation = () => {
    const message = checkValidateData(
      email.current.value,
      password.current.value
    );
    setErrorMessage(message);
    if (message) return;

    if (!isSignInForm) {
      createUserWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          updateProfile(user, {
            displayName: name.current.value,
          })
            .then(() => {
              console.log(user);
              navigate("/browse");
            })
            .catch((error) => {
              setErrorMessage(error.Message);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setIsSignInForm(errorCode + "-" + errorMessage);
        });
    } else {
      signInWithEmailAndPassword(
        auth,
        email.current.value,
        password.current.value
      )
        .then((userCredential) => {
          const user = userCredential.user;
          console.log(user);
          navigate("/browse");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          setErrorMessage(errorCode + "-" + errorMessage);
        });
    }
  };

  const toggleSignIn = () => {
    setIsSignInForm(!isSignInForm);
  };

  return (
    <div>
      <Header />
      <div className="absolute">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/a99688ca-33c3-4099-9baa-07a2e2acb398/ca15fd28-b624-4852-8bfe-9cdd5c88475d/IN-en-20240520-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt="bg-netflix"
        ></img>
      </div>

      <div>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="w-3/12 absolute bg-black p-12 my-36 mx-auto left-0 right-0 text-white bg-opacity-80 rounded-lg"
        >
          <h1 className="text-3xl font-bold py-4">
            {isSignInForm ? "Sign In" : "Sign Up"}
          </h1>
          {!isSignInForm && (
            <input
              ref={name}
              type="text"
              placeholder="Full Name"
              className="p-2 my-4 w-full bg-zinc-700 rounded-lg"
            ></input>
          )}
          <input
            ref={email}
            type="text"
            placeholder="Email"
            className="p-2 my-4 w-full bg-zinc-700 rounded-lg"
          ></input>

          <input
            ref={password}
            type="password"
            placeholder="Password"
            className="p-2 my-4 w-full bg-zinc-700 rounded-lg"
          ></input>
          <p className="text-red-500 font-bold text-lg py-2">{errorMessage}</p>
          <button
            className="p-4 my-6 bg-red-700 w-full rounded-lg"
            onClick={handleFormValidation}
          >
            {isSignInForm ? "Sign In" : "Sign Up"}
          </button>
          <p className="py-6 cursor-pointer" onClick={toggleSignIn}>
            {isSignInForm
              ? "New to Netfilx? Sign Up now"
              : "Already Registered? Sign In Now"}
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
