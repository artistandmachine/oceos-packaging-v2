import Preloader from "@/components/Preloader";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Reasons from "@/components/Reasons";
import Statement from "@/components/Statement";
import Products from "@/components/Products";
import Process from "@/components/Process";
import Why from "@/components/Why";
import Clients from "@/components/Clients";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import ContactDrawer from "@/components/ContactDrawer";
import site from "@/lib/site";

/**
 * One page. The look is era-residence.com; structure and scroll moments
 * are unitedcarriers.com. Cream, mist and forest bands alternate
 * (data-theme="mist" / "dark" on a section flips every token inside it):
 *
 *   Preloader (forest)
 *   Hero (cream): centered caps title screen -> arch that opens to full bleed
 *   Reasons (mist): rising dome with curved heading -> three stacking cards
 *   Statement (cream): two-tone pinned headline + stat column
 *   Products (cream): drag rail with spec tables
 *   Process (forest): pinned closed-loop track + moving marker + CO2e stat
 *   Why (mist): list + crossfading image
 *   Clients (forest): testimonial + logo wall
 *   FAQ (cream)
 *   CTA (arch image) -> Footer (forest)
 *
 * All copy: data/site.json.
 */
export default function Home() {
  const { company, preloader, nav, hero, reasons, statement, products, process, why, clients, faq, cta, contact, footer } = site;

  return (
    <>
      <Preloader products={preloader.products} stages={preloader.stages} />
      <Header links={nav} company={company} />
      <main>
        <Hero {...hero} wordmark={company.wordmark} logos={clients.logos} logosLabel={clients.wallLabel} />
        <Reasons {...reasons} />
        <Statement {...statement} />
        <Products {...products} />
        <Process {...process} />
        <Why {...why} />
        <Clients {...clients} />
        <Faq {...faq} email={company.email} />
        <Cta {...cta} email={company.email} />
      </main>
      <Footer tagline={footer.tagline} nav={nav} products={products.items.map((p) => p.title)} company={company} />
      <ContactDrawer {...contact} email={company.email} name={company.name} wordmark={company.wordmark} />
    </>
  );
}
