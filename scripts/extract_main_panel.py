with open('b2bpage/b2b-database.html', 'r', encoding='utf-8') as f:
    c = f.read()

idx = c.find('General data')
print("General data index:", idx)
# Let's search after the nav sidebar
idx_nav = c.find('</nav>', idx)
print("</nav> index:", idx_nav)

with open('b2bpage/main_panel_snippet.html', 'w', encoding='utf-8') as out:
    out.write(c[idx_nav:idx_nav + 5000])
print("Saved main_panel_snippet.html")
