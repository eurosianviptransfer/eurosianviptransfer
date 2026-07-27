import { DriverApplicationForm } from "@/components/driver/DriverApplicationForm";

export default function DriverApplicationPage() {
  return (
    <main className="ev-page ev-page--wide">
      <div className="ev-eyebrow">Eurosian VIP Transfer · Partner ağı</div>
      <h1 className="ev-h1">Şoför / araç başvurusu</h1>
      <p className="ev-muted" style={{ maxWidth: 720 }}>
        Bilgilerinizi gönderin. Başvurunuz admin incelemesine düşer; başvuru numaranız ve telefonunuzla durumunuzu istediğiniz zaman takip edebilirsiniz.
      </p>
      <DriverApplicationForm />
    </main>
  );
}
