"use client";

import React from "react";
import CustomerPortalPage from "@/app/customer-portal/[id]/page";

export default function DemoCustomerPortal({ params }: { params: { id: string } }) {
  return <CustomerPortalPage params={params} />;
}
