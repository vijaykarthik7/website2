import math
import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets', exist_ok=True)

TOTAL_FRAMES = 24
FRAME_DURATION = 50

def create_glow_circle(draw, cx, cy, radius, color_rgb, max_alpha=180, steps=8):
    for i in range(steps, 0, -1):
        r = radius + i * 3
        alpha = int(max_alpha * (1 - i / steps) * 0.4)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*color_rgb, alpha))

def make_game_dev_gif():
    w, h = 480, 480
    frames = []

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (8, 9, 15))
        draw = ImageDraw.Draw(img, 'RGBA')

        cx, cy = w // 2, h // 2

        # Ambient Glow
        create_glow_circle(draw, cx, cy, 130, (212, 175, 55), max_alpha=70, steps=8)
        create_glow_circle(draw, cx, cy - 30, 90, (34, 197, 94), max_alpha=55, steps=7)

        # Tactical background grid
        for gy in range(40, h, 35):
            alpha = int(20 + 8 * math.sin(phase + gy * 0.03))
            draw.line([(30, gy), (w - 30, gy)], fill=(40, 60, 50, alpha), width=1)
        for gx in range(40, w, 35):
            alpha = int(20 + 8 * math.cos(phase + gx * 0.03))
            draw.line([(gx, 40), (gx, h - 40)], fill=(40, 60, 50, alpha), width=1)

        # Rotating outer tactical radar ring
        r_outer = 115
        draw.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=(212, 175, 55, 90), width=1)
        
        # Segmented reticle tick marks
        num_ticks = 16
        for t in range(num_ticks):
            angle = phase + (t / num_ticks) * 2 * math.pi
            r1 = r_outer + 4
            r2 = r_outer + (12 if t % 4 == 0 else 7)
            x1 = cx + math.cos(angle) * r1
            y1 = cy + math.sin(angle) * r1
            x2 = cx + math.cos(angle) * r2
            y2 = cy + math.sin(angle) * r2
            col = (244, 211, 107, 200) if t % 4 == 0 else (120, 150, 130, 120)
            draw.line([(x1, y1), (x2, y2)], fill=col, width=2 if t % 4 == 0 else 1)

        # Stylized Game Controller / Joystick wireframe silhouette in center
        pad_w, pad_h = 160, 90
        pad_x1, pad_y1 = cx - pad_w // 2, cy - pad_h // 2 + 10
        pad_x2, pad_y2 = cx + pad_w // 2, cy + pad_h // 2 + 10
        draw.rounded_rectangle([pad_x1, pad_y1, pad_x2, pad_y2], radius=28, fill=(16, 20, 26, 230), outline=(212, 175, 55, 180), width=2)
        
        # D-pad on left
        dpad_cx, dpad_cy = pad_x1 + 38, cy + 10
        d_size = 12
        draw.rectangle([dpad_cx - 4, dpad_cy - d_size, dpad_cx + 4, dpad_cy + d_size], fill=(212, 175, 55, 220))
        draw.rectangle([dpad_cx - d_size, dpad_cy - 4, dpad_cx + d_size, dpad_cy + 4], fill=(212, 175, 55, 220))

        # Action Buttons (A, B, X, Y) on right
        btn_cx, btn_cy = pad_x2 - 38, cy + 10
        b_rad = 12
        b_coords = [
            (btn_cx, btn_cy - b_rad, (56, 189, 248)),  # Y
            (btn_cx + b_rad, btn_cy, (239, 68, 68)),   # B
            (btn_cx, btn_cy + b_rad, (34, 197, 94)),   # A
            (btn_cx - b_rad, btn_cy, (245, 158, 11))   # X
        ]
        for bx, by, bcol in b_coords:
            draw.ellipse([bx - 4, by - 4, bx + 4, by + 4], fill=bcol)

        # Thumbsticks with active movement
        stick_l_x = dpad_cx + 22 + int(math.cos(phase * 1.5) * 5)
        stick_l_y = cy + 22 + int(math.sin(phase * 1.5) * 5)
        draw.ellipse([stick_l_x - 10, stick_l_y - 10, stick_l_x + 10, stick_l_y + 10], fill=(24, 28, 38), outline=(100, 120, 150), width=2)
        draw.ellipse([stick_l_x - 4, stick_l_y - 4, stick_l_x + 4, stick_l_y + 4], fill=(212, 175, 55))

        stick_r_x = btn_cx - 22 + int(math.sin(phase) * 5)
        stick_r_y = cy + 22 + int(math.cos(phase) * 5)
        draw.ellipse([stick_r_x - 10, stick_r_y - 10, stick_r_x + 10, stick_r_y + 10], fill=(24, 28, 38), outline=(100, 120, 150), width=2)
        draw.ellipse([stick_r_x - 4, stick_r_y - 4, stick_r_x + 4, stick_r_y + 4], fill=(56, 189, 248))

        # Dynamic crosshair sweep
        sweep_angle = phase * 2
        sweep_len = 65
        sw_x = cx + math.cos(sweep_angle) * sweep_len
        sw_y = cy + math.sin(sweep_angle) * sweep_len
        draw.line([(cx, cy), (sw_x, sw_y)], fill=(34, 197, 94, 160), width=2)
        create_glow_circle(draw, int(sw_x), int(sw_y), 6, (34, 197, 94), max_alpha=220, steps=4)

        # HUD Telemetry Banner
        draw.rounded_rectangle([32, 28, 330, 72], radius=8, fill=(12, 16, 22, 220), outline=(212, 175, 55, 90))
        draw.text((46, 36), "REALTIME GAME ENGINE // UE5 & UNITY", fill=(212, 175, 55))
        draw.text((46, 52), "120 FPS  |  Physics: Chaos 60Hz  |  C++ Shaders", fill=(160, 180, 205))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_game_dev.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_game_dev.gif")

def make_ar_vr_gif():
    w, h = 480, 480
    frames = []

    # 3D Cube vertices for spatial tracking
    cube_nodes = [
        (-1, -1, -1), (1, -1, -1), (1, 1, -1), (-1, 1, -1),
        (-1, -1, 1), (1, -1, 1), (1, 1, 1), (-1, 1, 1)
    ]
    cube_edges = [
        (0, 1), (1, 2), (2, 3), (3, 0),
        (4, 5), (5, 6), (6, 7), (7, 4),
        (0, 4), (1, 5), (2, 6), (3, 7)
    ]

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (7, 8, 16))
        draw = ImageDraw.Draw(img, 'RGBA')

        cx, cy = w // 2, h // 2

        # Ambient spatial glow
        create_glow_circle(draw, cx, cy, 140, (56, 189, 248), max_alpha=65, steps=9)
        create_glow_circle(draw, cx, cy, 80, (212, 175, 55), max_alpha=70, steps=7)

        # Spatial 3D horizon grid with perspective
        horizon_y = cy + 40
        for i in range(-5, 6):
            start_x = cx + i * 20
            end_x = cx + i * 75
            draw.line([(start_x, horizon_y), (end_x, h - 20)], fill=(40, 70, 110, 45), width=1)
        for depth in range(4):
            dy = horizon_y + int(math.pow(depth / 3, 1.4) * (h - 20 - horizon_y))
            draw.line([(30, dy), (w - 30, dy)], fill=(40, 70, 110, 45), width=1)

        # Rotating Spatial Coordinate Cube (AR holographic bounding volume)
        angle_y = phase
        angle_x = phase * 0.6
        scale = 65
        
        proj_cube = []
        for vx, vy, vz in cube_nodes:
            # Y rotation
            x1 = vx * math.cos(angle_y) + vz * math.sin(angle_y)
            y1 = vy
            z1 = -vx * math.sin(angle_y) + vz * math.cos(angle_y)
            # X rotation
            x2 = x1
            y2 = y1 * math.cos(angle_x) - z1 * math.sin(angle_x)
            z2 = y1 * math.sin(angle_x) + z1 * math.cos(angle_x)
            # perspective
            fov = 3.2
            p_scale = fov / (fov + z2)
            px = int(cx + x2 * scale * p_scale)
            py = int((cy - 25) + y2 * scale * p_scale)
            proj_cube.append((px, py, z2))

        # Draw cube edges
        for e1, e2 in cube_edges:
            x1, y1, z1 = proj_cube[e1]
            x2, y2, z2 = proj_cube[e2]
            alpha = int(140 + 80 * (z1 + z2) * 0.5)
            alpha = max(60, min(255, alpha))
            draw.line([(x1, y1), (x2, y2)], fill=(56, 189, 248, alpha), width=2)

        # Draw cube vertex anchors
        for px, py, z in proj_cube:
            r = int(4 + (z + 1) * 2)
            create_glow_circle(draw, px, py, r + 4, (212, 175, 55), max_alpha=180, steps=4)
            draw.ellipse([px - r, py - r, px + r, py + r], fill=(255, 255, 255))

        # 6DoF Orbiting Spatial Coordinate Rings
        for rot_off, col in [(0, (212, 175, 55)), (math.pi / 2, (56, 189, 248))]:
            rot = phase + rot_off
            pts = []
            for deg in range(0, 360, 15):
                rad = math.radians(deg)
                ox = 110 * math.cos(rad)
                oy = 40 * math.sin(rad)
                rx = ox * math.cos(rot * 0.5) - oy * math.sin(rot * 0.5)
                ry = ox * math.sin(rot * 0.5) + oy * math.cos(rot * 0.5)
                pts.append((int(cx + rx), int((cy - 25) + ry)))
            for i in range(len(pts)):
                draw.line([pts[i], pts[(i + 1) % len(pts)]], fill=(*col, 70), width=1)

        # Stylized VR Headset outline at bottom center
        h_w, h_h = 130, 45
        hx1, hy1 = cx - h_w // 2, cy + 75
        hx2, hy2 = cx + h_w // 2, cy + 75 + h_h
        draw.rounded_rectangle([hx1, hy1, hx2, hy2], radius=16, fill=(18, 22, 34, 230), outline=(56, 189, 248, 160), width=2)
        # Visor glass reflection wave
        vis_glow_x = int(hx1 + 20 + ((f / TOTAL_FRAMES) * (h_w - 40)))
        draw.line([(vis_glow_x, hy1 + 6), (vis_glow_x + 16, hy2 - 6)], fill=(255, 255, 255, 120), width=3)
        # Spatial sensors
        draw.ellipse([hx1 + 14, hy1 + 16, hx1 + 22, hy1 + 24], fill=(212, 175, 55))
        draw.ellipse([hx2 - 22, hy1 + 16, hx2 - 14, hy1 + 24], fill=(212, 175, 55))

        # HUD Telemetry Box
        draw.rounded_rectangle([32, 28, 330, 72], radius=8, fill=(12, 16, 24, 220), outline=(56, 189, 248, 90))
        draw.text((46, 36), "SPATIAL AR/VR COMPUTING // 6-DoF", fill=(56, 189, 248))
        draw.text((46, 52), "VisionOS & Meta Quest  |  WebXR  |  Unity XR", fill=(190, 210, 240))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_ar_vr.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_ar_vr.gif")

if __name__ == '__main__':
    make_game_dev_gif()
    make_ar_vr_gif()
