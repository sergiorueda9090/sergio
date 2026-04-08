from PIL import Image, ImageDraw, ImageFont
import os

out = r"C:\proyectos\sergio_ingles\mainapp\static\mainapp\img\projects"
os.makedirs(out, exist_ok=True)

projects = [
    ("consultorio-dental.jpg", "DentalSmile",             (15,110,163), (34,197,94)),
    ("gym.jpg",                "IronForge Gym",            (26,26,46),   (233,79,55)),
    ("spa.jpg",                "Bella Spa",                (142,68,118), (244,194,194)),
    ("constructora.jpg",       "Altavista Constructora",   (28,43,58),   (240,165,0)),
    ("abogado.jpg",            "Ramirez & Asociados",      (26,26,26),   (201,160,74)),
    ("colombia-viva.jpg",      "Colombia Viva",            (0,59,112),   (255,204,0)),
    ("devcraft.jpg",           "DevCraft Software",        (13,27,42),   (0,229,255)),
    ("brasakfire.jpg",         "BrasakFire",               (26,10,0),    (255,69,0)),
    ("lumiere.jpg",            "Lumiere Botanica",         (27,47,30),   (168,213,138)),
    ("mente-plena.jpg",        "Mente Plena Psicologia",   (30,42,58),   (124,185,232)),
    ("muvit.jpg",              "Muvit Mudanzas",           (10,10,46),   (0,200,255)),
    ("patitas.jpg",            "Patitas Vet",              (26,58,46),   (77,199,122)),
    ("seguros.jpg",            "Seguros.com",              (0,42,94),    (0,140,255)),
    ("structura.jpg",          "Structura Constructora",   (22,32,43),   (232,140,0)),
    ("vialidad.jpg",           "Vialidad Autoescuela",     (13,26,13),   (0,230,118)),
    ("wanderlust.jpg",         "Wanderlust Viajes",        (0,43,78),    (0,212,255)),
    ("developer.jpg",          "Developer Portfolio",      (10,10,10),   (34,197,94)),
    ("gym-imagenes.jpg",       "IronForge con Imagenes",   (18,18,26),   (255,107,53)),
]

W, H = 1200, 675

font_b = next((f for f in [r"C:\Windows\Fonts\arialbd.ttf", r"C:\Windows\Fonts\calibrib.ttf"] if os.path.exists(f)), None)
font_r = next((f for f in [r"C:\Windows\Fonts\arial.ttf",   r"C:\Windows\Fonts\calibri.ttf"]  if os.path.exists(f)), None)

for fname, title, bg, ac in projects:
    img = Image.new("RGB", (W, H), bg)
    d = ImageDraw.Draw(img)
    for i in range(H):
        t = i / H
        d.line([(0,i),(W,i)], fill=tuple(max(0,int(c*(1-t*0.5))) for c in bg))
    d.rectangle([(0,0),(8,H)], fill=ac)
    d.rectangle([(0,H-5),(W,H)], fill=ac)
    fl = ImageFont.truetype(font_b, 64) if font_b else ImageFont.load_default()
    fs = ImageFont.truetype(font_r, 30) if font_r else fl
    bb = d.textbbox((0,0), title, font=fl)
    tw, th = bb[2]-bb[0], bb[3]-bb[1]
    x, y = (W-tw)//2, (H-th)//2 - 40
    d.text((x+2,y+2), title, fill=(0,0,0), font=fl)
    d.text((x,y), title, fill=(255,255,255), font=fl)
    d.rectangle([(x+tw//4, y+th+15),(x+3*tw//4, y+th+19)], fill=ac)
    sub = "Proyecto Web - Sergio Rueda"
    bb2 = d.textbbox((0,0), sub, font=fs)
    d.text(((W-(bb2[2]-bb2[0]))//2, y+th+35), sub, fill=ac, font=fs)
    img.save(os.path.join(out, fname), "JPEG", quality=88)
    print(f"  {fname}")

print("Done!")
