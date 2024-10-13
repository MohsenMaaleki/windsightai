# app.py
import streamlit as st
from dashboard import create_dashboard
from PIL import Image
import os

# Set page config
st.set_page_config(page_title="WindSightAI: Turbine Blade Defect Detection", layout="wide")

# Sidebar
st.sidebar.title("Navigation")
page = st.sidebar.radio("Go to", ["Home", "Dashboard"])

def load_images_from_directory(directory):
    images = []
    if os.path.exists(directory):
        for filename in os.listdir(directory):
            if filename.endswith(('.png', '.jpg', '.jpeg')):
                img_path = os.path.join(directory, filename)
                images.append((Image.open(img_path), filename))
    else:
        st.warning(f"Directory '{directory}' not found. Please check the path.")
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

    # Detection Results Section
    st.header("Defect Detection Results")
    detected_images = load_images_from_directory('detected_images')
    
    if detected_images:
        display_images(detected_images)
    else:
        st.info("No detected images found. Please add some images to the 'detected_images' folder.")
        st.write(f"Current working directory: {os.getcwd()}")
        st.write(f"Contents of current directory: {os.listdir('.')}")

    # Statistics and Plots Section
    st.header("Statistics and Plots")
    stat_images = load_images_from_directory('statistics_plots')
    
    if stat_images:
        display_images(stat_images, columns=2)  # Using 2 columns for potentially larger plot images
    else:
        st.info("No statistics or plot images found. Please add some images to the 'statistics_plots' folder.")
        st.write(f"Current working directory: {os.getcwd()}")
        st.write(f"Contents of current directory: {os.listdir('.')}")

elif page == "Dashboard":
    st.title("Detection Dashboard")
    create_dashboard()
    
