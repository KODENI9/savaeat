// app/components/VendorMapWrapper.tsx
"use client";

import dynamic from "next/dynamic";

const VendorMap = dynamic(() => import("./VendorMap"), { ssr: false });

export default VendorMap;
