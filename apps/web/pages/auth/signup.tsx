import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { NextSeo } from "next-seo";
import useExtension from "@web/hooks/useExtension";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import Link from "next/link";
import Alert from "@web/components/Alert";
import Google from "@web/components/Google";
import Input from "@web/components/Input";

export default function SignUp() {
  const { send } = useExtension();

  const router = useRouter();
  const captcha = useRef<HCaptcha>(null);
  const [error, setError] = useState<string | undefined>();

  const [token, setToken] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const [confirm, setConfirm] = useState<string | undefined>();

  useEffect(() => {
    if (!router.isReady) return;
    sessionStorage.setItem("auto", "true");
  }, [router]);

  async function submit(e: any) {
    e.preventDefault();

    const res = await send("REGISTER", {
      token,
      username,
      email,
      password,
      confirm,
    });

    if (res.error) return setError(res.error);
    if (res.redirect) return router.push(res.redirect);
    if (!res.success) return setError("Something unexpected happened");

    if (sessionStorage.getItem("auto") == "true")
      return router.push("/welcome");
    send("CLOSE").then((res) => !res.success && router.push("/"));
  }

  return (
    <>
      <NextSeo title="Sign Up" description="Sign Up your Remark account" />
      <div className="flex min-h-screen w-screen flex-col items-center justify-center gap-10">
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="text-5xl font-extrabold">Sign Up</h1>
          <p className="text-lg text-gray-700">
            Already have an account?{" "}
            <Link href="/auth/signin">
              <a className="text-lg">Sign In</a>
            </Link>
          </p>
        </div>
        <form
          onSubmit={submit}
          className="flex w-[90vw] flex-col gap-2 rounded-xl bg-white p-8 shadow sm:w-[22rem]"
        >
          <Input
            type="text"
            name="Username"
            autoComplete="nickname"
            set={setUsername}
            min={3}
            max={20}
          />
          <Input
            type="email"
            name="Email"
            autoComplete="email"
            set={setEmail}
          />
          <Input
            type="password"
            name="New Password"
            autoComplete="new-password"
            set={setPassword}
            min={6}
            max={128}
          />
          <Input
            type="password"
            name="Confirm Password"
            autoComplete="new-password"
            set={setConfirm}
            min={6}
            max={128}
          />
          {error && <Alert type="ERROR" text={error} />}
          <HCaptcha
            size="invisible"
            sitekey={
              process.env.NODE_ENV == "development"
                ? "10000000-ffff-ffff-ffff-000000000001"
                : "3482105b-57a8-4dae-9f27-0c4aced276ff"
            }
            onVerify={setToken}
            onLoad={() => captcha.current.execute()}
            ref={captcha}
          />
          <input className="btn-primary mt-2" type="submit" value="Submit" />
          <Google />
        </form>
      </div>
    </>
  );
}
