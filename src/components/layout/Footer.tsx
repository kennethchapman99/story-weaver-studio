import { Link } from "react-router-dom";
import logo from "@/assets/storyloom-logo.png";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-gradient-soft mt-24">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <img src={logo} alt="StoryLoom" className="h-9 w-auto mb-3" />
            <p className="text-sm text-muted-foreground max-w-xs">
              Custom novels and series, woven around the people and worlds you love.
            </p>
          </div>
          <FooterCol title="Product" links={[
            { to: "/packages", label: "Packages" },
            { to: "/create", label: "Create a book" },
            { to: "/create/wizard", label: "Guided wizard" },
            { to: "/create/form", label: "Detailed form" },
          ]} />
          <FooterCol title="Account" links={[
            { to: "/dashboard", label: "My orders" },
            { to: "/admin", label: "Admin" },
          ]} />
          <FooterCol title="Company" links={[
            { to: "#", label: "About" },
            { to: "#", label: "Privacy" },
            { to: "#", label: "Terms" },
            { to: "#", label: "Contact" },
          ]} />
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-border/60 pt-6 md:flex-row md:items-center">
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} StoryLoom. All rights reserved.</p>
          <p className="text-xs text-muted-foreground">Stories shaped with care. Reviewed by humans.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold mb-3">{title}</h4>
      <ul className="space-y-2">
        {links.map((l) => (
          <li key={l.label}>
            <Link to={l.to} className="text-sm text-muted-foreground hover:text-secondary transition-smooth">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
