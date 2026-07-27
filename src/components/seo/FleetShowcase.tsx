import Link from "next/link";
import { fleetPages } from "@/lib/site-content";

export function FleetShowcase({ locale }: { locale: string }) { return <div className="ev-grid ev-grid--3">{fleetPages.map(vehicle => <Link className="ev-card ev-link-card" href={`/${locale}/filomuz/${vehicle.slug}`} key={vehicle.slug}><div className="ev-eyebrow">{vehicle.capacity}</div><h3 style={{ margin: "8px 0" }}>{vehicle.name}</h3><p className="ev-muted">{vehicle.description}</p><div className="ev-card-row" style={{ flexWrap: "wrap", gap: 6 }}><span className="ev-badge">Wi-Fi</span><span className="ev-badge">USB</span><span className="ev-badge">Refreshments</span></div></Link>)}</div>; }
