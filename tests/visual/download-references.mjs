/**
 * Downloads the authoritative visual reference pack.
 *
 * Postimg URLs are never hotlinked from production UI: every asset is fetched
 * once into public/media/reference/ with a deterministic filename, then
 * measured so the manifest can record real dimensions.
 */
import { mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('public/media/reference');

const REFERENCES = [
  'https://i.postimg.cc/d0yjHpST/Chat-GPT-Image-Oct-2-2026-01-19-27-AM-1.png',
  'https://i.postimg.cc/RVSGSPNz/Chat-GPT-Image-Oct-2-2026-01-19-29-AM-2.png',
  'https://i.postimg.cc/Dyv5vC8k/Chat-GPT-Image-Oct-2-2026-01-19-33-AM-3.png',
  'https://i.postimg.cc/X7jxj2Xh/Chat-GPT-Image-Oct-2-2026-01-19-34-AM-4.png',
  'https://i.postimg.cc/yY1n1fkq/Chat-GPT-Image-Oct-2-2026-01-19-36-AM-5.png',
  'https://i.postimg.cc/wMcWWZM4/Chat-GPT-Image-Oct-2-2026-01-19-37-AM-6.png',
  'https://i.postimg.cc/mrJ6h7KN/Chat-GPT-Image-Oct-2-2026-01-19-38-AM-7.png',
  'https://i.postimg.cc/jjmkCyBH/Chat-GPT-Image-Oct-2-2026-01-19-40-AM-8.png',
  'https://i.postimg.cc/QMwnVcvp/Chat-GPT-Image-Oct-2-2026-01-19-41-AM-9.png',
  'https://i.postimg.cc/Pq9FN105/Chat-GPT-Image-Oct-2-2026-01-19-43-AM-10.png',
  'https://i.postimg.cc/xCVyW5Wt/Swim-Fit-Stronger-Safer-Happier-Kids-(1).png',
  'https://i.postimg.cc/k5BpnTYr/swrt-Chat-GPT-2-aktwbr-2026-06-59-15-m.png',
  'https://i.postimg.cc/x83kFDmq/cropped-circle-image-(10).png',
  'https://i.postimg.cc/4yQKFkcF/cropped-circle-image-(11).png',
  'https://i.postimg.cc/pT7kXjc0/image-gen-1(20261001-212712).png',
  'https://i.postimg.cc/YCfXfhjj/image-gen-10(20261001-212752).png',
  'https://i.postimg.cc/MTXdS55c/image-gen-2(20261001-212716).png',
  'https://i.postimg.cc/50kvfmrB/image-gen-3(20261001-212720).png',
  'https://i.postimg.cc/V6HMzFhF/image-gen-4(20261001-212725).png',
  'https://i.postimg.cc/gkhRP8K9/image-gen-5(20261001-212729).png',
  'https://i.postimg.cc/6QM4h0Bq/image-gen-6(20261001-212734).png',
  'https://i.postimg.cc/MHQcqJVv/image-gen-7(20261001-212738).png',
  'https://i.postimg.cc/dDch0Njd/image-gen-8(20261001-212743).png',
  'https://i.postimg.cc/bwH6Hsdr/image-gen-9(20261001-212747).png',
  'https://i.postimg.cc/28xv0vFp/akadymyt-alsbaht-aqwy-walmʿ-mstqbl.png',
  'https://i.postimg.cc/zfygDQm3/akadymyt-alsbaht-bthqt-wahtraf.png',
  'https://i.postimg.cc/8CZt99RG/akadymyt-alsbaht-tbda-hna.png',
  'https://i.postimg.cc/8PbWZWdx/akadymyt-alsbaht-tʿlm-bthqt.png',
  'https://i.postimg.cc/YqQ8Mh6T/akadymyt-alsbaht-jyl-aqwy-fy-almaʾ-walhyat.png',
  'https://i.postimg.cc/nL30gg4p/akadymyt-alsbaht-ʿnd-alghrwb.png',
  'https://i.postimg.cc/wBw0ZZX6/akadymyt-sbaht-aly-almjd.png',
  'https://i.postimg.cc/FsxcTcg4/akadymyt-sbaht-ahtrafyt-baslwb-amn.png',
  'https://i.postimg.cc/Qxq5f5kD/akadymyt-swym-fyt-snaʿt-abtal-almaʾ.png',
  'https://i.postimg.cc/CKRqM2yY/aʿlan-akadymyt-alsbaht-alahtrafy.png',
  'https://i.postimg.cc/T37b664c/aʿlan-akadymyt-sbaht-mstqblyt.png',
  'https://i.postimg.cc/g2dsJm4b/tʿlm-alsbaht-baslwb-ahtrafy-wamn.png',
  'https://i.postimg.cc/bN4Txqmy/swrt-Chat-GPT-2-aktwbr-2026-09-43-55-m.jpg',
  'https://i.postimg.cc/136KMbd5/swrt-Chat-GPT-2-aktwbr-2026-09-44-01-m.jpg',
  'https://i.postimg.cc/wTDFg7XS/mlsq-akadymyt-alsbaht-swy-m-ft.png',
  'https://i.postimg.cc/jjD7q1VR/mlsq-akadymyt-alsbaht-swym-ft.png',
  'https://i.postimg.cc/Hsb3dVwR/mlsq-akadymyt-sbaht-btsmym-synmayy.png',
];

/** Reads intrinsic pixel dimensions straight from the PNG/JPEG header. */
async function dimensions(file) {
  const buffer = await stat(file).then(() => null);
  if (!buffer) return null;
  const fh = await import('node:fs/promises').then((fs) => fs.open(file, 'r'));
  try {
    const { read } = fh;
    const head = Buffer.alloc(32);
    await read(head, 0, 32, 0);

    // PNG
    if (head[0] === 0x89 && head.subarray(1, 4).toString('ascii') === 'PNG') {
      return { width: head.readUInt32BE(16), height: head.readUInt32BE(20), type: 'png' };
    }
    // JPEG
    if (head[0] === 0xff && head[1] === 0xd8) {
      const fh2 = fh;
      let offset = 2;
      const buf = Buffer.alloc(4);
      for (let guard = 0; guard < 64; guard += 1) {
        const res = await fh2.read(buf, 0, 4, offset);
        if (res.bytesRead < 4) break;
        if (buf[0] !== 0xff) {
          offset += 1;
          continue;
        }
        const marker = buf[1];
        const size = buf.readUInt16BE(2);
        // SOF0..SOF15, excluding DHT/JPG/DAC
        if (
          marker >= 0xc0 &&
          marker <= 0xcf &&
          marker !== 0xc4 &&
          marker !== 0xc8 &&
          marker !== 0xcc
        ) {
          const sizeBuf = Buffer.alloc(5);
          await fh2.read(sizeBuf, 0, 5, offset + 2);
          return { width: sizeBuf.readUInt16BE(3), height: sizeBuf.readUInt16BE(1), type: 'jpeg' };
        }
        offset += 2 + size;
      }
      return { width: null, height: null, type: 'jpeg' };
    }
    return { width: null, height: null, type: 'unknown' };
  } finally {
    await fh.close();
  }
}

await mkdir(OUT, { recursive: true });

const results = [];
const failed = [];

for (const [index, url] of REFERENCES.entries()) {
  const number = String(index + 1).padStart(2, '0');
  const filename = `ref-${number}.png`;
  const file = path.join(OUT, filename);

  try {
    const response = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      redirect: 'follow',
    });

    if (!response.ok) {
      failed.push({ number, url, reason: `HTTP ${response.status}` });
      console.log(`ref-${number} FAILED HTTP ${response.status}`);
      continue;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.startsWith('image/')) {
      failed.push({ number, url, reason: `content-type ${contentType}` });
      console.log(`ref-${number} FAILED not an image (${contentType})`);
      continue;
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1024) {
      failed.push({ number, url, reason: `suspiciously small (${bytes.length} bytes)` });
      console.log(`ref-${number} FAILED too small`);
      continue;
    }

    const target = contentType.includes('jpeg') || contentType.includes('jpg')
      ? file.replace(/\.png$/, '.jpg')
      : file;
    await writeFile(target, bytes);
    const info = await dimensions(target);
    const name = path.basename(target);

    results.push({
      id: `ref-${number}`,
      number,
      sourceUrl: url,
      localFile: `public/media/reference/${name}`,
      bytes: bytes.length,
      ...(info ?? {}),
    });
    console.log(
      `ref-${number} ok ${info?.width}x${info?.height} ${(bytes.length / 1024).toFixed(0)}kb -> ${name}`,
    );
  } catch (error) {
    failed.push({ number, url, reason: String(error).slice(0, 120) });
    console.log(`ref-${number} ERROR ${String(error).slice(0, 90)}`);
  }
}

await writeFile(
  path.join(OUT, 'download-report.json'),
  JSON.stringify({ downloaded: results.length, failed, results }, null, 2),
  'utf8',
);

console.log(`\ndownloaded ${results.length}/${REFERENCES.length}`);
