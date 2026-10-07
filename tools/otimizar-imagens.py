"""Gera as imagens do site a partir das fotos originais (4K ou qualquer tamanho).

Uso:
  python3 tools/otimizar-imagens.py "<pasta com as fotos originais>"

Para cada foto listada em tools/imagens.json gera, em img/:
  <nome>-640.webp, <nome>-1280.webp, <nome>-1920.webp  (usados no srcset)
  <nome>.jpg                                           (fallback, 1280px)
A logo é exportada sem nenhuma alteração de arte, só redimensionada.
Fotos menores que a largura pedida não são ampliadas.
"""
import json, sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "img"
WIDTHS = (640, 1280, 1920)


def carregar(p):
    im = ImageOps.exif_transpose(Image.open(p))
    return im.convert("RGBA" if im.mode in ("RGBA", "LA", "P") else "RGB")


def reduzir(im, w):
    if im.width <= w:
        return im.copy()
    return im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)


def foto(src, nome):
    im = carregar(src).convert("RGB")
    for w in WIDTHS:
        reduzir(im, w).save(OUT / f"{nome}-{w}.webp", "WEBP", quality=80, method=6)
    reduzir(im, 1280).save(OUT / f"{nome}.jpg", "JPEG", quality=82, optimize=True, progressive=True)


def logo(src):
    im = carregar(src)
    for w in (128, 256, 512):
        reduzir(im, w).save(OUT / f"logo-{w}.png", "PNG", optimize=True)
        reduzir(im, w).save(OUT / f"logo-{w}.webp", "WEBP", quality=92, method=6)


def main():
    pasta = Path(sys.argv[1]) if len(sys.argv) > 1 else OUT / "originais"
    mapa = json.loads((ROOT / "tools" / "imagens.json").read_text(encoding="utf-8"))
    for nome, arquivo in mapa.items():
        src = pasta / arquivo
        if not src.exists():
            print(f"!! não achei {src}")
            continue
        logo(src) if nome == "logo" else foto(src, nome)
        print(f"ok {nome:10s} <- {arquivo}")


if __name__ == "__main__":
    main()
