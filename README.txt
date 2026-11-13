CAMERANEXORA
Run: python3 -m http.server in this folder, then open http://localhost:8000 (fetch needs a server).
Add cameras: append lines to data/cameras-001.txt, or create cameras-002.txt, 003... (loaded in order until a file is missing).
Format: id|name|brand|world|subcategory|year|country|format|status|reference|image|image_license|description
Ids are digit strings, kept as strings, never converted to numbers. Duplicates and malformed lines are skipped.
Photos: put a verified, licensed file in assets/cameras/ and set the image field (e.g. assets/cameras/canon-5d4.jpg) plus its license/source.
Left empty, the card shows "Photograph not yet available". No photos are included.
