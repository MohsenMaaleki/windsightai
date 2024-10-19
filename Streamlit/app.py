# app.py
import streamlit as st
from dashboard import create_dashboard
from PIL import Image
import os
from ultralytics import YOLO
import tempfile

# Set page config
st.set_page_config(page_title="WindSightAI: Turbine Blade Defect Detection", layout="wide")

# Sidebar
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Home", "Dashboard"])


# test
# Add GitHub link to sidebar
st.sidebar.markdown("---")
st.sidebar.markdown("[GitHub Repository](https://github.com/MohsenMaaleki/windsightai)")
st.sidebar.markdown("---")

script_dir = os.path.dirname(os.path.abspath(__file__))

def load_images_from_directory(directory):
    images = []
    full_path = os.path.join(script_dir, directory)
    if os.path.exists(full_path):
        for filename in os.listdir(full_path):
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                img_path = os.path.join(full_path, filename)
                images.append((Image.open(img_path), filename))
    else:
        st.warning(f"Directory '{full_path}' not found. Please check the path.")
    return images

def display_images(images, columns=3):
    cols = st.columns(columns)
    for idx, (img, filename) in enumerate(images):
        cols[idx % columns].image(img, use_column_width=True, caption=filename)

# Main content
if page == "Home":
    st.title("WindSightAI: Revolutionizing Wind Turbine Maintenance")
    
    st.markdown("""
    Welcome to WindSightAI, the cutting-edge solution for wind turbine blade inspection. Our advanced AI-powered system transforms the way we detect and analyze defects, ensuring optimal performance and longevity of wind energy infrastructure.

    ## Key Features:

    - **AI-Driven Precision**: Harness the power of state-of-the-art YOLO-based deep learning models for accurate defect detection.
    - **Drone Integration**: Seamlessly analyze high-resolution images captured by drones, enabling comprehensive inspections without the need for turbine downtime.
    - **Real-Time Insights**: Get instant results and visualizations, allowing for quick decision-making and maintenance prioritization.
    - **Enhanced Safety**: Reduce the need for dangerous manual inspections by leveraging our automated analysis tools.
    - **Cost-Effective**: Minimize maintenance costs and maximize energy production through early defect detection and targeted repairs.

    Explore the future of renewable energy maintenance with WindSightAI. Scroll down to see detection results and statistics!
    """)

    # Add image upload feature
    st.header("Upload and Analyze Your Own Image")
    uploaded_file = st.file_uploader("Choose an image...", type=["jpg", "jpeg", "png"])
    
    if uploaded_file is not None:
        # Display the uploaded image
        image = Image.open(uploaded_file)
        st.image(image, caption="Uploaded Image", use_column_width=True)
        
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
            tmp_file.write(uploaded_file.getvalue())
            tmp_file_path = tmp_file.name

        # Load the YOLO model
        model = YOLO(os.path.join(script_dir, "weights", "best.pt"))  # load your custom model

        # Perform prediction
        if st.button("Analyze Image"):
            with st.spinner("Analyzing image..."):
                results = model(tmp_file_path)  # Remove save=True
                
                # Display the result
                for r in results:
                    boxes = r.boxes  # Bounding box objects
                    im_array = r.plot()  # plot a BGR numpy array of predictions
                    im = Image.fromarray(im_array[..., ::-1])  # RGB PIL image
                    st.image(im, caption="Analyzed Image with Detections", use_column_width=True)
                
                # Display detection information
                st.subheader("Detection Results:")
                for box in boxes:
                    conf = box.conf.item()
                    cls = int(box.cls.item())
                    class_name = model.names[cls]
                    st.write(f"Detected: {class_name}, Confidence: {conf:.2f}")

        # Clean up the temporary file
        os.unlink(tmp_file_path)

    # Detection Results Section
    st.header("Sample Defect Detection Results")
    detected_images = load_images_from_directory('detected_images')
    
    if detected_images:
        display_images(detected_images)
    else:
        st.info("No detected images found. Please add some images to the 'detected_images' folder.")
        st.write(f"Current working directory: {os.getcwd()}")
        st.write(f"Contents of current directory: {os.listdir('.')}")

elif page == "Dashboard":
    st.title("Detection Dashboard")
    create_dashboard()
    
    # Statistics and Plots Section
    st.header("Statistics and Plots")
    stat_images = load_images_from_directory('statistics_plots')
    
    if stat_images:
        display_images(stat_images, columns=2)  # Using 2 columns for potentially larger plot images
    else:
        st.info("No statistics or plot images found. Please add some images to the 'statistics_plots' folder.")
        st.write(f"Current working directory: {os.getcwd()}")
        st.write(f"Contents of current directory: {os.listdir('.')}")

        
