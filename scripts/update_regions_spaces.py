import json

with open('src/data/b2bRegions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# The exact 9 regions with proper spacing:
clean_data = [
    ("North America", "4 countries", "26M+ NA companies"),
    ("Europe", "49 countries", "31M+ EU companies"),
    ("Asia Pacific", "16 countries", "13M+ APAC companies"),
    ("Southeast Asia", "11 countries", "4M+ SEA companies"),
    ("Latin America", "50 countries", "6M+ LATAM companies"),
    ("Middle East", "15 countries", "3M+ MENA companies"),
    ("CIS Countries", "12 countries", "3M+ CIS companies"),
    ("Oceania", "23 countries", "2M+ OCE companies"),
    ("Africa", "58 countries", "2M+ AFR companies"),
]

for item, (title, countries, companies) in zip(data, clean_data):
    item['title'] = title
    item['countries'] = countries
    item['companies'] = companies

with open('src/data/b2bRegions.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("Updated src/data/b2bRegions.json successfully!")
