import math
import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets', exist_ok=True)

TOTAL_FRAMES = 24
FRAME_DURATION = 50  # ms (20 fps loop)

def create_glow_circle(draw, cx, cy, radius, color_rgb, max_alpha=180, steps=8):
    for i in range(steps, 0, -1):
        r = radius + i * 3
        alpha = int(max_alpha * (1 - i / steps) * 0.4)
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(*color_rgb, alpha))

def make_web_dev_gif():
    # 540 x 720 portrait
    w, h = 540, 720
    frames = []
    
    code_lines = [
        ("const app = createServer();", (100, 200, 255)),
        ("import { NextApp, React } from 'riyadvi';", (244, 211, 107)),
        ("async function renderMatrix(stream) {", (255, 157, 30)),
        ("  const pipeline = await stream.pipe({", (220, 220, 230)),
        ("    latency: '0.4ms',", (110, 231, 183)),
        ("    caching: 'edge-optimized',", (110, 231, 183)),
        ("    security: 'quantum-tls',", (110, 231, 183)),
        ("  });", (220, 220, 230)),
        ("  return pipeline.deploy('global');", (244, 211, 107)),
        ("}", (255, 157, 30)),
        ("export default RiyadviCloudEngine;", (255, 100, 150))
    ]

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (8, 9, 14))
        draw = ImageDraw.Draw(img, 'RGBA')
        
        # Cyber grid background
        for y in range(0, h, 40):
            grid_alpha = int(18 + 8 * math.sin(phase + y * 0.02))
            draw.line([(0, y), (w, y)], fill=(40, 60, 100, grid_alpha), width=1)
        for x in range(0, w, 40):
            grid_alpha = int(18 + 8 * math.cos(phase + x * 0.02))
            draw.line([(x, 0), (x, h)], fill=(40, 60, 100, grid_alpha), width=1)
            
        # Ambient golden/cyan glow
        glow_x = int(w * 0.5 + math.sin(phase) * 60)
        glow_y = int(h * 0.45 + math.cos(phase) * 40)
        create_glow_circle(draw, glow_x, glow_y, 90, (212, 175, 55), max_alpha=70, steps=10)
        create_glow_circle(draw, int(w * 0.7), int(h * 0.3), 70, (56, 189, 248), max_alpha=55, steps=8)

        # Holographic code editor window
        win_x1, win_y1 = 36, 70
        win_x2, win_y2 = w - 36, h - 80
        draw.rounded_rectangle([win_x1, win_y1, win_x2, win_y2], radius=16, fill=(13, 15, 23, 230), outline=(212, 175, 55, 90), width=1)
        
        # Window header
        draw.rounded_rectangle([win_x1, win_y1, win_x2, win_y1 + 38], radius=16, fill=(20, 23, 35, 255))
        # Window dots
        draw.ellipse([win_x1 + 18, win_y1 + 14, win_x1 + 28, win_y1 + 24], fill=(239, 68, 68))
        draw.ellipse([win_x1 + 36, win_y1 + 14, win_x1 + 46, win_y1 + 24], fill=(245, 158, 11))
        draw.ellipse([win_x1 + 54, win_y1 + 14, win_x1 + 64, win_y1 + 24], fill=(16, 185, 129))
        
        # Tab title
        draw.text((win_x1 + 80, win_y1 + 12), "WebCore.tsx — Riyadvi Framework", fill=(180, 190, 210))
        
        # Animated Code Lines
        start_y = win_y1 + 56
        line_height = 28
        for idx, (line_text, color) in enumerate(code_lines):
            cur_y = start_y + idx * line_height
            # Line number
            draw.text((win_x1 + 18, cur_y), f"{idx+1:02d}", fill=(70, 80, 105))
            # Text
            draw.text((win_x1 + 52, cur_y), line_text, fill=color)
            
        # Blinking / typing cursor
        cursor_y = start_y + len(code_lines) * line_height
        draw.text((win_x1 + 18, cursor_y), f"{len(code_lines)+1:02d}", fill=(70, 80, 105))
        if f % 8 < 5:
            draw.rectangle([win_x1 + 52, cursor_y + 2, win_x1 + 62, cursor_y + 18], fill=(244, 211, 107))
            
        # Floating 3D React Atom orbits
        atom_cx = int(w * 0.72)
        atom_cy = int(h * 0.75)
        create_glow_circle(draw, atom_cx, atom_cy, 14, (244, 211, 107), max_alpha=200, steps=5)
        draw.ellipse([atom_cx - 6, atom_cy - 6, atom_cx + 6, atom_cy + 6], fill=(255, 255, 255))
        
        for rot_offset in [0, math.pi / 3, -math.pi / 3]:
            rot = phase + rot_offset
            # draw rotated ellipse points
            orbit_points = []
            for deg in range(0, 360, 15):
                rad = math.radians(deg)
                ox = 55 * math.cos(rad)
                oy = 22 * math.sin(rad)
                rx = ox * math.cos(rot) - oy * math.sin(rot)
                ry = ox * math.sin(rot) + oy * math.cos(rot)
                orbit_points.append((atom_cx + rx, atom_cy + ry))
            for p_i in range(len(orbit_points)):
                p1 = orbit_points[p_i]
                p2 = orbit_points[(p_i + 1) % len(orbit_points)]
                draw.line([p1, p2], fill=(56, 189, 248, 140), width=2)
                
        # Scanning laser beam
        scan_y = int(win_y1 + 40 + ((f / TOTAL_FRAMES) * (win_y2 - win_y1 - 60)))
        draw.line([(win_x1 + 4, scan_y), (win_x2 - 4, scan_y)], fill=(244, 211, 107, 120), width=2)

        frames.append(img.convert('P', palette=Image.ADAPTIVE))
        
    frames[0].save('assets/bento_web_dev.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_web_dev.gif")

def make_custom_software_gif():
    # 720 x 420 landscape
    w, h = 720, 420
    frames = []

    nodes = [
        (120, 150, "API Gateway"),
        (260, 220, "Auth Microservice"),
        (420, 140, "Distributed Cluster"),
        (580, 230, "Cloud DB Node"),
        (340, 320, "Telemetry Stream"),
        (520, 330, "Edge Cache")
    ]

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (6, 8, 14))
        draw = ImageDraw.Draw(img, 'RGBA')

        # Ambient glow
        create_glow_circle(draw, int(w * 0.5), int(h * 0.5), 140, (30, 60, 120), max_alpha=60, steps=8)
        create_glow_circle(draw, int(w * 0.65), int(h * 0.4), 80, (212, 175, 55), max_alpha=50, steps=6)

        # Circuit grid lines
        for y in range(30, h, 50):
            draw.line([(0, y), (w, y)], fill=(25, 35, 55, 35), width=1)
        for x in range(30, w, 50):
            draw.line([(x, 0), (x, h)], fill=(25, 35, 55, 35), width=1)

        # Interconnecting pipelines with traveling pulses
        connections = [
            (0, 1), (1, 2), (2, 3), (1, 4), (4, 5), (2, 5), (0, 4)
        ]
        
        for c1, c2 in connections:
            x1, y1, _ = nodes[c1]
            x2, y2, _ = nodes[c2]
            # base pipe
            draw.line([(x1, y1), (x2, y2)], fill=(40, 70, 120, 100), width=2)
            
            # traveling packet
            t_offset = (c1 * 0.3 + c2 * 0.5)
            packet_t = (f / TOTAL_FRAMES + t_offset) % 1.0
            px = int(x1 + (x2 - x1) * packet_t)
            py = int(y1 + (y2 - y1) * packet_t)
            create_glow_circle(draw, px, py, 6, (244, 211, 107), max_alpha=220, steps=4)
            draw.ellipse([px - 3, py - 3, px + 3, py + 3], fill=(255, 255, 255))

        # Nodes
        for idx, (nx, ny, label) in enumerate(nodes):
            pulse = math.sin(phase + idx * 1.2) * 3
            nr = int(14 + pulse)
            # Outer ring
            create_glow_circle(draw, nx, ny, nr + 6, (56, 189, 248), max_alpha=120, steps=5)
            draw.ellipse([nx - nr, ny - nr, nx + nr, ny + nr], fill=(16, 24, 42), outline=(212, 175, 55), width=2)
            # Center core
            draw.ellipse([nx - 4, ny - 4, nx + 4, ny + 4], fill=(244, 211, 107))
            # Label
            draw.text((nx - 40, ny + nr + 6), label, fill=(180, 195, 220))

        # Cloud telemetry HUD stats
        draw.rounded_rectangle([30, 24, 280, 68], radius=8, fill=(12, 16, 26, 210), outline=(212, 175, 55, 80))
        draw.text((45, 32), "ENTERPRISE CLOUD ARCHITECTURE", fill=(212, 175, 55))
        draw.text((45, 48), f"Latency: 0.8ms  |  Uptime: 99.998%  |  Nodes: 64", fill=(130, 145, 170))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_custom_software.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_custom_software.gif")

def make_mobile_dev_gif():
    # 480 x 480 square
    w, h = 480, 480
    frames = []

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (8, 9, 15))
        draw = ImageDraw.Draw(img, 'RGBA')

        # Ambient glow
        create_glow_circle(draw, int(w * 0.5), int(h * 0.5), 110, (120, 60, 180), max_alpha=70, steps=8)
        create_glow_circle(draw, int(w * 0.5), int(h * 0.6), 80, (212, 175, 55), max_alpha=60, steps=6)

        # Phone frame
        pw, ph = 210, 360
        px1 = (w - pw) // 2
        py1 = (h - ph) // 2 + int(math.sin(phase) * 6)
        px2 = px1 + pw
        py2 = py1 + ph

        # Phone body
        draw.rounded_rectangle([px1, py1, px2, py2], radius=28, fill=(14, 16, 24), outline=(212, 175, 55, 160), width=2)
        # Inner screen
        sx1, sy1 = px1 + 8, py1 + 8
        sx2, sy2 = px2 - 8, py2 - 8
        draw.rounded_rectangle([sx1, sy1, sx2, sy2], radius=22, fill=(18, 20, 32))

        # Dynamic island / camera notch
        draw.rounded_rectangle([w // 2 - 28, sy1 + 6, w // 2 + 28, sy1 + 18], radius=6, fill=(8, 8, 12))

        # Mobile app cards sliding inside phone
        card_offset = int((f / TOTAL_FRAMES) * 44)
        for c_idx in range(4):
            cy = sy1 + 34 + c_idx * 68 - card_offset
            if cy + 54 > sy2 - 30 or cy < sy1 + 24:
                continue
            draw.rounded_rectangle([sx1 + 14, cy, sx2 - 14, cy + 54], radius=10, fill=(28, 32, 50, 220), outline=(56, 189, 248, 80))
            # Card icon
            draw.ellipse([sx1 + 24, cy + 14, sx1 + 50, cy + 40], fill=(212, 175, 55))
            # Text lines
            draw.rectangle([sx1 + 58, cy + 18, sx1 + 130, cy + 24], fill=(240, 240, 255))
            draw.rectangle([sx1 + 58, cy + 30, sx1 + 110, cy + 35], fill=(120, 130, 160))

        # Touch Ripple Pulse
        touch_x = w // 2 + 40
        touch_y = h // 2 + 30
        ripple_r = int(((f % 12) / 12) * 35) + 6
        ripple_alpha = int(220 * (1 - (f % 12) / 12))
        draw.ellipse([touch_x - ripple_r, touch_y - ripple_r, touch_x + ripple_r, touch_y + ripple_r], outline=(244, 211, 107, ripple_alpha), width=2)

        # Bottom navigation bar
        draw.rounded_rectangle([sx1 + 20, sy2 - 28, sx2 - 20, sy2 - 8], radius=8, fill=(26, 30, 46))
        for dot_i in range(3):
            dx = sx1 + 45 + dot_i * 50
            draw.ellipse([dx - 4, sy2 - 22, dx + 4, sy2 - 14], fill=(212, 175, 55) if dot_i == 1 else (100, 110, 140))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_mobile_dev.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_mobile_dev.gif")

def make_3d_webgl_gif():
    # 480 x 480 square
    w, h = 480, 480
    frames = []

    # 3D Icosahedron / Octahedron vertices
    base_vertices = [
        (0, 1, 0), (0, -1, 0),
        (1, 0, 0), (-1, 0, 0),
        (0, 0, 1), (0, 0, -1),
        (0.7, 0.7, 0.7), (-0.7, -0.7, -0.7),
        (-0.7, 0.7, 0.7), (0.7, -0.7, -0.7),
        (0.7, 0.7, -0.7), (-0.7, -0.7, 0.7)
    ]
    edges = [
        (0, 2), (0, 3), (0, 4), (0, 5),
        (1, 2), (1, 3), (1, 4), (1, 5),
        (2, 4), (4, 3), (3, 5), (5, 2),
        (6, 0), (6, 2), (6, 4), (7, 1), (7, 3), (7, 5)
    ]

    for f in range(TOTAL_FRAMES):
        phase = (f / TOTAL_FRAMES) * 2 * math.pi
        img = Image.new('RGB', (w, h), (6, 7, 12))
        draw = ImageDraw.Draw(img, 'RGBA')

        cx, cy = w // 2, h // 2
        scale = 110

        # Ambient glow
        create_glow_circle(draw, cx, cy, 120, (212, 175, 55), max_alpha=75, steps=9)
        create_glow_circle(draw, cx, cy, 80, (56, 189, 248), max_alpha=60, steps=7)

        # Rotated 3D vertices
        angle_y = phase
        angle_x = phase * 0.7
        
        proj_vertices = []
        for vx, vy, vz in base_vertices:
            # Y rotation
            x1 = vx * math.cos(angle_y) + vz * math.sin(angle_y)
            y1 = vy
            z1 = -vx * math.sin(angle_y) + vz * math.cos(angle_y)
            # X rotation
            x2 = x1
            y2 = y1 * math.cos(angle_x) - z1 * math.sin(angle_x)
            z2 = y1 * math.sin(angle_x) + z1 * math.cos(angle_x)
            # Perspective projection
            fov = 3.0
            p_scale = fov / (fov + z2)
            px = int(cx + x2 * scale * p_scale)
            py = int(cy + y2 * scale * p_scale)
            proj_vertices.append((px, py, z2))

        # Draw wireframe edges
        for e1, e2 in edges:
            if e1 < len(proj_vertices) and e2 < len(proj_vertices):
                x1, y1, z1 = proj_vertices[e1]
                x2, y2, z2 = proj_vertices[e2]
                alpha = int(140 + 80 * (z1 + z2) * 0.5)
                alpha = max(60, min(255, alpha))
                draw.line([(x1, y1), (x2, y2)], fill=(244, 211, 107, alpha), width=2)

        # Draw vertices with glowing nodes
        for px, py, z in proj_vertices:
            r = int(5 + (z + 1) * 2)
            create_glow_circle(draw, px, py, r + 4, (56, 189, 248), max_alpha=180, steps=4)
            draw.ellipse([px - r, py - r, px + r, py + r], fill=(255, 255, 255))

        # Spatial AR Coordinate ring
        ring_r = 145 + int(math.sin(phase * 2) * 8)
        draw.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], outline=(212, 175, 55, 50), width=1)
        
        # WebGL HUD
        draw.text((28, 28), "WEBGL 3D MATRIX ENGINE", fill=(212, 175, 55))
        draw.text((28, 46), "60 FPS  |  AR SPATIAL READY", fill=(120, 140, 170))

        frames.append(img.convert('P', palette=Image.ADAPTIVE))

    frames[0].save('assets/bento_3d_webgl.gif', save_all=True, append_images=frames[1:], duration=FRAME_DURATION, loop=0, optimize=True)
    print("Saved assets/bento_3d_webgl.gif")

if __name__ == '__main__':
    make_web_dev_gif()
    make_custom_software_gif()
    make_mobile_dev_gif()
    make_3d_webgl_gif()
    print("All 4 primary Bento animated GIFs generated successfully!")
