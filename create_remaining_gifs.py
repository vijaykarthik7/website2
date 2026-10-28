import math
import os
from PIL import Image, ImageDraw

os.makedirs('assets', exist_ok=True)

TOTAL_FRAMES = 24
FRAME_DURATION = 50

def create_glow_circle(draw, cx, cy, radius, color_rgb, max_alpha=180, steps=8):
    for i in range(steps, 0, -1):
        r = radius + i * 3
        alpha = int(max_alpha * (1 - i / steps) * 0.4)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*color_rgb, alpha))

def make_marketing_gif():
    # 720 x 420 landscape
    w, h = 720, 420
    frames = []

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (6, 8, 14))
        draw = ImageDraw.Draw(img, 'RGBA')

        # Ambient glow
        create_glow_circle(draw, int(w * 0.7), int(h * 0.35), 140, (212, 175, 55), max_alpha=70, steps=9)
        create_glow_circle(draw, int(w * 0.3), int(h * 0.6), 100, (56, 189, 248), max_alpha=50, steps=7)

        # Analytical grid
        for gy in range(80, h - 50, 45):
            draw.line([(60, gy), (w - 60, gy)], fill=(30, 40, 60, 45), width=1)
        for gx in range(60, w - 60, 80):
            draw.line([(gx, 80), (gx, h - 50)], fill=(30, 40, 60, 45), width=1)

        # Exponential growth curve points
        curve_pts = []
        for x_step in range(60, w - 60, 10):
            norm_x = (x_step - 60) / (w - 120)
            # exponential rise with subtle wave
            wave = math.sin(phase + norm_x * 4) * 8
            norm_y = (norm_x ** 2.2) * (h - 170)
            y_val = int((h - 60) - norm_y - wave)
            curve_pts.append((x_step, y_val))

        # Filled area under curve
        poly_pts = [(60, h - 50)] + curve_pts + [(w - 60, h - 50)]
        draw.polygon(poly_pts, fill=(212, 175, 55, 30))

        # Glowing curve stroke
        for i in range(len(curve_pts) - 1):
            draw.line([curve_pts[i], curve_pts[i + 1]], fill=(244, 211, 107, 240), width=3)

        # Traveling pulse marker on curve
        marker_idx = int((f / TOTAL_FRAMES) * (len(curve_pts) - 1))
        mx, my = curve_pts[marker_idx]
        create_glow_circle(draw, mx, my, 12, (255, 255, 255), max_alpha=230, steps=5)
        draw.ellipse([mx - 5, my - 5, mx + 5, my + 5], fill=(255, 255, 255))

        # HUD KPI Card
        draw.rounded_rectangle([60, 24, 340, 72], radius=8, fill=(14, 18, 28, 220), outline=(212, 175, 55, 90))
        draw.text((76, 32), "HIGH-ROI PERFORMANCE MARKETING", fill=(212, 175, 55))
        draw.text((76, 48), "Conversion Rate: +284%  |  ROAS: 6.4x", fill=(240, 245, 255))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_marketing.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_marketing.gif")

def make_ui_ux_gif():
    # 540 x 720 portrait
    w, h = 540, 720
    frames = []

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (8, 9, 14))
        draw = ImageDraw.Draw(img, 'RGBA')

        # Ambient glow
        create_glow_circle(draw, int(w * 0.5), int(h * 0.4), 130, (140, 80, 220), max_alpha=65, steps=9)
        create_glow_circle(draw, int(w * 0.65), int(h * 0.7), 100, (212, 175, 55), max_alpha=60, steps=8)

        # Dot matrix grid
        for dx in range(30, w, 30):
            for dy in range(30, h, 30):
                draw.ellipse([dx - 1, dy - 1, dx + 1, dy + 1], fill=(50, 60, 85, 80))

        # Floating Glassmorphic Component 1 (Hero Card)
        c1_y = int(90 + math.sin(phase) * 6)
        draw.rounded_rectangle([50, c1_y, w - 50, c1_y + 190], radius=16, fill=(18, 20, 32, 230), outline=(212, 175, 55, 120), width=1)
        draw.text((70, c1_y + 18), "Design System / Atomic Tokens", fill=(212, 175, 55))
        draw.rounded_rectangle([70, c1_y + 44, 210, c1_y + 80], radius=8, fill=(28, 34, 52), outline=(56, 189, 248, 80))
        draw.text((86, c1_y + 54), "Button: Primary", fill=(255, 255, 255))
        draw.rounded_rectangle([226, c1_y + 44, 366, c1_y + 80], radius=8, fill=(28, 34, 52))
        draw.text((242, c1_y + 54), "Modal: Active", fill=(160, 175, 200))
        
        # Color palettes
        swatches = [(212, 175, 55), (244, 211, 107), (56, 189, 248), (147, 51, 234), (16, 185, 129)]
        for s_i, col in enumerate(swatches):
            sx = 70 + s_i * 44
            draw.rounded_rectangle([sx, c1_y + 104, sx + 32, c1_y + 136], radius=6, fill=col)

        # Floating Component 2 (Interactive Prototype)
        c2_y = int(320 + math.cos(phase) * 6)
        draw.rounded_rectangle([50, c2_y, w - 50, c2_y + 240], radius=16, fill=(14, 16, 26, 235), outline=(56, 189, 248, 100), width=1)
        draw.text((70, c2_y + 20), "Interactive Figma Prototype", fill=(56, 189, 248))
        draw.rounded_rectangle([70, c2_y + 50, w - 70, c2_y + 150], radius=10, fill=(22, 26, 40))
        draw.text((86, c2_y + 68), "Conversion Rate Optimized Wireframe", fill=(240, 240, 255))
        draw.rectangle([86, c2_y + 96, 260, c2_y + 104], fill=(100, 115, 145))
        draw.rectangle([86, c2_y + 114, 210, c2_y + 122], fill=(100, 115, 145))

        # Animated Figma User Cursor
        cur_x = int(w * 0.45 + math.sin(phase) * 70)
        cur_y = int(c2_y + 80 + math.cos(phase) * 40)
        # Cursor arrow
        draw.polygon([(cur_x, cur_y), (cur_x + 16, cur_y + 12), (cur_x + 6, cur_y + 16)], fill=(244, 211, 107))
        draw.rounded_rectangle([cur_x + 14, cur_y + 14, cur_x + 68, cur_y + 32], radius=4, fill=(212, 175, 55))
        draw.text((cur_x + 18, cur_y + 16), "Designer", fill=(5, 5, 8))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_ui_ux.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_ui_ux.gif")

def make_ecommerce_gif():
    # 480 x 480 square
    w, h = 480, 480
    frames = []

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (8, 9, 15))
        draw = ImageDraw.Draw(img, 'RGBA')

        create_glow_circle(draw, w // 2, h // 2, 110, (212, 175, 55), max_alpha=70, steps=8)
        create_glow_circle(draw, w // 2, int(h * 0.65), 80, (16, 185, 129), max_alpha=60, steps=6)

        # 3D Checkout Card
        cw, ch = 340, 260
        cx1 = (w - cw) // 2
        cy1 = (h - ch) // 2 + int(math.sin(phase) * 5)
        cx2 = cx1 + cw
        cy2 = cy1 + ch

        draw.rounded_rectangle([cx1, cy1, cx2, cy2], radius=18, fill=(15, 18, 28), outline=(212, 175, 55, 140), width=2)
        # Header
        draw.text((cx1 + 24, cy1 + 22), "HEADLESS E-COMMERCE ENGINE", fill=(212, 175, 55))
        # Cart total
        draw.text((cx1 + 24, cy1 + 54), "$2,480.00 USD", fill=(255, 255, 255))
        draw.text((cx1 + 200, cy1 + 58), "SUB-SECOND CHECKOUT", fill=(16, 185, 129))

        # Dynamic Cart items
        for item_i in range(2):
            iy = cy1 + 96 + item_i * 44
            draw.rounded_rectangle([cx1 + 24, iy, cx2 - 24, iy + 36], radius=6, fill=(24, 28, 42))
            draw.ellipse([cx1 + 34, iy + 8, cx1 + 54, iy + 28], fill=(56, 189, 248))
            draw.rectangle([cx1 + 66, iy + 14, cx1 + 170, iy + 22], fill=(220, 225, 240))
            draw.text((cx2 - 80, iy + 10), "$1,240", fill=(244, 211, 107))

        # Instant Payment Verified Badge
        badge_y = cy1 + 192
        draw.rounded_rectangle([cx1 + 24, badge_y, cx2 - 24, badge_y + 44], radius=8, fill=(16, 185, 129, 45), outline=(16, 185, 129))
        draw.text((cx1 + 45, badge_y + 14), "✓ 0.04s Instant Stripe/Shopify Sync", fill=(110, 231, 183))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_ecommerce.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_ecommerce.gif")

def make_seo_smm_gif():
    # 480 x 480 square
    w, h = 480, 480
    frames = []

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (7, 8, 14))
        draw = ImageDraw.Draw(img, 'RGBA')

        cx, cy = w // 2, h // 2

        create_glow_circle(draw, cx, cy, 110, (212, 175, 55), max_alpha=75, steps=8)
        create_glow_circle(draw, cx, cy, 70, (56, 189, 248), max_alpha=60, steps=6)

        # Concentric Radar rings
        for ring_r in [60, 110, 160]:
            draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], outline=(35, 50, 75, 90), width=1)

        # Rotating radar sweep line
        sweep_rad = phase
        sweep_x = cx + int(160 * math.cos(sweep_rad))
        sweep_y = cy + int(160 * math.sin(sweep_rad))
        draw.line([(cx, cy), (sweep_x, sweep_y)], fill=(244, 211, 107, 160), width=2)

        # #1 Golden Rank Badge in center
        badge_r = 38
        create_glow_circle(draw, cx, cy, badge_r + 6, (244, 211, 107), max_alpha=200, steps=5)
        draw.ellipse([cx - badge_r, cy - badge_r, cx + badge_r, cy + badge_r], fill=(18, 22, 35), outline=(212, 175, 55), width=2)
        draw.text((cx - 18, cy - 14), "#1", fill=(244, 211, 107))
        draw.text((cx - 24, cy + 6), "RANK", fill=(255, 255, 255))

        # Radiating keyword node points
        nodes = [
            (cx - 95, cy - 75, "ReactJS"),
            (cx + 90, cy - 65, "WordPress"),
            (cx - 80, cy + 90, "SMM Viral"),
            (cx + 85, cy + 85, "Organic #1")
        ]
        for nx, ny, nlabel in nodes:
            create_glow_circle(draw, nx, ny, 6, (56, 189, 248), max_alpha=160, steps=3)
            draw.ellipse([nx - 4, ny - 4, nx + 4, ny + 4], fill=(255, 255, 255))
            draw.text((nx - 24, ny + 8), nlabel, fill=(180, 195, 220))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_seo_smm.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_seo_smm.gif")

if __name__ == '__main__':
    make_marketing_gif()
    make_ui_ux_gif()
    make_ecommerce_gif()
    make_seo_smm_gif()
    print("All 8 service animated GIFs created successfully!")
