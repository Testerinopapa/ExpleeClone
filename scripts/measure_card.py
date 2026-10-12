from PIL import Image

full_img = Image.open('b2bpage/Screenshot (3975).png').convert('RGB')
w, h = full_img.size

# Let's inspect vertical slice through the US card at x=250
# Find where background ends and card begins
col_x = 250
card_starts = []
card_ends = []
in_card = False

for y in range(150, 1000):
    r, g, b = full_img.getpixel((col_x, y))
    # card interior is slightly brighter than background (around > 18)
    # background is around 9, 11, 11
    is_card = (r > 15 or g > 17 or b > 17)
    if is_card and not in_card:
        card_starts.append(y)
        in_card = True
    elif not is_card and in_card:
        card_ends.append(y)
        in_card = False

print('Card starts at x=250:', card_starts)
print('Card ends at x=250:', card_ends)
for s, e in zip(card_starts, card_ends):
    print(f"Card y={s}..{e}, height={e - s}px")

# Also find horizontal card width at y=300
row_y = 300
card_x_starts = []
card_x_ends = []
in_card = False
for x in range(100, 1800):
    r, g, b = full_img.getpixel((x, row_y))
    is_card = (r > 15 or g > 17 or b > 17)
    if is_card and not in_card:
        card_x_starts.append(x)
        in_card = True
    elif not is_card and in_card:
        card_x_ends.append(x)
        in_card = False

print('Card x starts at y=300:', card_x_starts)
print('Card x ends at y=300:', card_x_ends)
for s, e in zip(card_x_starts, card_x_ends):
    print(f"Card x={s}..{e}, width={e - s}px")
