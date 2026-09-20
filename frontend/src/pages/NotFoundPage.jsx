import { Link } from "react-router-dom";
import { Home, MapPinOff } from "lucide-react";

import Button from "../components/common/Button";
import { ROUTES } from "../config/routes";

const NotFoundPage = () => (
  <div className="content-container flex min-h-[62dvh] items-center justify-center py-16">
    <section className="max-w-lg text-center">
      <span className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-[#eaf0e7] text-[#1d4b34]">
        <MapPinOff className="h-8 w-8" aria-hidden="true" />
      </span>
      <p className="mt-6 text-xs font-extrabold uppercase tracking-[0.15em] text-[#5d8f3d]">Wrong turn</p>
      <h1 className="display-font mt-2 text-4xl font-semibold tracking-[-0.04em] text-[#163124] sm:text-5xl">This field is not on our map.</h1>
      <p className="mt-4 text-sm leading-6 text-[#587062]">The link may have moved, or the page has not been planted yet.</p>
      <Link className="mt-7 inline-flex" to={ROUTES.home}>
        <Button icon={Home}>Return home</Button>
      </Link>
    </section>
  </div>
);

export default NotFoundPage;
