import { prisma } from "@/lib/db";
import { PricingRuleRow, NewPricingRuleForm } from "./_actions";
import { PayoutRuleForm } from "./_payout-actions";

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  const rules = await prisma.pricingRule.findMany({ orderBy: { km: "asc" } });
  const payoutRules = await prisma.payoutRule.findMany({ where: { active: true } });
  const smallPayout = payoutRules.find((r) => r.vehicleSize === "SMALL");
  const largePayout = payoutRules.find((r) => r.vehicleSize === "LARGE");

  return (
    <main className="ev-page ev-page--wide">
      <div className="ev-eyebrow">Eurosian VIP Transfer</div>
      <h1 className="ev-h1">Admin — Fiyat Tablosu</h1>
      <p style={{ fontSize: 13, color: "var(--text-muted)" }}>
        Bölüm 6: her bölge/otel için km ve araç tipine göre taban fiyat. Misafir rezervasyon
        formunda adres seçtiğinde, buradaki tabloyla eşleşmeyen mesafeler için otomatik
        interpolasyonla tahmini fiyat üretilir (bkz. <code className="ev-mono">resolve-by-distance.ts</code>).
      </p>

      <div className="ev-card" style={{ marginTop: 16 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 90px",
            gap: 10,
            fontSize: 11,
            color: "var(--text-muted)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            marginBottom: 8,
          }}
        >
          <span>Bölge</span>
          <span>Km</span>
          <span>Küçük Araç €</span>
          <span>Büyük Araç €</span>
          <span></span>
        </div>
        {rules.map((r) => (
          <PricingRuleRow key={r.id} rule={r} />
        ))}
      </div>

      <div className="ev-section-title">Yeni Bölge Ekle</div>
      <NewPricingRuleForm />

      <div className="ev-section-title">Önerilen Şoför/Karşılamacı Ücretleri</div>
      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: -4 }}>
        Bölüm 3: araç tipine göre önerilen ücret — atama formunda başlangıç değeri olarak
        gösterilir, admin her zaman manuel değiştirebilir.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8 }}>
        <PayoutRuleForm
          vehicleSize="SMALL"
          label="Küçük Araç (Vito/Transporter)"
          initialDriverFee={smallPayout?.suggestedDriverFee}
          initialGreeterFee={smallPayout?.suggestedGreeterFee}
          greeterRequired
        />
        <PayoutRuleForm
          vehicleSize="LARGE"
          label="Büyük Araç (Sprinter)"
          initialDriverFee={largePayout?.suggestedDriverFee}
          initialGreeterFee={largePayout?.suggestedGreeterFee}
        />
      </div>
    </main>
  );
}
