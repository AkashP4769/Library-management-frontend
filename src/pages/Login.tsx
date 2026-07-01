import InputText from "@components/LoginInput";
import bg_image from "../assets/Hero Image.png";
import logo from "../assets/Icon.png";
import { FaEye, FaLock, FaEyeSlash, FaEnvelope } from "react-icons/fa";
import "tailwindcss";
import { useState } from "react";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router";
import { useLoginMutation } from "@/api-service/login/login.api";
  
export default function LoginPage() {

  const [role, setRole] = useState("Employee");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login] = useLoginMutation();
  const navigate = useNavigate();

  const handleLogin = async () => {
    if(email.length == 0 || password.length == 0) {
      alert("Please enter valid email and password");
      return;
    }

    const payload = {
      email: email,
      password: password
    };

    try {
      const response = await login(payload).unwrap();
      console.log("Login response:", response);

      const access_token = response.access_token;
      const refresh_token = response.refresh_token;
      const userName =
        response?.user?.name ||
        response?.user?.username ||
        response?.name ||
        response?.username ||
        (payload.email ? payload.email.split("@")[0] : "User");

      if(access_token && refresh_token){
          console.log("access_token & refresh token", access_token && refresh_token);
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
          localStorage.setItem("username", userName);
          localStorage.setItem("email", payload.email);
          navigate("/", {replace: true});
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };
  
  return (
    <div className="w-screen h-screen">
      <div className="flex flex-row">
        <div className="relative w-1/2 h-full">
          <img src={bg_image} className="h-[96vh] w-full object-cover" />

          {/* Top left text */}
          <div className="absolute top-14 left-10 flex items-center gap-2 text-white">
            <span>
              <img src={logo} />
            </span>
            <span className="font-bold text-3xl">Lumina Library</span>
          </div>

          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-8">
            <div className="items-left">
              <h2 className="text-2xl text-amber-300 font-bold leading-normal text-left">
                Preserving Knowledge, Empowering <br /> Discovery.
              </h2>
              <p className="text-lg mt-7 text-white/80 text-left">
                Welcome back to the world's most advanced library <br />{" "}
                management ecosystem. Sign in to manage your collection <br />{" "}
                with scholarly precision.
              </p>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex items-center justify-center">
          <div className="w-[448px] flex flex-col gap-[26px]">
            <div>
              <h1 className="text-2xl font-bold"> Welcome back </h1>
              <p className="text-xs">
                Please enter your credentials to access your library dashboard
              </p>
            </div>
            <div className="flex w-full bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setRole("Employee")}
                className={`flex-1 py-2 h-[40px] rounded-md text-sm font-semibold transition-all ${
                  role === "Employee"
                    ? "bg-secondary shadow text-[white]"
                    : "text-gray-400"
                }`}
              >
                Employee
              </button>
              <button
                onClick={() => setRole("Admin")}
                className={`flex-1 py-2 h-[40px] rounded-md text-sm font-semibold transition-all ${
                  role === "Admin"
                    ? "bg-secondary shadow text-[white]"
                    : "text-gray-400"
                }`}
              >
                Admin
              </button>
            </div>
            <div>
              <InputText
                label="EMAIL ADDRESS"
                placeholder="employee@keyvalue.in"
                type="email"
                name="email"
                leftIcon={<FaEnvelope />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              onClick={() => handleLogin()}
            >
              Log In as {role === "Admin" ? "Admin" : "Employee"} -{">"}
            </button>
            <p className="text-sm text-center">
              New Librarian? <Link to="/signup" className="text-blue-500">Create your account</Link>
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
