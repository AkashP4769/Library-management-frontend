import { useState } from "react";
import bgImage from "../assets/Image.jpg";
import InputText from "@/components/LoginInput";
import { FaEye, FaLock, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Footer from "@/components/Footer";
import { useSignupMutation } from "@/api-service/login/login.api";

export default function SignupPage() {

  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [signup] = useSignupMutation();

  async function handleSignup() {
    // Handle signup logic here
    console.log("Signup clicked with:", { name, email, password });
    if(email.length == 0 || password.length == 0) alert("Please enter valid email and password")

    const payload = {
      name: name,
      email: email,
      password: password,
      role: "employee"
    };

    const response = await signup(payload).unwrap();

    console.log("Signup response:", response);

    const access_token = response.access_token
    const refresh_token = response.refresh_token

    if(access_token && refresh_token){
        console.log("access_token & refresh token", access_token && refresh_token)
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
        navigate("/", {replace: true})
    }
  }

  const navigate = useNavigate();
  return (
    <div className="v-screen h-screen">
      <div className="flex flex-row h-[100vh] w-full">
        <div className="relative w-1/2 h-full">
          <img src={bgImage} className="h-[100vh] w-full object-cover" />

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8">
            <div className="items-left">
              <h2 className="text-3xl text-[#FFE086] font-bold leading-normal">
                Lumina Library
              </h2>
              <p className="text-xl mt-10 text-white">
                The future of scholarly management. Join thousands of librarians
                in a <br /> streamlined ecosystem designed for precision, order,
                and aesthetic <br /> clarity.
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[448px] flex flex-col gap-[26px]">
            <div>
              <h1 className="text-2xl font-bold"> Create your account </h1>
              <p className="text-xs">
                Enter your professional details to get started
              </p>
            </div>

            <div>
              <InputText
                label="Full Name"
                placeholder="Librarian Name"
                type="text"
                name="fname"
                value={name}
                onChange={(e) => setName(e.target.value)}
                leftIcon={<FaUser />}
              />
            </div>
            <div>
              <InputText
                label="EMAIL ADDRESS"
                placeholder="librarian@keyvalue.in"
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<FaEnvelope />}
              />
            </div>
            <div>
              <InputText
                label="PASSWORD"
                placeholder="password"
                type={showPassword ? "text" : "password"}
                name="pwd"
                leftIcon={<FaLock />}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                rightIcon={showPassword ? <FaEyeSlash /> : <FaEye />}
                onRightIconClick={() => { setShowPassword(!showPassword); return {}; }}
              />
            </div>
            <button
              type="submit"
              className="w-full h-[50px] bg-amber-300 text-[#141b2b] rounded font-semibold"
              onClick={() => handleSignup()}
            >
              Create Account{" "}
            </button>
            <p className="text-sm text-center">
              Already have an account? <Link to="/login" className="text-blue-500">Go to login page</Link>
            </p>
          </div>
        </div>
      </div>
      <div>
       
      </div>
    </div>
  );
}
