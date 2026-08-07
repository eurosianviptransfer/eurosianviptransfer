"use client";

import React from "react";

type Props = {
  id: string;
  label: string;
  type?: "text" | "select" | "textarea" | "number";
  placeholder?: string;
  options?: { value: string; label: string }[];
};

export default function FormField({ id, label, type = "text", placeholder, options }: Props) {
  return (
    <div className="ev-field">
      <label htmlFor={id} className="ev-label">{label}</label>
      {type === "textarea" ? (
        <textarea id={id} className="ev-input" placeholder={placeholder}></textarea>
      ) : type === "select" ? (
        <select id={id} className="ev-select">
          {options?.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      ) : (
        <input id={id} className="ev-input" type={type} placeholder={placeholder} />
      )}
    </div>
  );
}
