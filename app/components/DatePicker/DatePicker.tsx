import React, { useState } from "react";
import DatePicker from "react-datepicker";

interface DatePickerProps {
  selectedDate: Date | null;
  onChange: (date: Date | null) => void;
  className?: string;
  placeholderText?: string;
}

const CustomDatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange, className, placeholderText }) => {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      dateFormat="yyyy/MM/dd"
      placeholderText={placeholderText || "Review date"}
      className={"px-4 py-2 rounded-[26px] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 " + className}
      calendarClassName="bg-white border-none shadow-lg rounded-[26px]"
      dayClassName={() =>
        "cursor-pointer hover:bg-blue-100 focus:bg-blue-200 rounded-md"
      }
      wrapperClassName="w-full"
    />
  );
};

export default CustomDatePicker;
