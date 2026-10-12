from PIL import Image

ref = Image.open('explorerpage/Screenshot (4019).png')
print("Reference size:", ref.size)

# Crop cluster 10, cluster 2, cluster 8, cluster 0, cluster 3, cluster 4
crops = {
    'ref_top_left': (0, 92, 600, 200),
    'ref_cluster_10': (300, 250, 900, 650),
    'ref_cluster_8_9_2': (1050, 180, 1400, 500),
    'ref_cluster_0': (1400, 200, 1920, 650),
    'ref_cluster_3': (1200, 600, 1700, 1000),
    'ref_cluster_4_6_5': (200, 550, 1200, 980)
}

for name, box in crops.items():
    ref.crop(box).save(f'verification_screenshots/{name}.png')

print("Saved reference crops for detailed inspection.")
