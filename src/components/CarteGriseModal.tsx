import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import carteGriseImg from "@/assets/carte-grise.webp";

const CarteGriseModal = () => {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[700px] w-[90vw] border-0 p-0 bg-transparent shadow-none overflow-visible [&>button]:hidden"
      >
        <div className="relative overflow-visible">
          {/* Card */}
          <div className="relative rounded-xl overflow-hidden border border-purple-500/20 bg-purple-950/40 backdrop-blur-sm shadow-[0_0_40px_rgba(139,92,246,0.12)]">
            {/* Left accent */}
            <div className="absolute left-0 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-purple-500/60 to-cyan-400/40" />
            {/* Horizontal line */}
            <div className="absolute bottom-[25%] left-0 right-0 h-[1px] bg-gradient-to-r from-purple-500/30 via-cyan-400/20 to-transparent" />

            {/* Content — tight right padding so text is close to image */}
            <div className="relative z-10 px-7 py-6 md:py-7 md:px-8 pr-[140px] md:pr-[180px]">
              <p className="text-white/90 text-[15px] md:text-base leading-relaxed font-heading">
                <span className="font-bold italic text-white">Nous vous</span>{" "}
                conseillons de vous munir de votre{" "}
                <strong className="text-purple-300 font-semibold">carte grise</strong>{" "}
                afin de remplir ce formulaire.
              </p>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed mt-1.5">
                Cela vous évitera de chercher les informations à renseigner.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-5 px-10 py-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-semibold uppercase tracking-widest hover:from-purple-500 hover:to-blue-500 transition-all shadow-[0_0_20px_rgba(139,92,246,0.4)]"
              >
                OK
              </button>
            </div>
          </div>

          {/* Carte grise — overflowing top-right */}
          <img
            src={carteGriseImg}
            alt="Carte grise"
            className="hidden md:block absolute -top-8 -right-6 w-[240px] rotate-[6deg] drop-shadow-[0_15px_30px_rgba(0,0,0,0.7)] pointer-events-none z-20"
          />
          {/* Mobile version */}
          <div className="md:hidden flex justify-center -mt-1 pb-2 relative z-20">
            <img
              src={carteGriseImg}
              alt="Carte grise"
              className="w-[160px] rounded-md shadow-lg rotate-[3deg]"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CarteGriseModal;
