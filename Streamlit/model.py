import argparse
from ultralytics import YOLO
import os
from pathlib import Path

def predict_and_save(image_path: str, model_path: str = 'best.pt', output_dir: str = 'output') -> str:
    # Create output directory if it doesn't exist
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Load the model
    try:
        model = YOLO(model_path)
    except Exception as e:
        raise RuntimeError(f"Failed to load model from {model_path}: {e}")

    # Perform prediction
    try:
        results = model(image_path)
    except Exception as e:
        raise RuntimeError(f"Prediction failed for image {image_path}: {e}")

    # Save the results
    input_path = Path(image_path)
    output_path = output_dir / f"{input_path.stem}_pred{input_path.suffix}"
    
    try:
        results[0].save(output_path)
    except Exception as e:
        raise RuntimeError(f"Failed to save prediction result to {output_path}: {e}")
    
    return str(output_path)

def main():
    parser = argparse.ArgumentParser(description="YOLOv11 Prediction Script")
    parser.add_argument("image_path", help="Path to the input image")
    parser.add_argument("--model", default="best.pt", help="Path to the YOLO model file")
    parser.add_argument("--output", default="output", help="Output directory for predictions")
    
    args = parser.parse_args()
    
    try:
        saved_path = predict_and_save(args.image_path, args.model, args.output)
        print(f"Prediction saved to: {saved_path}")
    except Exception as e:
        print(f"Error: {e}")
        exit(1)

if __name__ == "__main__":
    main()
