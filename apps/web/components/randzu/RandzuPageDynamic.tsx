import dynamic from "next/dynamic";

export default dynamic(() => import("./RandzuPage"), {
  ssr: false,
});
