// "use client";

// type CustomInputProps = {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder: string;
//   type?: string;
//   name?: string;
// };

// export default function CustomInput({
//   value,
//   onChange,
//   placeholder,
//   type,
//   name
// }: CustomInputProps) {
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     onChange(e.target.value); // Pass input value to parent
//   };

//   return (
//     <div className="relative z-50 left-1/2 top-5 transform -translate-x-1/2 max-w-lg w-full px-5 mt-5">
//       <div className="max-w-lg w-full rounded-[30px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-3 px-3 flex items-center justify-between transition-all duration-300 ease-in-out">
//         {/* Input field */}
//         <input
//           type={type ? type : "text"}
//           name={name ? name : "text"}
//           value={value}
//           onChange={handleChange}
//           required
//           placeholder={placeholder}
//           className="w-full bg-transparent text-base text-dark px-4 py-1.5 outline-none placeholder-neutral-500"
//         />
//       </div>
//     </div>
//   );
// }
"use client";

type CustomInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  name?: string;
};

export default function CustomInput({
  value,
  onChange,
  placeholder,
  type,
  name
}: CustomInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); // Pass input value to parent
  };

  return (
    <div className="relative z-50 left-1/2 top-5 transform -translate-x-1/2 max-w-xl w-full px-5 mt-5">
      <div className="max-w-xl w-full rounded-[40px] border-[0.6px] shadow-sm bg-white bg-opacity-90 backdrop-blur-lg border-neutral-300 py-4 px-3 flex items-center justify-between transition-all duration-300 ease-in-out">
        {/* Input field */}
        <input
          type={type ? type : "text"}
          name={name ? name : "text"}
          value={value}
          onChange={handleChange}
          required
          placeholder={placeholder}
          className="w-full bg-transparent text-2xl text-dark font-semibold px-4 py-1.5 outline-none placeholder-neutral-500 placeholder:text-2xl"
        />
      </div>
    </div>
  );
}
