# Photos

Drop images into the era folder they belong to, then run `npm run photos` from
the project root.

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

The folders are recreated automatically by `npm run photos` if they're missing,
so don't worry if a fresh clone or an upload drops the empty ones.

## Captions

Optional, two ways:

1. In the filename, after a double underscore —
   `2019-06__first-week-as-team-lead.jpg` becomes "First week as team lead".
2. In a `captions.json` next to this file:
   ```json
   { "webio-lead/offsite.jpg": "Team offsite, Wicklow, 2019" }
   ```

Filenames sort alphabetically within an era, so a `YYYY-MM-` prefix keeps them
in chronological order.

## Before you add photos from a phone

Phone photos carry EXIF metadata including GPS coordinates. Until the build-time
image pipeline lands (see `DEPLOYMENT.md`, Phase 7), strip that yourself — on
macOS, opening an image in Preview and using **Tools → Show Inspector** will show
you whether there's location data attached.
