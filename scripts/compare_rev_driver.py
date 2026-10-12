from PIL import Image

# Crop revenue driver section from current screenshot and compare with ref (3977)
curr = Image.open('verification_screenshots/b2b/revenue_driver_current.png')
w, h = curr.size

# In revenue_driver_current.png, the section is in the lower half
crop_curr = curr.crop((int(w * 0.1), int(h * 0.55), int(w * 0.9), int(h * 0.95)))
crop_curr.save('verification_screenshots/b2b/revenue_driver_crop.png')
print('Saved revenue_driver_crop.png')

# In ref (3977), crop the same region
ref = Image.open('b2bpage/Screenshot (3977).png')
rw, rh = ref.size
crop_ref = ref.crop((int(rw * 0.1), int(rh * 0.28), int(rw * 0.9), int(rh * 0.72)))
crop_ref.save('verification_screenshots/b2b/revenue_driver_ref_crop.png')
print('Saved revenue_driver_ref_crop.png')
