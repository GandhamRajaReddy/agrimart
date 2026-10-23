# Karnataka administrative location data

- `karnataka_regions.json` contains 31 districts and 240 taluks/sub-districts, with LGD codes.
- Village records are generated locally by `python manage.py sync_karnataka_locations` from the Karnataka village CSV maintained by the India Village Finder project, sourced from the Government of India's Local Government Directory (LGD).
- Source: https://github.com/mchittineni/india-village-finder
- Official verification: https://lgdirectory.gov.in/
- Government data licensing/attribution details: https://github.com/mchittineni/india-village-finder/blob/main/DATA_LICENSE.md

Administrative boundaries change. Refresh this dataset before production releases and verify new districts/taluks against LGD.
