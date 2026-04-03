import { Link } from "@/i18n/routing";
import Image from "next/image";
import Copyright from "@/components/partials/auth/copyright";
import Logo from "@/components/partials/auth/logo";
import { WaitlistForm } from "@/components/waitlist/waitlist-form";

export default function WaitlistPage() {
  return (
    <div className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full">
      <div className="overflow-y-auto flex flex-wrap w-full min-h-dvh">
        <div
          className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 
 relative z-1 bg-default-50"
        >
          <div className="max-w-[520px] pt-20 ps-20 ">
            <Link href="/" className="mb-6 inline-block">
              <Logo />
            </Link>
            <h4>
              Treasurer of Bharat
              <span className="text-default-800 font-bold ms-2">early access</span>
            </h4>
            <p className="mt-6 text-lg font-normal leading-relaxed text-default-600 max-w-md">
              Be first in line when we open the platform. Leave your email and we will
              notify you.
            </p>
          </div>
          <div className="absolute left-0 2xl:bottom-[-160px] bottom-[-130px] h-full w-full z-[-1]">
            <Image
              src="/images/auth/ils1.svg"
              alt=""
              priority
              width={300}
              height={300}
              className="mb-10 w-full h-full"
            />
          </div>
        </div>
        <div className="flex-1 relative">
          <div className="min-h-dvh flex flex-col dark:bg-default-100 bg-white">
            <div className="max-w-[524px] md:px-[42px] md:py-[44px] p-7 mx-auto w-full text-2xl text-default-900 mb-3 flex flex-1 flex-col justify-center">
              <div className="flex justify-center items-center text-center mb-6 lg:hidden">
                <Link href="/">
                  <Logo />
                </Link>
              </div>
              <div className="text-center 2xl:mb-10 mb-6">
                <h4 className="font-medium">Join the waitlist</h4>
                <div className="text-default-500 text-base mt-2">
                  We are launching soon. Get one step ahead with early access.
                </div>
              </div>
              <WaitlistForm />
              <div className="mt-10 text-center text-sm text-default-500 font-normal">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-default-900 font-medium hover:underline"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="text-xs font-normal text-default-500 z-999 pb-10 text-center">
              <Copyright />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
