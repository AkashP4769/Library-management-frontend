export default function SignupPage() {
  const [role, setRole] = useState("");
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
          <div className="flex w-full bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setRole("employee")}
              className={`flex-1 py-2 h-[24px] rounded-md text-sm font-semibold transition-all ${
                role === "employee"
                  ? "bg-secondary shadow text-[white]"
                  : "text-white-400"
              }`}
            >
              Employee
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`flex-1 py-2 h-[24px] rounded-md text-sm font-semibold transition-all ${
                role === "admin"
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
            Sign In as {role === "admin" ? "Admin" : "Employee"} -{">"}
          </button>
        </div>
      </div>
    </div>
  );
}
