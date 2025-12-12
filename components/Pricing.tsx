"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const pricingPlans = [
  {
    id: 1,
    name: "Basic",
    description: "Perfect for short trips",
    price: 49,
    period: "day",
    features: [
      "Economy vehicles",
      "100 km/day included",
      "Basic insurance",
      "24/7 Support",
      "Free cancellation",
    ],
    popular: false,
  },
  {
    id: 2,
    name: "Premium",
    description: "Most popular choice",
    price: 99,
    period: "day",
    features: [
      "Premium vehicles",
      "Unlimited mileage",
      "Full insurance coverage",
      "24/7 Priority Support",
      "Free cancellation",
      "GPS navigation",
      "Child seat available",
    ],
    popular: true,
  },
  {
    id: 3,
    name: "Luxury",
    description: "Ultimate experience",
    price: 199,
    period: "day",
    features: [
      "Luxury & Sports cars",
      "Unlimited mileage",
      "Premium insurance",
      "Personal concierge",
      "Airport pickup",
      "Free fuel on pickup",
      "VIP lounge access",
      "Chauffeur available",
    ],
    popular: false,
  },
];

const Pricing = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(headingRef.current?.children || [], {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: headingRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(cardsRef.current?.children || [], {
        y: 80,
        opacity: 0,
        scale: 0.9,
        stagger: 0.15,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="pricing"
      className="py-24 lg:py-40 bg-gray-900 text-white"
      data-scroll-section
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div ref={headingRef} className="text-center mb-16">
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Pricing Plans
          </span>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-medium mt-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto">
            Flexible pricing options designed to fit your needs. All plans
            include our quality assurance guarantee.
          </p>
        </div>

        {/* Pricing Cards */}
        <div ref={cardsRef} className="grid md:grid-cols-3 gap-8 lg:gap-6">
          {pricingPlans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-8 ${
                plan.popular
                  ? "bg-primary text-white scale-105 shadow-2xl shadow-primary/30"
                  : "bg-gray-800/50 backdrop-blur border border-gray-700"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-primary text-sm font-medium px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-semibold mb-2">{plan.name}</h3>
              <p
                className={`text-sm ${
                  plan.popular ? "text-white/80" : "text-gray-400"
                } mb-6`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-8">
                <span className="text-5xl font-bold">${plan.price}</span>
                <span
                  className={`${
                    plan.popular ? "text-white/70" : "text-gray-400"
                  }`}
                >
                  /{plan.period}
                </span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <svg
                      className={`w-5 h-5 flex-shrink-0 ${
                        plan.popular ? "text-white" : "text-primary"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className={plan.popular ? "" : "text-gray-300"}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <button
                className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${
                  plan.popular
                    ? "bg-white text-primary hover:bg-gray-100"
                    : "bg-primary text-white hover:bg-primary-hover"
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-400 mb-4">
            Need a custom solution for your business?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Contact us for enterprise pricing
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
