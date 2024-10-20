import os
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'mov', 'avi'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Dummy data - replace with your database later
users = []
uploads = []

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    user = {
        'id': len(users) + 1,
        'username': data['username'],
        'email': data['email']
    }
    users.append(user)
    return jsonify({"message": "User registered successfully", "user": user}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user = next((user for user in users if user['username'] == data['username']), None)
    if user:
        return jsonify({"message": "Login successful", "user": user})
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/api/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        uploads.append({"filename": filename})
        return jsonify({"message": "File uploaded successfully", "filename": filename}), 201
    return jsonify({"error": "File type not allowed"}), 400

@app.route('/api/uploads', methods=['GET'])
def get_uploads():
    return jsonify(uploads)

@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)