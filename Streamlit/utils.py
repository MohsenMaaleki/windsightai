# utils.py
from PIL import Image, ImageDraw

def visualize_detections(image, detections):
    draw = ImageDraw.Draw(image)
    for det in detections:
        x1, y1, x2, y2 = det['bbox']
        draw.rectangle([x1, y1, x2, y2], outline="red", width=2)
        draw.text((x1, y1), f"{det['class']}: {det['confidence']:.2f}", fill="red")
    return image