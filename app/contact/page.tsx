"use client";
import { Input } from "@progress/kendo-react-inputs";
import { add } from "../actions/messages";
import { Button } from "@progress/kendo-react-buttons";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      Please feel free to leave feedback or ask questions. I will get back to
      you as soon as possible.
      <form action={add}>
        <Input label="Name" name="name" />
        <Input label="Email" name="email" type="email" />
        <Input label="Message" name="message" />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
