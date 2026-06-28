import { useState } from "react";
import bgImage from "../assets/Image.png";
import InputText from "@/components/LoginInput";
import { FaEye, FaLock, FaEyeSlash, FaEnvelope, FaUser } from "react-icons/fa";
import { Link, useNavigate } from "react-router";
import Footer from "@/components/Footer";

export default function SignupPage() {
  const [password, showPassword] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="v-screen h-screen">
      <div className="flex flex-row h-[96vh] w-full">
        <div className="relative w-1/2 h-full">
          <img src={bgImage} className="h-[96vh] w-full object-cover" />

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
                leftIcon={<FaUser />}
              />
            </div>
            <div>
              <InputText
                label="EMAIL ADDRESS"
                placeholder="librarian@keyvalue.in"
                type="email"
                name="email"
                leftIcon={<FaEnvelope />}
              />
            </div>
            <div>
              <InputText
                label="PASSWORD"
                placeholder="password"
                type={password ? "text" : "password"}
                name="pwd"
                leftIcon={<FaLock />}
                rightIcon={password ? <FaEyeSlash /> : <FaEye />}
                onRightIconClick={() => { showPassword(!password); return {}; }}
              />
            </div>
            <button
              type="submit"
              className="w-full h-[50px] bg-amber-300 text-[#141b2b] rounded font-semibold"
              onClick={() => navigate("/login")}
            >
              Create Account{" "}
            </button>
            <p className="text-sm text-center">
              Already have an account? <Link to="/login">Go to login page</Link>
            </p>
          </div>
        </div>
      </div>
      <div>
        <Footer />
      </div>
    </div>
  );
}
