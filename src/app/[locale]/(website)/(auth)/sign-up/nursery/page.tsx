import { Metadata } from "next";
import SignUpWrapper from "./_components/SignUpWrapper";

export const metadata: Metadata = {
    title: "Nursery Sign Up",
    description: "Register your nursery with First Step",
};

export default function NurserySignUpPage() {
    return (
        <>
            <SignUpWrapper />
        </>
    );
}
