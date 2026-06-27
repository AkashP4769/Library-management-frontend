import InputText from "@components/LoginInput";
import bg_image from "../assets/Hero_Image.png";
import "tailwindcss";
export default function LoginPage() {
  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="w-1/2 h-full">
        <img src={bg_image} className="w-full h-[100vh]" />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="w-[448px] flex flex-col gap-[26px]">
          <div>
            <h1 className="text-2xl font-bold"> Welcome back </h1>
            <p className="text-xs">
              Please enter your credentials to access your library dashboard
            </p>
          </div>
          <div>
            <InputText
              label="EMAIL ADDRESS"
              placeholder="librarian@keyvalue.in"
              type="email"
              name="email"
            />
          </div>
          <div>
            <InputText
              label="PASSWORD"
              placeholder="password"
              type="password"
              name="pwd"
            />
          </div>
          <button
            type="submit"
            className="w-full h-[50px] bg-amber-300 text-[#141b2b] rounded font-semibold"
          >
            Sign In -{">"}
          </button>
        </div>
      </div>
    </div>
  );
}
