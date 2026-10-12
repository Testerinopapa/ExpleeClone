from PIL import Image

img = Image.open('b2bpage/Screenshot (3976).png')
w, h = img.size

# Crop the Data Categories section (from y ~ 150 to 950)
crop = img.crop((int(w * 0.1), int(h * 0.18), int(w * 0.9), int(h * 0.95)))
crop.save('verification_screenshots/ref_data_categories.png')
print('Saved ref_data_categories.png')
