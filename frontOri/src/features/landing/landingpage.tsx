import NavbarLanding from "./navbarlanding";
import HeroLanding from "./herolanding";
import AreasConocimiento from "./areasconocimiento";
import Caracteristicas from "./caracteristicas";
import RutaAprendizaje from "./rutaaprendizaje";
import SeccionPractica from "./seccionpractica";
import CtaFinal from "./ctafinal";
import FooterLanding from "./footerlanding";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-oriza-crema text-oriza-tinta font-sans antialiased">
      <NavbarLanding />
      <main>
        <HeroLanding />
        <AreasConocimiento />
        <Caracteristicas />
        <RutaAprendizaje />
        <SeccionPractica />
        <CtaFinal />
      </main>
      <FooterLanding />
    </div>
  );
}
