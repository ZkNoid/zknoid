
import { ReactNode } from "react";

export default function AsyncLayout({ children }: { children: ReactNode }) {

  return (
    <div className={"flex flex-col min-h-screen"}>
      {children}
      {/* <Toaster /> */}
    </div>
  );
}
