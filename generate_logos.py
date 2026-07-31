import os
import zipfile
from PIL import Image, ImageDraw, ImageFont

# Masaüstü yolunu bul
desktop_path = os.path.expanduser('~/Desktop')
output_dir = os.path.join(desktop_path, 'euromark_assets')
os.makedirs(output_dir, exist_ok=True)

print("Avrupai VIP Transfer logoları üretiliyor...")

# 1. Web Sitesi Ana Logo / Banner
img_main = Image.new('RGB', (1200, 630), color='#111111')
d1 = ImageDraw.Draw(img_main)
d1.rectangle([20, 20, 1180, 610], outline='#D4AF37', width=3)
d1.text((600, 250), "EUROSIAN\nVIP TRANSFER", fill="#D4AF37", anchor="mm", align="center")
d1.text((600, 380), "+44 7576 096440", fill="#FFFFFF", anchor="mm")
img_main.save(os.path.join(output_dir, 'main_logo_banner.png'))

# 2. Web Sitesi Favicon
img_fav = Image.new('RGB', (512, 512), color='#0A0A0A')
d2 = ImageDraw.Draw(img_fav)
d2.ellipse([50, 50, 462, 462], outline='#D4AF37', width=8)
d2.text((256, 256), "E", fill="#D4AF37", anchor="mm")
img_fav.save(os.path.join(output_dir, 'favicon.png'))

# 3. WhatsApp / Sosyal Medya Profil Resmi
img_wa = Image.new('RGB', (512, 512), color='#111111')
d3 = ImageDraw.Draw(img_wa)
d3.rectangle([30, 30, 482, 482], outline='#D4AF37', width=4)
d3.text((256, 200), "EUROSIAN", fill="#D4AF37", anchor="mm")
d3.text((256, 260), "VIP TRANSFER", fill="#FFFFFF", anchor="mm")
d3.text((256, 340), "+44 7576 096440", fill="#D4AF37", anchor="mm")
img_wa.save(os.path.join(output_dir, 'whatsapp_profile.png'))

# 4. Mercedes Vito Maybach Edition
img_vito = Image.new('RGB', (800, 800), color='#151515')
d4 = ImageDraw.Draw(img_vito)
d4.rectangle([40, 40, 760, 760], outline='#D4AF37', width=5)
d4.text((400, 250), "EUROSIAN", fill="#D4AF37", anchor="mm")
d4.text((400, 330), "VIP TRANSFER", fill="#FFFFFF", anchor="mm")
d4.text((400, 480), "MAYBACH EDITION", fill="#D4AF37", anchor="mm")
img_vito.save(os.path.join(output_dir, 'vito_maybach_edition.png'))

# 5. Mercedes Sprinter VIP Class
img_sprinter = Image.new('RGB', (800, 800), color='#151515')
d5 = ImageDraw.Draw(img_sprinter)
d5.rectangle([40, 40, 760, 760], outline='#D4AF37', width=5)
d5.text((400, 250), "EUROSIAN", fill="#D4AF37", anchor="mm")
d5.text((400, 330), "VIP TRANSFER", fill="#FFFFFF", anchor="mm")
d5.text((400, 480), "SPRINTER CLASS", fill="#D4AF37", anchor="mm")
img_sprinter.save(os.path.join(output_dir, 'sprinter_vip_class.png'))

# ZIP arşivi oluştur
zip_path = os.path.join(desktop_path, 'Eurosian_VIP_Transfer_Logos.zip')
with zipfile.ZipFile(zip_path, 'w') as zipf:
    for root, dirs, files in os.walk(output_dir):
        for file in files:
            zipf.write(os.path.join(root, file), file)

print(f"İşlem Tamamlandı! ZIP dosyanız Masaüstüne kaydedildi: {zip_path}")

