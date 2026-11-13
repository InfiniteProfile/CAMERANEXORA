CAMERANEXORA
Run: python3 -m http.server in this folder, then open http://localhost:8000 (fetch needs a server).
Add cameras: append lines to data/cameras-001.txt, or create cameras-002.txt, 003... (loaded in order until a file is missing).
Format: id|name|brand|world|subcategory|year|country|format|status|reference|image|image_license|description
Ids are digit strings, kept as strings, never converted to numbers. Duplicates and malformed lines are skipped.
Photos: put a verified, licensed file in assets/cameras/ and set the image field (e.g. assets/cameras/canon-5d4.jpg) plus its license/source.
Left empty, the card shows "Photograph not yet available". No photos are included.

LIVE SOURCE: when the feed nears its end it also pages (100 at a time) through Wikidata items that are instances of camera
types and have a Commons photo (query.wikidata.org, free, no key). Records are tagged community data, not manually verified.
The feed ends only when Wikidata has no more such cameras. Offline or on errors it retries with backoff, and shows no fake cards.
