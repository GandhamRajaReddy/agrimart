import { Droplets, Leaf, ShoppingBag, Sparkles, Sprout, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import bannerImage from "../../../assets/images/banners/background_image.png";
import Badge from "../../../components/common/Badge";
import Button from "../../../components/common/Button";
import { addToCart } from "../../../store/cartSlice";

const art = {
  seed: { Icon: Sprout, className: "from-[#e5efcc] via-[#b8d07f] to-[#6d9f43]", label: "Seeds" },
  nutrition: { Icon: Leaf, className: "from-[#dce8d8] via-[#90b983] to-[#3e7447]", label: "Nutrition" },
  protection: { Icon: Sparkles, className: "from-[#f8e5c5] via-[#efb560] to-[#c7772f]", label: "Protection" },
  irrigation: { Icon: Droplets, className: "from-[#d4edf0] via-[#88c8d0] to-[#317d85]", label: "Irrigation" },
};

const formatMoney = (amount) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

const FeaturedProducts = ({ products }) => {
  const dispatch = useDispatch();

  return (
    <section className="border-y border-[#1d4b34]/8 bg-[#eaf0e7]/72 py-20 sm:py-24">
      <div className="content-container">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Popular farm picks</p>
            <h2 className="display-font mt-3 text-4xl font-semibold tracking-[-0.045em] text-[#163124] sm:text-5xl">Trusted inputs, clearly chosen.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#587062]">A practical starting point while the full product catalogue is being connected.</p>
          </div>
          <Link to="/catalog" className="text-sm font-extrabold text-[#1d4b34] hover:text-[#5d8f3d]">View product catalogue →</Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => {
            const productArt = art[product.art] || art.seed;
            const Icon = productArt.Icon;
            return (
              <article key={product.id} className="group overflow-hidden rounded-3xl border border-[#1d4b34]/10 bg-white shadow-[0_12px_28px_rgba(22,49,36,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-lifted)]">
                <div className={`relative grid aspect-[4/3] place-items-center overflow-hidden bg-gradient-to-br ${productArt.className}`}>
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.5),transparent_68%)]" />
                  <span className="relative grid h-24 w-20 place-items-center rounded-[1.25rem] border border-white/55 bg-white/65 text-[#1d4b34] shadow-[0_18px_30px_rgba(22,49,36,0.13)] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-3">
                    <Icon className="h-9 w-9" aria-hidden="true" />
                    <span className="mt-1 text-[0.55rem] font-extrabold uppercase tracking-[0.09em]">{productArt.label}</span>
                  </span>
                  <Badge className="absolute left-3 top-3 bg-white/80 backdrop-blur" size="sm">{product.badge}</Badge>
                </div>
                <div className="p-5">
                  <p className="text-[0.66rem] font-extrabold uppercase tracking-[0.12em] text-[#5d8f3d]">{product.category}</p>
                  <h3 className="mt-2 min-h-11 text-sm font-extrabold leading-5 text-[#163124]">{product.name}</h3>
                  <p className="mt-1 text-xs text-[#587062]">{product.unit}</p>
                  <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-[#587062]">
                    <Star className="h-3.5 w-3.5 fill-[#d68b35] text-[#d68b35]" aria-hidden="true" />
                    {product.rating} <span className="font-medium text-[#789080]">({product.reviewsCount})</span>
                  </div>
                  <div className="mt-5 flex items-end justify-between gap-3 border-t border-[#1d4b34]/8 pt-4">
                    <div>
                      <p className="text-lg font-extrabold tracking-tight text-[#163124]">{formatMoney(product.price)}</p>
                      {product.originalPrice && <p className="text-xs text-[#789080] line-through">{formatMoney(product.originalPrice)}</p>}
                    </div>
                    <Button
                      size="sm"
                      className="h-9 w-9 !px-0"
                      aria-label={`Add ${product.name} to cart`}
                      icon={ShoppingBag}
                      onClick={() => dispatch(addToCart({ ...product, image: bannerImage }))}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
