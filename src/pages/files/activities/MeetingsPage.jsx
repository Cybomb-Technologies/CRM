import React from "react";
import { Helmet } from "react-helmet";
import { MeetingsPageContent } from "@/components/files/activities/meetings/MeetingsPageContent";

export default function MeetingsPage() {
  return (
    <>
      <Helmet>
        <title>Meetings - CloudCRM</title>
      </Helmet>
      <MeetingsPageContent />
    </>
  );
}
