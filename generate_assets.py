#!/usr/bin/env python3
"""Generiert selbst-enthaltene SVG-Illustrationen fuer die Gino-Gelati-Startseite.
Keine externen Bilder/Netzwerk noetig – alles rendert offline."""
import os

OUT = os.path.join(os.path.dirname(__file__), "assets")
os.makedirs(OUT, exist_ok=True)


def write(name, svg):
    with open(os.path.join(OUT, name), "w") as f:
        f.write(svg.strip() + "\n")


# ---------------------------------------------------------------- Eiskugel-Becher
def scoop(base, top, shade, topping, bg1="#fbf6ec", bg2="#f1e7d3", chips=False):
    dots = ""
    if chips:
        pts = [(92, 60), (120, 52), (138, 70), (104, 78), (130, 92), (84, 86)]
        for x, y in pts:
            dots += f'<rect x="{x}" y="{y}" width="7" height="5" rx="1.5" transform="rotate(20 {x} {y})" fill="{topping}"/>'
    else:
        pts = [(96, 58), (124, 56), (140, 74), (110, 84), (84, 80)]
        for x, y in pts:
            dots += f'<circle cx="{x}" cy="{y}" r="4.5" fill="{topping}"/>'
    return f"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 170" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="{bg1}"/><stop offset="100%" stop-color="{bg2}"/>
    </radialGradient>
    <linearGradient id="sc" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="{top}"/><stop offset="100%" stop-color="{shade}"/>
    </linearGradient>
  </defs>
  <rect width="240" height="170" fill="url(#bg)"/>
  <!-- Schale -->
  <ellipse cx="120" cy="132" rx="78" ry="18" fill="#e7d9c0"/>
  <path d="M52 126 Q120 158 188 126 L180 138 Q120 166 60 138 Z" fill="#d8c4a3"/>
  <!-- Eiskugeln -->
  <circle cx="92" cy="92" r="40" fill="url(#sc)"/>
  <circle cx="150" cy="96" r="34" fill="url(#sc)"/>
  <circle cx="122" cy="70" r="44" fill="url(#sc)"/>
  <!-- Glanz -->
  <ellipse cx="104" cy="52" rx="20" ry="13" fill="{top}" opacity=".55"/>
  <ellipse cx="100" cy="50" rx="9" ry="6" fill="#ffffff" opacity=".4"/>
  <!-- Topping -->
  {dots}
  <!-- Waffel -->
  <path d="M150 44 l26 -16 4 7 -26 16 z" fill="#d9a85a"/>
  <path d="M153 47 l20 -12" stroke="#b9863c" stroke-width="1"/>
</svg>"""


write("scoop-pistazie.svg", scoop("#a9c25e", "#c2d77e", "#8aa544", "#6d4a2f"))
write("scoop-schoko.svg", scoop("#5b3a24", "#7a4e31", "#43291a", "#3a2414"))
write("scoop-erdbeere.svg", scoop("#e87a8a", "#f4a0ab", "#d65f70", "#b83b4d"))
write("scoop-haselnuss.svg", scoop("#c79a63", "#dcb681", "#a87e4b", "#6b4327"))
write("scoop-stracciatella.svg", scoop("#efe6d2", "#fbf6ec", "#ddcfb4", "#3a2414", chips=True))
# weitere Sorten fuer die Produktuebersicht
write("scoop-vanille.svg", scoop("#f0e2b8", "#f9f0d8", "#e0cd97", "#d9a85a"))
write("scoop-mango.svg", scoop("#f3b24e", "#f8ca7c", "#de9533", "#c8761f"))
write("scoop-zitrone.svg", scoop("#ecdd6f", "#f6ed9c", "#d8c44a", "#bda93a"))
write("scoop-kokos.svg", scoop("#f1ebde", "#fbf8f1", "#ddd2bd", "#c1ad8f", chips=True))
write("scoop-karamell.svg", scoop("#c98a4a", "#dda869", "#a86c33", "#5a3a20"))
write("scoop-joghurt.svg", scoop("#f5efe3", "#fcf9f3", "#e6dcc9", "#e06f6f"))
write("scoop-tiramisu.svg", scoop("#c7a173", "#d8bb93", "#a87e4b", "#4a2e1c", chips=True))
write("scoop-minze.svg", scoop("#b6dcc0", "#cfeed7", "#8fc7a0", "#3a2414", chips=True))


# ---------------------------------------------------------------- Italien-Flagge (Kategorie)
write("flag-italia.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <rect width="40" height="120" x="0" fill="#0e8a44"/>
  <rect width="40" height="120" x="40" fill="#ffffff"/>
  <rect width="40" height="120" x="80" fill="#cf2734"/>
</svg>""")


# ---------------------------------------------------------------- Hero: grosse Eisschale
write("hero.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 760" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="hbg" cx="62%" cy="40%" r="80%">
      <stop offset="0%" stop-color="#fbf3e3"/><stop offset="60%" stop-color="#f3e6cd"/><stop offset="100%" stop-color="#e9d6b4"/>
    </radialGradient>
    <linearGradient id="pist" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c2d77e"/><stop offset="1" stop-color="#8aa544"/></linearGradient>
    <linearGradient id="erd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4a0ab"/><stop offset="1" stop-color="#d65f70"/></linearGradient>
    <linearGradient id="cream" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf6ec"/><stop offset="1" stop-color="#e3d4b6"/></linearGradient>
    <linearGradient id="cho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4e31"/><stop offset="1" stop-color="#4a2e1c"/></linearGradient>
  </defs>
  <rect width="900" height="760" fill="url(#hbg)"/>
  <!-- verstreute Deko -->
  <circle cx="120" cy="120" r="10" fill="#d65f70" opacity=".5"/>
  <circle cx="800" cy="90" r="8" fill="#a9c25e" opacity=".6"/>
  <circle cx="180" cy="640" r="9" fill="#8aa544" opacity=".5"/>
  <circle cx="760" cy="660" r="11" fill="#d65f70" opacity=".45"/>
  <!-- Schale -->
  <ellipse cx="470" cy="545" rx="300" ry="72" fill="#ead9b9"/>
  <path d="M180 520 Q470 660 760 520 L735 575 Q470 700 205 575 Z" fill="#d9c39c"/>
  <ellipse cx="470" cy="515" rx="295" ry="66" fill="#f3e8d2"/>
  <!-- Kugeln -->
  <circle cx="350" cy="430" r="95" fill="url(#pist)"/>
  <circle cx="600" cy="440" r="88" fill="url(#erd)"/>
  <circle cx="470" cy="370" r="105" fill="url(#cream)"/>
  <circle cx="245" cy="470" r="70" fill="url(#cho)"/>
  <circle cx="690" cy="490" r="60" fill="url(#pist)"/>
  <!-- Glanz -->
  <ellipse cx="440" cy="320" rx="42" ry="26" fill="#ffffff" opacity=".4"/>
  <ellipse cx="330" cy="395" rx="30" ry="18" fill="#ffffff" opacity=".22"/>
  <!-- Pistazien/Topping -->
  <g fill="#6d4a2f">
    <ellipse cx="320" cy="400" rx="9" ry="6"/><ellipse cx="380" cy="420" rx="9" ry="6"/>
    <ellipse cx="350" cy="460" rx="9" ry="6"/><ellipse cx="690" cy="470" rx="8" ry="5"/>
  </g>
  <g fill="#b83b4d"><circle cx="590" cy="410" r="7"/><circle cx="620" cy="450" r="7"/><circle cx="560" cy="450" r="6"/></g>
  <!-- Erdbeere oben -->
  <path d="M470 300 q22 -8 30 12 q6 24 -30 40 q-36 -16 -30 -40 q8 -20 30 -12z" fill="#d83a4e"/>
  <path d="M470 296 l-10 -14 8 2 2 -10 4 10 8 -4 -6 12z" fill="#5a8a3a"/>
  <circle cx="462" cy="320" r="2" fill="#ffd27a"/><circle cx="478" cy="330" r="2" fill="#ffd27a"/><circle cx="470" cy="345" r="2" fill="#ffd27a"/>
  <!-- Minzblatt -->
  <path d="M540 320 q30 -18 44 4 q-26 18 -44 -4z" fill="#5a8a3a"/>
</svg>""")


# ---------------------------------------------------------------- Italienische Kueste
write("tradition.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe2ef"/><stop offset="100%" stop-color="#eaf6f2"/></linearGradient>
    <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f9fb8"/><stop offset="100%" stop-color="#2f7d97"/></linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#sky)"/>
  <circle cx="660" cy="110" r="46" fill="#fdf3d4" opacity=".8"/>
  <!-- Meer -->
  <rect y="360" width="800" height="240" fill="url(#sea)"/>
  <g stroke="#ffffff" stroke-width="2" opacity=".25">
    <path d="M40 430 q30 -10 60 0 t60 0" fill="none"/><path d="M520 470 q30 -10 60 0 t60 0" fill="none"/>
    <path d="M120 520 q30 -10 60 0 t60 0" fill="none"/>
  </g>
  <!-- linke Landzunge mit Haeusern -->
  <path d="M0 360 L0 250 Q120 230 210 300 L260 360 Z" fill="#8aa15a"/>
  <path d="M0 360 L0 250 Q120 230 210 300 L260 360 Z" fill="#6f8a47" opacity=".4"/>
  <g>
    <rect x="40" y="288" width="46" height="58" fill="#e8b15a"/><rect x="40" y="288" width="46" height="14" fill="#c9863a"/>
    <rect x="92" y="300" width="40" height="46" fill="#e07b5a"/><rect x="92" y="300" width="40" height="12" fill="#bd5b3e"/>
    <rect x="138" y="312" width="38" height="34" fill="#efd6a0"/><rect x="138" y="312" width="38" height="10" fill="#cdb074"/>
    <rect x="10" y="312" width="30" height="34" fill="#dd6f6f"/>
    <g fill="#7a4a2c"><rect x="52" y="304" width="8" height="10"/><rect x="68" y="304" width="8" height="10"/><rect x="104" y="316" width="7" height="9"/></g>
  </g>
  <!-- rechte Kueste -->
  <path d="M800 360 L800 280 Q700 250 600 320 L560 360 Z" fill="#7d9650"/>
  <g>
    <rect x="690" y="300" width="40" height="50" fill="#e8b15a"/><rect x="640" y="312" width="36" height="38" fill="#dd6f6f"/>
    <rect x="740" y="308" width="34" height="42" fill="#efd6a0"/>
  </g>
  <!-- Boot -->
  <path d="M360 470 q40 26 90 0 z" fill="#f2efe6"/><rect x="402" y="440" width="3" height="32" fill="#9a8050"/>
  <path d="M405 442 l26 22 -26 6z" fill="#d65f70"/>
</svg>""")


# ---------------------------------------------------------------- Rezepte: Sundae
write("recipes.svg", """
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" preserveAspectRatio="xMidYMid slice">
  <defs>
    <radialGradient id="rbg" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#fbf3e3"/><stop offset="1" stop-color="#ecd9b8"/></radialGradient>
    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbf6ec"/><stop offset="1" stop-color="#e3d4b6"/></linearGradient>
    <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4a0ab"/><stop offset="1" stop-color="#d65f70"/></linearGradient>
    <linearGradient id="g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7a4e31"/><stop offset="1" stop-color="#4a2e1c"/></linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#rbg)"/>
  <!-- Glas -->
  <path d="M210 300 L390 300 L360 470 Q300 500 240 470 Z" fill="#ffffff" opacity=".35"/>
  <path d="M210 300 L390 300 L360 470 Q300 500 240 470 Z" fill="none" stroke="#ffffff" stroke-width="4" opacity=".7"/>
  <rect x="285" y="498" width="30" height="40" fill="#ffffff" opacity=".4"/>
  <ellipse cx="300" cy="545" rx="60" ry="14" fill="#e7d6b6"/>
  <!-- Kugeln -->
  <circle cx="262" cy="270" r="58" fill="url(#g3)"/>
  <circle cx="340" cy="276" r="52" fill="url(#g2)"/>
  <circle cx="300" cy="218" r="64" fill="url(#g1)"/>
  <ellipse cx="280" cy="190" rx="22" ry="14" fill="#fff" opacity=".4"/>
  <!-- Sauce -->
  <path d="M250 250 q10 40 -4 70 q-20 -30 4 -70z" fill="#c0392b" opacity=".8"/>
  <!-- Kirsche -->
  <circle cx="300" cy="150" r="20" fill="#c0202b"/><ellipse cx="293" cy="144" rx="6" ry="4" fill="#fff" opacity=".5"/>
  <path d="M300 132 q14 -22 34 -24" stroke="#6b4327" stroke-width="4" fill="none"/>
  <!-- Streusel -->
  <g><rect x="240" y="206" width="10" height="4" rx="2" fill="#7bbf63" transform="rotate(30 240 206)"/>
     <rect x="330" y="206" width="10" height="4" rx="2" fill="#e8a33d" transform="rotate(-20 330 206)"/>
     <rect x="296" y="186" width="10" height="4" rx="2" fill="#d65f70" transform="rotate(50 296 186)"/></g>
  <!-- Waffel -->
  <path d="M348 220 l44 -30 8 12 -44 30z" fill="#d9a85a"/><path d="M352 226 l36 -24" stroke="#b9863c" stroke-width="2"/>
</svg>""")


# ---------------------------------------------------------------- Eis des Monats
write("eis-monats.svg", scoop("#a9c25e", "#c2d77e", "#7e9a3c", "#5a3e22",
                              bg1="#7d8a45", bg2="#5c6a32"))

print("SVGs generiert:", sorted(os.listdir(OUT)))
