from PIL import Image
import os

os.makedirs('public/static/images', exist_ok=True)

img = Image.open('explorerpage/live_dump/explorer_ai_meeting.png')
# Rect of preview image in 1920x1080:
# From cluster master 1 dump: rect={'x': 143.6, 'y': 244.8, 'width': 896, 'height': 385.41} scaled to 1920x1080 (factor 1920/1191.2 = 1.6118)
# Let's inspect where it is in img
w, h = img.size
print(f"Image size: {w}x{h}")

# In 1920x1080:
# x: ~512 to 1408 (width ~896)
# y: ~250 to 630
box = (512, 245, 1408, 630)
crop = img.crop(box)
crop.save('public/static/images/explorer-preview.jpg', quality=95)
print("Saved public/static/images/explorer-preview.jpg")
