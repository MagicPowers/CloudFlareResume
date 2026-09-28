# Photos

Each era has its own folder. Files are named `YYYY-MM-DD-short-description.jpg`,
and that date prefix does real work: it's shown on the site, it sorts the
gallery, and it decides which timeline milestone the photo appears under.

| Folder             | Era       | What belongs here                          |
| ------------------ | --------- | ------------------------------------------ |
| `trinity/`         | 2011–2015 | Trinity, Glasgow, the Erasmus year          |
| `science-gallery/` | 2013–2015 | Science Gallery, MakeShop, TEDx             |
| `webio-early/`     | 2016–2019 | Webio, graduate through senior              |
| `webio-lead/`      | 2019–2023 | Webio, team lead and acting CTO             |
| `webio-dx/`        | 2023      | Webio, developer experience                 |
| `revium/`          | 2024      | Revium                                      |
| `hertz/`           | 2024–now  | Hertz                                       |
| `cycling/`         | Ongoing   | Mizen to Malin, Dublin to Galway, any ride  |
| `dnd/`             | Ongoing   | Dungeons & Dragons                          |
| `misc/`            | —         | Anything that doesn't file neatly           |

After adding or removing photos, run `npm run photos` from the project root.
The folders are recreated automatically if they're missing.

## How the files are prepared

Every photo on the site went through the same steps before it was added:

- **EXIF metadata stripped**, including any GPS coordinates. Phone photos can
  carry the exact location they were taken.
- Resized to at most 1600px, re-encoded as JPEG at quality 82.
- A second copy at 800px wide saved in `<era>/thumbs/` with the same filename.
  Grids, timeline cards and the cycling strip load the thumbnail; the full file
  only loads when someone opens it in the lightbox.

A photo without a thumbnail still works — it's just served full size
everywhere. Two photos taken on the same day sort alphabetically, so add a
`-01-`, `-02-` after the date to fix their order.

## Captions

In `captions.json` next to this file, keyed by `<era>/<filename>`:

```json
{ "webio-lead/2019-06-01-offsite.jpg": "Team offsite, Wicklow" }
```

A caption can also go in the filename after a double underscore, but
`captions.json` is better — filenames can't carry punctuation or a fada.
