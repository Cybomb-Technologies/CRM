import React from "react";
import { Helmet } from "react-helmet";
import { CallsPageContent } from "@/components/files/activities/calls/CallsPageContent";

export default function CallsPage() {
  return (
    <>
      <Helmet>
        <title>Calls - CloudCRM</title>
      </Helmet>
      <CallsPageContent />
    </>
  );
}
