from PIL import Image

img = Image.open('b2bpage/Screenshot (3975).png')
print('Screenshot size:', img.size)

# The US card is in the top-left of the grid
# Let's crop roughly x from 100 to 600, y from 200 to 450
w, h = img.size
crop1 = img.crop((int(w * 0.1), int(h * 0.22), int(w * 0.4), int(h * 0.4)))
crop1.save('verification_screenshots/ref_us_card.png')
print('Saved ref_us_card.png')
