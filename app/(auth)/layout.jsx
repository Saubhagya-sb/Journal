// app/sign-in/[[...sign-in]]/layout.tsx
import React from "react";

export default function AuthLayout({children,}) {
  return (
    <div className="flex justify-center pt-20">
      {children}
    </div>
  );
}
