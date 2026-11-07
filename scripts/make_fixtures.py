"""Generate disposable test fixtures for the Unicode Compatibility Guard.

Everything is written under <repo>/_qa_scratch/fixtures (git-ignored). Optional --onedrive writes one
throwaway folder into the user's OneDrive for the cloud-synced case; remove it afterwards.

Usage: python -I -X utf8 scripts/make_fixtures.py [--onedrive]
"""
import os
import struct
import sys
import zlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FIX = ROOT / '_qa_scratch' / 'fixtures'


def png(w=16, h=16, rgb=(200, 60, 60)):
    raw = b''.join(b'\x00' + bytes(rgb) * w for _ in range(h))

    def chunk(tag, data):
        c = struct.pack('>I', len(data)) + tag + data
        return c + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF)

    return (b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
            + chunk(b'IDAT', zlib.compress(raw)) + chunk(b'IEND', b''))


def write(path: Path, rgb):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(png(rgb=rgb))


def long_dir() -> Path:
    # Aim for a full file path of about 246 characters (inside the WARN band 240-259).
    base = FIX / 'longpath'
    leaf_name = '長い.png'
    target = 246
    p = base
    while len(str(p / leaf_name)) < target - 52:
        p = p / ('d' * 50)
    remaining = target - len(str(p / leaf_name)) - 1
    if remaining > 0:
        p = p / ('e' * remaining)
    return p


def main():
    FIX.mkdir(parents=True, exist_ok=True)
    items = []
    write(FIX / 'ascii' / 'plain.png', (200, 60, 60)); items.append('ascii/plain.png')
    write(FIX / '日本語フォルダ' / 'テスト画像.png', (60, 200, 60)); items.append('日本語フォルダ/テスト画像.png')
    nfd = 'がめん.png'  # か + combining dakuten (decomposed form of がめん)
    write(FIX / 'nfd' / nfd, (60, 60, 200)); items.append('nfd/' + nfd)
    ld = long_dir()
    write(ld / '長い.png', (200, 200, 60)); items.append(str((ld / '長い.png').relative_to(FIX)).replace(os.sep, '/'))
    write(FIX / 'missing' / '消える.png', (200, 60, 200)); items.append('missing/消える.png')
    (FIX / '日本語プロジェクト').mkdir(parents=True, exist_ok=True)
    (FIX / 'manifest.txt').write_text('\n'.join(items) + '\n', encoding='utf-8', newline='\n')
    print('fixtures at', FIX)
    print('long path length:', len(str(ld / '長い.png')))
    if '--onedrive' in sys.argv:
        od = Path(os.environ['OneDrive']) / 'UCG_TEST_DELETE_ME' / '日本語'
        write(od / '画像.png', (100, 100, 100))
        print('onedrive fixture:', od / '画像.png')


if __name__ == '__main__':
    main()
