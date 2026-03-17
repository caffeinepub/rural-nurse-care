import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
  Phone,
  Search,
  Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SampleFeedbackCard } from "../components/FeedbackCard";
import { SampleNurseCard } from "../components/NurseCard";
import { NurseCard } from "../components/NurseCard";
import { SAMPLE_FEEDBACK, SAMPLE_NURSES } from "../data/sampleNurses";
import { useListAllNurses } from "../hooks/useQueries";

const HOW_IT_WORKS = [
  {
    icon: MapPin,
    title: "Search Pincode",
    description: "Enter your 6-digit pincode to find nurses near you",
  },
  {
    icon: Star,
    title: "Browse Nurses",
    description:
      "View nurse profiles with experience, specialization, and reviews",
  },
  {
    icon: Phone,
    title: "Call Directly",
    description: "One tap to call your chosen nurse instantly",
  },
  {
    icon: CheckCircle,
    title: "Share Feedback",
    description: "Rate your experience and help others find quality care",
  },
];

export function HomePage() {
  const [pincode, setPincode] = useState("");
  const navigate = useNavigate();
  const { data: nurses } = useListAllNurses();

  const displayNurses = nurses && nurses.length > 0 ? nurses.slice(0, 6) : null;

  const handleSearch = () => {
    if (pincode.length === 6) {
      navigate({ to: "/nurses", search: { pincode } });
    } else {
      navigate({ to: "/nurses", search: { pincode: undefined } });
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="relative min-h-[540px] md:min-h-[620px] flex items-center"
        style={{
          background: `linear-gradient(to right, rgba(46,111,151,0.88) 0%, rgba(22,55,75,0.7) 50%, rgba(0,0,0,0.3) 100%), url('/assets/generated/hero-rural-nurse.dim_1400x700.jpg') center/cover no-repeat`,
        }}
      >
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-4 border border-white/30">
              Trusted Rural Healthcare Network
            </span>
            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Connecting Patients with{" "}
              <span className="text-yellow-300">Local Nurses</span>
            </h1>
            <p className="mt-4 text-white/85 text-base md:text-lg leading-relaxed">
              Get professional nursing care at your doorstep. Search by pincode,
              call directly, and share your experience.
            </p>
          </motion.div>

          {/* Pincode Search */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 max-w-md"
          >
            <div className="flex gap-2 bg-white rounded-xl p-2 shadow-lg">
              <div className="flex-1 flex items-center gap-2 px-2">
                <Search size={18} className="text-muted-foreground shrink-0" />
                <Input
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  placeholder="Enter 6-digit Pincode"
                  className="border-0 shadow-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground p-0 h-auto"
                  maxLength={6}
                  inputMode="numeric"
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  data-ocid="hero.input"
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-primary text-primary-foreground rounded-lg shrink-0"
                data-ocid="hero.primary_button"
              >
                Find Nurses
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="bg-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 py-5 divide-x divide-white/20">
            {[
              { value: "500+", label: "Verified Nurses" },
              { value: "50,000+", label: "Patients Served" },
              { value: "200+", label: "Pincodes Covered" },
            ].map((stat) => (
              <div key={stat.label} className="text-center px-4">
                <div className="text-xl md:text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-white/70 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Nurses */}
      <section className="container mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Featured Nurses
          </h2>
          <p className="mt-2 text-muted-foreground">
            Experienced, verified nurses ready to help
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayNurses
            ? displayNurses.map((nurse, i) => (
                <NurseCard key={nurse.id} nurse={nurse} index={i + 1} />
              ))
            : SAMPLE_NURSES.slice(0, 6).map((n, i) => (
                <SampleNurseCard key={n.id} {...n} index={i + 1} />
              ))}
        </div>
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            onClick={() =>
              navigate({ to: "/nurses", search: { pincode: undefined } })
            }
            className="gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            data-ocid="home.primary_button"
          >
            View All Nurses <ArrowRight size={16} />
          </Button>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-secondary/40 py-14">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-2 text-muted-foreground">
              Getting care is easy and fast
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center"
              >
                <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                  <step.icon size={26} className="text-primary" />
                </div>
                <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center mx-auto mb-2">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-foreground text-sm">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Patient Testimonials */}
      <section className="container mx-auto px-4 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Patient Testimonials
          </h2>
          <p className="mt-2 text-muted-foreground">
            Real experiences from real patients
          </p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SAMPLE_FEEDBACK.map((fb, i) => (
            <SampleFeedbackCard key={fb.id} {...fb} index={i + 1} />
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-primary py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Need Nursing Care Today?
          </h2>
          <p className="mt-3 text-white/80 max-w-md mx-auto">
            Search for a verified nurse in your area and get help within hours.
          </p>
          <Button
            onClick={() =>
              navigate({ to: "/nurses", search: { pincode: undefined } })
            }
            className="mt-6 bg-white text-primary hover:bg-white/90 font-semibold gap-2"
            data-ocid="home.secondary_button"
          >
            <Search size={16} /> Find a Nurse Now
          </Button>
        </div>
      </section>
    </div>
  );
}
